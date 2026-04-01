import { axiosClient } from "@/lib/axios";

// ========================
// API CALLS
// ========================

export const adminSubmissionApi = {
  claimSubmission: (id: string) => axiosClient.post(`/api/admin/claim/${id}`),

  approveSubmission: (id: string) => axiosClient.post(`/api/admin/approve/${id}`),

  rejectSubmission: (id: string, reason: string) =>
    axiosClient.post(`/api/admin/reject/${id}`, {
      rejection_reason: reason,
    }),
};
