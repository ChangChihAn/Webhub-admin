import { axiosClient } from "@/lib/axios";

// ========================
// API CALLS
// ========================

export const adminSubmissionApi = {
  claimSubmission: (id: string) => axiosClient.post(`/admin/claim/${id}`),

  approveSubmission: (id: string) => axiosClient.post(`/admin/approve/${id}`),

  rejectSubmission: (id: string, reason: string) =>
    axiosClient.post(`/admin/reject/${id}`, {
      reason,
    }),
};
