import { axiosClient } from '../../../lib/axios';
import { LoginRequest, AuthResponse } from './service.type';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<AuthResponse>('/api/auth/login', credentials);
    return data;
  },
  
  logout: async (): Promise<void> => {
    // Assuming a standard logout endpoint exists, otherwise just local cleanup
    // await axiosClient.post('/api/auth/logout');
  },
  
  me: async (): Promise<AuthResponse> => {
    const { data } = await axiosClient.get<AuthResponse>('/api/auth/me');
    return data;
  }
};