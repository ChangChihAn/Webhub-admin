import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import { Verify2FARequest } from "./service.type";

export const useVerify2FA = () => {
  return useMutation({
    mutationFn: (payload: Verify2FARequest) => authApi.verify2FA(payload),
  });
};
