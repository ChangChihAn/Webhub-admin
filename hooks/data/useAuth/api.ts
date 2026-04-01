import { axiosClient } from "../../../lib/axios";
import {
  LoginRequest,
  AuthResponse,
  Verify2FARequest,
  Verify2FAResponse,
} from "./service.type";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<AuthResponse>(
      "/api/auth/login",
      credentials,
    );
    return data;
  },

  verify2FA: async (payload: Verify2FARequest): Promise<Verify2FAResponse> => {
    const { data } = await axiosClient.post<Verify2FAResponse>(
      "/api/auth/2fa/verify",
      payload,
    );
    return data;
  },

  me: async (): Promise<AuthResponse> => {
    const { data } = await axiosClient.get<AuthResponse>("/api/auth/me");
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosClient.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },
};
