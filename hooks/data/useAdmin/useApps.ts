import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";

export const APPS_KEY = "admin-apps";

// GET LIST
export const useApps = () => {
  return useQuery({
    queryKey: [APPS_KEY],
    queryFn: adminApi.getApps,
  });
};

// UPDATE STATUS
export const useUpdateAppStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      status,
    }: {
      appId: string;
      status: "published" | "suspended";
    }) => adminApi.updateAppStatus(appId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_KEY] });
    },
  });
};
