import axios from "axios";
import authHeader from "./header";
import type { OAuthSSOUrlPayload } from "../@types/auth";
import type { APIResponse } from "../@types/api";
import type { OAuthTokenPayload } from "../@types/session";
import type { AuthCredentials, SignUpCredentials } from "../@types/auth";

const baseURL = import.meta.env.VITE_API_URL;
const REDIRECT_URI = `${import.meta.env.VITE_APP_HOST}`;

const classicSignUp = async (
  credentials: SignUpCredentials,
): Promise<APIResponse<OAuthTokenPayload>> => {
  try {
    const { data } = await axios.post<APIResponse<OAuthTokenPayload>>(
      `${baseURL}/api/v1/auth/email/signup?app_name=com.neuri.quickflow&scopes=neuri.account+neuri.quickflow`,
      {
        name: credentials.name,
        last_name: credentials.last_name,
        email: credentials.email,
        password: credentials.password,
      },
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

const emailSignIn = async (
  credentials: AuthCredentials,
): Promise<APIResponse<OAuthTokenPayload>> => {
  try {
    const form = new URLSearchParams();

    form.append("username", credentials.email);
    form.append("password", credentials.password);
    form.append("scope", "neuri.account+neuri.quickflow");

    const { data } = await axios.post<APIResponse<OAuthTokenPayload>>(
      `${baseURL}/api/v1/auth/email/?app_name=com.neuri.quickflow`,
      form,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

const googleAuth = async () => {
  const response = await axios
    .get<APIResponse<OAuthSSOUrlPayload>>(
      `${baseURL}/api/v1/auth/google/signin?redirect_url=${REDIRECT_URI}&app_name=com.neuri.quickflow&scopes=neuri.account%2Bneuri.quickflow`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  return response;
};

const forgotPassword = async (email: string) => {
  try {
    const { data } = await axios.post<APIResponse>(
      `${baseURL}/api/v1/auth/email/forgot`,
      { email },
      {
        params: { reset_url: `${REDIRECT_URI}/reset-password`},
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

const resetPassword = async (password: string, token: string) => {
  try {
    const { data } = await axios.put<APIResponse>(
      `${baseURL}/api/v1/auth/email`,
      { password, token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
}

const logout = async () => {
  try {
    const { data } = await axios.post<APIResponse>(
      `${baseURL}/api/v1/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      },
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

const AuthorizationService = {
  googleAuth,
  logout,
  emailSignIn,
  classicSignUp,
  forgotPassword,
  resetPassword,
};

export default AuthorizationService;