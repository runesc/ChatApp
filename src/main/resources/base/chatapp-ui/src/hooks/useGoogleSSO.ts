import { useMutation } from "@tanstack/react-query";
import AuthorizationService from "../services/auth";
import type { APIError } from "../@types/api";

export const useGoogleSSO = (onErrorCallback?: (error: APIError) => void) => {
  return useMutation({
    mutationFn: async () => {
      const response = await AuthorizationService.googleAuth();
      if (response.status_code !== 200) {
        throw new Error(response.error_msg || "Failed to get Google SSO URL");
      }
      return response.data.auth_url;
    },
    onSuccess: (authUrl) => {
      window.location.href = authUrl;
    },
    onError: (error: APIError) => {
      if (onErrorCallback) {
        onErrorCallback(error);
      } else {
        console.error("SSO Error:", error);
      }
    },
  });
};