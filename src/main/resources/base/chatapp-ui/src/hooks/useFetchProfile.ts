import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/userSlice";
import AccountService from "../services/account";
import secureLocalStorage from "../utils/secureStorage";
import type { JWToken } from "../@types/session";
import type { APIResponse, APIError } from "../@types/api";
import type { User } from "../@types/user";

// ... otros imports

export const useFetchProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = secureLocalStorage.getItem("session") as JWToken | null;

  const query = useQuery({
    queryKey: ["profile", session],
    queryFn: async () => {
      const response = (await AccountService.getAccountDetails()) as
        | APIResponse<User>
        | APIError<null>;

      if (response.data) {
        dispatch(setUser(response.data));
      }
      return response.data;
    },
    enabled: !!session,
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching profile:", query.error);
      // retry renew session or redirect to login
      secureLocalStorage.clear();
      navigate("/");
    }
  }, [query.isError, query.error, navigate]);

  return query;
};