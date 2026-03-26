import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import { LoginRequest, AuthResponse } from './service.type';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response: AuthResponse) => {
      // Handle various token locations (root, data, or access_token field)
      const token = response.access_token || response.token;
      
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      
      // Cache the user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    },
  });
};