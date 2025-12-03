import { OAuth2Client } from "google-auth-library";
import { AUTH_SCOPE, X_CLIENT_ID, X_CLIENT_SECRET } from "./consts";

export const OAUTH2_CLIENT = new OAuth2Client(X_CLIENT_ID, X_CLIENT_SECRET, "https://photosphere.sowinski.tech/api/auth");

export async function getOAuthToken() {
    const authorizeUrl = OAUTH2_CLIENT.generateAuthUrl({
        access_type: 'offline',
        scope: AUTH_SCOPE,
        prompt: 'consent',
    });

    return authorizeUrl
}
