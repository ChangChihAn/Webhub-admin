import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../lib/axios";
import { Developer } from "../../../types";

export const DEVELOPERS_KEY = "developers";

const mapDeveloper = (item: any): Developer => ({
  id: item.id,
  email: item.email,
  fullName: item.full_name,
  isActive: item.is_active,
  createdAt: item.created_at,
  appCount: item.app_count,
  role: item.role,
});

export const useDevelopers = () => {
  return useQuery({
    queryKey: [DEVELOPERS_KEY],
    queryFn: async () => {
      const res = await axiosClient.get("/api/admin/developers");

      // 🔥 QUAN TRỌNG: backend trả data trong data
      return res.data.data.map(mapDeveloper);
    },
  });
};
