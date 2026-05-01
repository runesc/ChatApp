export interface OAuthSSOUrlPayload {
    auth_url: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
  last_name: string;
  confirmPassword: string;
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface PasswordResetCredentials {
  password: string;
  confirmPassword: string;
}