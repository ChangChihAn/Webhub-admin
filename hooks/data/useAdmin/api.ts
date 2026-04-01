import { axiosClient } from "../../../lib/axios";

export const adminApi = {
  getDevelopers: async () => {
    const res = await axiosClient.get("/api/admin/developers");
    return res.data;
  },

  getQueue: async (status?: string) => {
    const { data } = await axiosClient.get("/api/admin/queue", {
      params: status ? { status } : {},
    });
    return data;
  },

  getSubmissionDetail: async (id: string) => {
    const { data } = await axiosClient.get(`/api/admin/submissions/${id}`);
    return data;
  },

  rejectSubmission: async (id: string, reason: string) => {
    const { data } = await axiosClient.post(`/api/admin/reject/${id}`, {
      rejection_reason: reason,
    });
    return data;
  },

  approveSubmission: async (id: string) => {
    const { data } = await axiosClient.post(`/api/admin/approve/${id}`);
    return data;
  },

  updateUserRole: async (id: string, role: string) => {
    const res = await axiosClient.put(`/api/user/${id}`, {
      role,
    });
    return res.data;
  },

  getUsers: async () => {
    const res = await axiosClient.get("/api/user");
    return res.data;
  },

  getApps: async () => {
    const res = await axiosClient.get("/api/admin/apps");
    return res.data;
  },

  updateAppStatus: async (appId: string, status: string) => {
    const res = await axiosClient.put(`/api/admin/apps/${appId}/status`, {
      status,
    });
    return res.data;
  },
};
