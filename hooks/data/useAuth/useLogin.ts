import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import { LoginRequest } from "./service.type";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
  });
};
