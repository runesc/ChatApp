export interface JWToken {
    access_token: string;
    expires_in: number;
    refresh_token: string;
};


export interface OAuthTokenPayload {
  oauthToken: string;
}