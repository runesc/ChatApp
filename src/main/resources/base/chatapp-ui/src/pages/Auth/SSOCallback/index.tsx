import React, { useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "../../../utils/secureStorage";
import { useQueryClient } from "@tanstack/react-query";
import type { JWToken } from "../../../@types/session";
import { useFetchProfile } from "../../../hooks/useFetchProfile";

const SSOCallback: React.FC = () => {
  const { refetch: fetchUserProfile } = useFetchProfile();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const partialToken = searchParams.get("partial");

  useEffect(() => {
    if (partialToken) {
      try {
        const decodedToken = jwtDecode<JWToken>(partialToken);

        if (decodedToken.access_token) {
          secureLocalStorage.setItem("session", {
            access_token: decodedToken.access_token,
            expires_in: decodedToken.expires_in,
            refresh_token: decodedToken.refresh_token,
          });

          queryClient.invalidateQueries({ queryKey: ["qf-access"] });

          fetchUserProfile();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [partialToken, queryClient, fetchUserProfile]);

  if (partialToken) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Navigate to="/" replace />;
};

export default SSOCallback;