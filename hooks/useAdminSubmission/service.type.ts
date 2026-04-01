// ========================
// TYPES
// ========================

export type SubmissionId = string;

export interface ClaimSubmissionResponse {
  id: string;
  version_id: string;
  submitted_by: string;
  claimed_by: string;
  status: string;
  rejection_reason: string | null;
  submitted_at: string;
  claimed_at: string;
  reviewed_at: string | null;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}