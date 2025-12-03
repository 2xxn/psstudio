import { NextRequest, NextResponse } from 'next/server';
import { getOAuthToken, OAUTH2_CLIENT } from '../lib/oauth';
import { encryptTextAES } from '../lib/utils';
import { CBC_KEY } from '../lib/consts';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (code) {
            const token = await OAUTH2_CLIENT.getToken(code);

            if (!token.tokens.access_token || !token.tokens.refresh_token) {
                console.warn("Missing access or refresh token");
                return new NextResponse(
                    `<script>window.opener.postMessage('auth_error', '*');window.close();</script>`,
                    {
                        status: 200,
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    }
                );
            }

            const encryptedAccessToken = encryptTextAES(
                token.tokens.access_token,
                CBC_KEY
            );
            const encryptedRefreshToken = encryptTextAES(
                token.tokens.refresh_token,
                CBC_KEY
            );

            const response = new NextResponse(
                `<script>window.opener.postMessage('auth_success', '*');window.close();</script>`,
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html',
                    },
                }
            );

            response.cookies.set('accessToken', encryptedAccessToken, { httpOnly: true });
            response.cookies.set('refreshToken', encryptedRefreshToken, { httpOnly: true });

            console.log("OAuth tokens encrypted and stored in cookies");
            return response;
        }

        const authorizeUrl = await getOAuthToken();
        return new NextResponse(authorizeUrl, { status: 200 });
    } catch (err) {
        console.error("Error during /auth:", err);
        return new NextResponse(
            `<script>window.opener.postMessage('auth_error', '*');window.close();</script>`,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        );
    }
}
