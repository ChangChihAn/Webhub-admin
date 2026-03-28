import { axiosClient } from "../../../lib/axios";
import {
  LoginRequest,
  AuthResponse,
  Verify2FARequest,
  Verify2FAResponse,
} from "./service.type";

export const authApi = {
  // ========================
  // LOGIN (STEP 1)
  // ========================
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<AuthResponse>(
      "/api/auth/login",
      credentials,
    );
    return data;
  },

  // ========================
  // VERIFY 2FA (STEP 2)
  // ========================
  verify2FA: async (payload: Verify2FARequest): Promise<Verify2FAResponse> => {
    const { data } = await axiosClient.post<Verify2FAResponse>(
      "/api/auth/verify-2fa",
      payload,
    );
    return data;
  },

  // ========================
  // GET CURRENT USER
  // ========================
  me: async (): Promise<AuthResponse> => {
    const { data } = await axiosClient.get<AuthResponse>("/api/auth/me");
    return data;
  },

  // ========================
  // LOGOUT
  // ========================
  logout: async (): Promise<void> => {
    try {
      await axiosClient.post("/api/auth/logout");
    } catch (err) {
      // backend có thể không cần logout API
    } finally {
      // 🔥 luôn clear local
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },
};
