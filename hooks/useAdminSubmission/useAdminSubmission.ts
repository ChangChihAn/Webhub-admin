import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSubmissionApi } from "./api";
import { ADMIN_SUBMISSION_KEY } from "./key";

// ========================
// HOOK
// ========================

export const useAdminSubmission = () => {
  const queryClient = useQueryClient();

  // ========================
  // CLAIM
  // ========================
  const claimMutation = useMutation({
    mutationFn: (id: string) => adminSubmissionApi.claimSubmission(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-queue"],
      });
      queryClient.invalidateQueries({
        queryKey: [ADMIN_SUBMISSION_KEY],
      });
    },
  });

  // ========================
  // APPROVE
  // ========================
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminSubmissionApi.approveSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-queue"] });
      queryClient.invalidateQueries({ queryKey: ["submission-detail"] });
    },
    onError: (err) => {
      console.error("APPROVE ERROR:", err);
    },
  });

  // ========================
  // REJECT
  // ========================
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminSubmissionApi.rejectSubmission(id, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-queue"],
      });
      queryClient.invalidateQueries({
        queryKey: [ADMIN_SUBMISSION_KEY],
      });
    },
  });

  return {
    // ACTIONS
    claimSubmission: claimMutation.mutate,
    approveSubmission: approveMutation.mutate,
    rejectSubmission: rejectMutation.mutate,

    // STATES
    isClaiming: claimMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
