import axios from "axios";
import authHeader from "./header";
import type { APIResponse } from "../@types/api";
import type { User } from "../@types/user";

const baseURL = import.meta.env.VITE_API_URL;

const getAccountDetails = async () => {
  try {
    const { data } = await axios.get<APIResponse<User>>(
      `${baseURL}/api/v1/user/`,
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

const AccountService = {
  getAccountDetails,
};

export default AccountService;