import { User } from "../../../types";

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

// ========================
// LOGIN RESPONSE
// ========================
export interface AuthResponse {
  status: number;
  message: string;
  requires_2fa?: boolean;
  temp_token?: string;

  access_token?: string; // chỉ có khi login không cần 2FA
  data?: User;
}

// ========================
// VERIFY 2FA
// ========================
export interface Verify2FARequest {
  temp_token: string;
  code: string;
}

export interface Verify2FAResponse {
  status: number;
  message: string;
  access_token: string;
  data: User;
}
