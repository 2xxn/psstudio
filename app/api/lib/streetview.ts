import { BASE_URL } from "./consts";
import { Photo } from "./types";
import { grabEditedParams } from "./utils";

export class StreetViewAPI {
    constructor(private accessToken: string) { }

    async deletePhoto(photoId: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${photoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.accessToken }
        });

        if (!response.ok) {
            throw new Error('Failed to delete photo: ' + response.statusText);
        }
    }

    async updatePhoto(photoId: string, photoData: Partial<Photo>): Promise<Photo> {
        const params = grabEditedParams(photoData);

        const updateMask = params.join(',');
        if (updateMask.length === 0) {
            throw new Error('No fields to update');
        }

        const qs = new URLSearchParams({ updateMask });
        console.log(`${BASE_URL}/${photoId}?${qs}`);
        const response = await fetch(`${BASE_URL}/${photoId}?${qs}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photoData)
        });

        if (!response.ok) {
            throw new Error('Failed to update photo: ' + response.statusText);
        }

        const json = await response.json() as any;
        if (json.error) {
            throw new Error('Error updating photo: ' + JSON.stringify(json.error));
        }

        return json;
    }

    async listPhotos(): Promise<any> {
        const response = await fetch(BASE_URL + 's', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.accessToken }
        });

        if (!response.ok) {
            throw new Error('Failed to list photos: ' + response.statusText);
        }

        const json = await response.json() as any;
        if (json.error) {
            throw new Error('Error listing photos: ' + JSON.stringify(json.error));
        }

        return json;
    }

    async getPhoto(photoId: string): Promise<Photo> {
        const response = await fetch(`${BASE_URL}/${photoId}?view=INCLUDE_DOWNLOAD_URL`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + this.accessToken }
        });

        if (!response.ok) {
            throw new Error('Failed to get photo: ' + response.statusText);
        }

        const json = await response.json() as any;
        if (json.error) {
            throw new Error('Error getting photo: ' + JSON.stringify(json.error));
        }

        return json;
    }

    async startUpload(length: number): Promise<string> {
        // Make a call to the Google API
        const upload = await fetch(BASE_URL + ':startUpload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.accessToken,
                "Content-Type": "image/jpeg",
                'Content-Length': String(length),
                "X-Goog-Upload-Protocol": "raw",
                "X-Goog-Upload-Content-Length": String(length)
            }
        });

        const json = await upload.json() as any;
        if (!json.uploadUrl) {
            throw new Error('Failed to start upload: ' + JSON.stringify(json));
        }

        console.log(`Successfully retrieved upload URL: ${json.uploadUrl}...`);

        return json.uploadUrl;
    }

    async uploadPhoto(uploadUrl: string, photoData: Uint8Array): Promise<void> {
        const headers = {
            "Authorization": `Bearer ${this.accessToken}`,
            "Content-Type": "image/jpeg",
            "X-Goog-Upload-Protocol": "raw",
            "X-Goog-Upload-Content-Length": String(photoData.length)
        }

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: headers,
            body: photoData as any
        });

        if (!response.ok) {
            throw new Error('Failed to upload photo: ' + response.statusText);
        }

        console.log('Photo uploaded successfully.');
    }

    async publishPhoto(uploadUrl: string, photoMetadata: Partial<Photo>): Promise<void> {
        // TODO: left off here


        const photo = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "uploadReference": {
                    "uploadUrl": uploadUrl
                },
                ...photoMetadata
            })
        });

        if (!photo.ok) {
            console.error('Failed to publish photo:', await photo.json());
            throw new Error('Failed to publish photo: ' + photo.statusText);
        }

        const json = await photo.json() as any;
        if (json.error) {
            throw new Error('Error publishing photo: ' + JSON.stringify(json.error));
        }

        return json;
    }

}
