import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";

export const useUpdateAppStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "published" | "suspended";
    }) => adminApi.updateAppStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });
};
