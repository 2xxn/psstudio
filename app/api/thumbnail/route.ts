import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies } from '../lib/utils';

const ALLOWED_THUMBNAIL_HOST = 'lh3.googleusercontent.com';
const MAX_THUMBNAIL_BYTES = 10 * 1024 * 1024;

export async function GET(request: NextRequest) {
    const auth = await getAuthFromCookies();
    const { searchParams } = new URL(request.url);
    const thumbnailUrl = searchParams.get('thumbnailUrl');

    if (!auth?.accessToken) {
        console.warn("Unauthorized request to /thumbnail");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!thumbnailUrl) {
        return NextResponse.json({ error: "Missing thumbnailUrl parameter" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(thumbnailUrl);
    } catch {
        return NextResponse.json({ error: "Invalid thumbnailUrl parameter" }, { status: 400 });
    }

    if (
        parsedUrl.protocol !== 'https:' ||
        parsedUrl.hostname !== ALLOWED_THUMBNAIL_HOST ||
        parsedUrl.username ||
        parsedUrl.password ||
        (parsedUrl.port && parsedUrl.port !== '443')
    ) {
        return NextResponse.json({ error: "Invalid thumbnailUrl parameter" }, { status: 400 });
    }

    try {
        const thumbnail = await fetch(parsedUrl.toString(), {
            method: "GET",
            headers: { Authorization: "Bearer " + auth.accessToken },
            redirect: "error",
            cache: "no-store",
        });

        const contentLength = thumbnail.headers.get('content-length');
        if (contentLength) {
            const declaredLength = Number(contentLength);
            if (Number.isFinite(declaredLength) && declaredLength > MAX_THUMBNAIL_BYTES) {
                if (thumbnail.body) {
                    await thumbnail.body.cancel().catch(() => undefined);
                }
                return NextResponse.json({ error: "Thumbnail too large" }, { status: 413 });
            }
        }

        const chunks: Uint8Array[] = [];
        let totalBytes = 0;

        if (thumbnail.body) {
            const reader = thumbnail.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                totalBytes += value.byteLength;
                if (totalBytes > MAX_THUMBNAIL_BYTES) {
                    await reader.cancel().catch(() => undefined);
                    return NextResponse.json({ error: "Thumbnail too large" }, { status: 413 });
                }

                chunks.push(value);
            }
        } else {
            const buffer = new Uint8Array(await thumbnail.arrayBuffer());
            if (buffer.byteLength > MAX_THUMBNAIL_BYTES) {
                return NextResponse.json({ error: "Thumbnail too large" }, { status: 413 });
            }
            chunks.push(buffer);
        }

        return new NextResponse(Buffer.concat(chunks), {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });
    } catch (error) {
        console.error("Error fetching thumbnail:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
