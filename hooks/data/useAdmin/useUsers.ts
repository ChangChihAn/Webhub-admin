import { useQuery } from "@tanstack/react-query";
import { adminApi } from "./api";

export const USERS_KEY = "admin-users";

export const useUsers = () => {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: adminApi.getUsers,
  });
};
