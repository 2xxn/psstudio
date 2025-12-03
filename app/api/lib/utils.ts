import * as crypto from 'crypto';
import { CBC_KEY } from './consts';
import { cookies } from 'next/headers';

export function parseRegardlessJSON(input: Buffer) {
    try {
        // Try parsing the whole string (in case it's just valid JSON)
        const parsed = JSON.parse(input.toString());
        return { data: parsed, bytes: new Uint8Array(0) };
    } catch (e) {
        if (e instanceof SyntaxError) {
            const match = e.message.match(/position (\d+)/);
            if (match) {
                const pos = parseInt(match[1], 10);
                const jsonStr = input.subarray(0, pos);
                const rest = input.subarray(pos);
                try {
                    const parsed = JSON.parse(jsonStr.toString());
                    return { data: parsed, bytes: rest };
                } catch (e2) {
                    // JSON portion was still invalid
                    return { data: null, bytes: input };
                }
            }
        }
        // Fallback if we can't parse anything
        return { data: null, bytes: input };
    }
}

export function encryptTextAES(text: string, key: Buffer): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export function decryptTextAES(encrypted: string, key: Buffer): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}

export async function getAuthFromCookies(): Promise<{ accessToken: string, refreshToken: string } | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken || !refreshToken) {
        return null;
    }

    return {
        accessToken: decryptTextAES(accessToken, CBC_KEY),
        refreshToken: decryptTextAES(refreshToken, CBC_KEY)
    };
}

export function camelToSnakeCase(obj: string): string {
    return obj.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const UPDATE_MASK = ["pose.heading", "pose.lat_lng_pair", "pose.pitch", "pose.roll", "pose.level", "pose.altitude", "connections", "places"];

export function grabEditedParams(body: { [key: string]: any }, skipNext = false): string[] {
    if (!body || typeof body !== 'object') {
        return [];
    }

    return Object.keys(body).reduce((acc: any[], key: string) => {
        if (typeof body[key] == 'object' && !skipNext) {
            const subKeys = grabEditedParams(body[key], true);
            acc.push(...subKeys.map(subKey => `${camelToSnakeCase(key)}.${camelToSnakeCase(subKey)}`));
        } else acc.push(camelToSnakeCase(key));
        return skipNext ? acc : acc.filter(k => UPDATE_MASK.includes(k));
    }, []);
}
