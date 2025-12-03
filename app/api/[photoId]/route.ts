import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies } from '../lib/utils';
import { StreetViewAPI } from '../lib/streetview';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ photoId: string }> }
) {
    const auth = await getAuthFromCookies();
    const { photoId } = await params;

    if (!auth?.accessToken) {
        console.warn("Unauthorized delete attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const api = new StreetViewAPI(auth.accessToken);
    try {
        await api.deletePhoto(photoId);
        console.log(`Photo ${photoId} deleted successfully`);
        return NextResponse.json({ message: "Photo deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting photo ${photoId}:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ photoId: string }> }
) {
    const auth = await getAuthFromCookies();
    const { photoId } = await params;

    if (!auth?.accessToken) {
        console.warn("Unauthorized update attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bodyBuffer = Buffer.from(await request.arrayBuffer());
    const parsed = JSON.parse(bodyBuffer.toString());
    parsed.captureTime = new Date(parsed.captureTime).toISOString();

    const api = new StreetViewAPI(auth.accessToken);
    try {
        const updatedPhoto = await api.updatePhoto(photoId, parsed);
        console.log(`Photo ${photoId} updated successfully`);
        return NextResponse.json(updatedPhoto, { status: 200 });
    } catch (error) {
        console.error(`Error updating photo ${photoId}:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ photoId: string }> }
) {
    const auth = await getAuthFromCookies();
    const { photoId } = await params;

    if (!auth?.accessToken) {
        console.warn("Unauthorized GET attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const api = new StreetViewAPI(auth.accessToken);
    try {
        const photo = await api.getPhoto(photoId);
        console.log(`Photo ${photoId} retrieved successfully`);

        photo.downloadUrl = photo.downloadUrl || photo.thumbnailUrl;
        const response = await fetch(photo.downloadUrl)

        return new NextResponse(response.body, {
            headers: {
                "Content-Type": "image/jpeg",
                // To allow client caching (optional)
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error(`Error retrieving photo ${photoId}:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}