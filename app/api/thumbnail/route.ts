import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies } from '../lib/utils';

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

    try {
        const thumbnail = await fetch(thumbnailUrl, {
            method: "GET",
            headers: { Authorization: "Bearer " + auth.accessToken },
        });

        const buffer = await thumbnail.arrayBuffer();

        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });
    } catch (error) {
        console.error(`Error fetching thumbnail from ${thumbnailUrl}:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
