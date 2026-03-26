import { User } from '../../../types';

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

export interface AuthResponse {
  data: User;
  token?: string; 
  access_token?: string;
}
