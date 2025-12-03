export const AUTH_SCOPE = process.env.AUTH_SCOPE! || 'https://www.googleapis.com/auth/streetviewpublish';
export const BASE_URL = process.env.BASE_URL! || "https://streetviewpublish.googleapis.com/v1/photo"

export const X_CLIENT_ID = process.env.X_CLIENT_ID!
export const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET!
export const REDIRECT_URI = process.env.REDIRECT_URI!;

export const CBC_KEY = Buffer.from(process.env.CBC_KEY!, 'utf-8'); // 32 bytes for AES-256
