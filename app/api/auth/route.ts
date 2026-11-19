import { NextRequest, NextResponse } from 'next/server';
import { getOAuthToken, OAUTH2_CLIENT } from '../lib/oauth';
import { encryptTextAES } from '../lib/utils';
import { CBC_KEY } from '../lib/consts';
import * as crypto from 'crypto';

const OAUTH_STATE_COOKIE = 'oauthState';

function createAuthPopupResponse(message: 'auth_success' | 'auth_error'): NextResponse {
    const response = new NextResponse(
        `<script>if (window.opener) { window.opener.postMessage('${message}', window.location.origin); } window.close();</script>`,
        {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        }
    );

    response.cookies.delete({ name: OAUTH_STATE_COOKIE, path: '/' });
    return response;
}

function isValidOAuthState(expected: string | undefined, received: string | undefined): boolean {
    if (!expected || !received) {
        return false;
    }

    // Hash both values so the comparison is timing-safe regardless of their lengths.
    const expectedHash = crypto.createHash('sha256').update(expected).digest();
    const receivedHash = crypto.createHash('sha256').update(received).digest();

    return crypto.timingSafeEqual(expectedHash, receivedHash);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (code) {
            const state = searchParams.get('state') ?? undefined;
            const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

            if (!isValidOAuthState(expectedState, state)) {
                console.warn("Invalid OAuth state");
                return createAuthPopupResponse('auth_error');
            }

            const token = await OAUTH2_CLIENT.getToken(code);

            if (!token.tokens.access_token || !token.tokens.refresh_token) {
                console.warn("Missing access or refresh token");
                return createAuthPopupResponse('auth_error');
            }

            const encryptedAccessToken = encryptTextAES(
                token.tokens.access_token,
                CBC_KEY
            );
            const encryptedRefreshToken = encryptTextAES(
                token.tokens.refresh_token,
                CBC_KEY
            );

            const response = createAuthPopupResponse('auth_success');
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax" as const,
                path: "/",
            };

            response.cookies.set('accessToken', encryptedAccessToken, cookieOptions);
            response.cookies.set('refreshToken', encryptedRefreshToken, cookieOptions);

            console.log("OAuth tokens encrypted and stored in cookies");
            return response;
        }

        const state = crypto.randomBytes(32).toString('hex');
        const authorizeUrl = await getOAuthToken(state);
        const response = new NextResponse(authorizeUrl, { status: 200 });

        response.cookies.set(OAUTH_STATE_COOKIE, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("Error during /auth:", err);
        return createAuthPopupResponse('auth_error');
    }
}
