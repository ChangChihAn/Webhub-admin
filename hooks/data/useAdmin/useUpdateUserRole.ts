import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminApi.updateUserRole(id, role),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });
};
