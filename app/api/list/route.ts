import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies } from '../lib/utils';
import { StreetViewAPI } from '../lib/streetview';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthFromCookies();

        if (!auth?.accessToken) {
            console.warn("Unauthorized request to /list");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const api = new StreetViewAPI(auth.accessToken);
        const photos = await api.listPhotos();
        console.log(`Fetched ${photos.length || 0} photos`);
        return NextResponse.json(photos);
    } catch (error) {
        console.error("Error in /list:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
