import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies, parseRegardlessJSON } from '../lib/utils';
import { StreetViewAPI } from '../lib/streetview';
import { Photo } from '../lib/types';

const MAX_UPLOAD_BYTES = 80 * 1024 * 1024;

export async function POST(request: NextRequest) {
    const auth = await getAuthFromCookies();

    if (!auth?.accessToken) {
        console.warn("Unauthorized request to /upload");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength) {
        const declaredLength = Number(contentLength);
        if (Number.isFinite(declaredLength) && declaredLength > MAX_UPLOAD_BYTES) {
            console.warn("Upload request body too large");
            return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        }
    }

    const bodyBuffer = Buffer.from(await request.arrayBuffer());

    if (bodyBuffer.byteLength > MAX_UPLOAD_BYTES) {
        console.warn("Upload request body too large");
        return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    let { data, bytes }: { data: Partial<Photo>; bytes: any } = parseRegardlessJSON(bodyBuffer);
    bytes = Buffer.from(bytes) as Buffer;

    console.log("Upload request parsed", {
        data,
        bytesLength: bytes?.length,
    });

    if (!data || !bytes) {
        console.warn("Invalid request body in /upload");
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!data.pose?.latLngPair || !data.captureTime) {
        console.warn("Missing pose.latLngPair or captureTime");
        return NextResponse.json(
            { error: "Missing required fields: pose.latLngPair and captureTime" },
            { status: 400 }
        );
    }

    const api = new StreetViewAPI(auth.accessToken);
    try {
        const uploadUrl = await api.startUpload(bytes.byteLength);

        const headers = {
            Authorization: `Bearer ${auth.accessToken}`,
            "Content-Type": "image/jpeg",
            "X-Goog-Upload-Protocol": "raw",
            "X-Goog-Upload-Content-Length": String(bytes.length),
        };

        await fetch(uploadUrl, {
            method: "POST",
            headers,
            body: bytes,
        });

        const result = await api.publishPhoto(uploadUrl, data);
        console.log("Photo published successfully", { photoId: (result as any).photoId?.id });

        if ((result as any).photoId?.id) {
            api.getPhoto((result as any).photoId.id).then((photo) => {
                console.log("Photo details:", photo);
            });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error uploading photo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
