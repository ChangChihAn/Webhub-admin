import { User } from "../../../types";

// ========================
// REQUEST
// ========================
export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

// ========================
// COMMON RESPONSE DATA
// ========================
export interface AuthPayload {
  access_token: string;
  user: User;
}

// ========================
// LOGIN RESPONSE
// ========================
export interface AuthResponse {
  status: number;
  message: string;

  // 🔥 CASE 2FA
  requires_2fa?: boolean;
  temp_token?: string;

  // 🔥 CASE SUCCESS
  data?: AuthPayload;
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
  data: AuthPayload;
}
