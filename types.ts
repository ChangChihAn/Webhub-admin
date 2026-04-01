// =========================
// 1. COMMON API TYPES
// =========================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// =========================
// 2. AUTH (BACKEND FORMAT)
// =========================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_email_verified: boolean;
  is_active: boolean;
  profile_picture_url: string | null;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  two_fa_enabled: boolean;
  two_fa_secret: boolean;
}

export interface LoginResponse {
  data?: User;
  access_token?: string;
  token?: string;
  requires_2fa: boolean;
  temp_token?: string;
}

// =========================
// 3. ENUM (FRONTEND NORMALIZED)
// =========================

export enum UserRole {
  ADMIN = "ADMIN",
  DEVELOPER = "DEVELOPER",
  USER = "USER",
}

export enum AppStatus {
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

// =========================
// 4. BACKEND RAW TYPES (QUAN TRỌNG)
// =========================

// 👉 Queue API trả về
export interface SubmissionQueueItemResponse {
  id: string;
  app_id?: string;
  app_name: string;
  developer_id?: string;
  developer_name: string;
  version_number: string;
  submitted_at: string;
  status: string; // pending | approved | rejected
}

// 👉 Detail API trả về
export interface SubmissionDetailResponse extends SubmissionQueueItemResponse {
  manifest?: AppManifest;
  source_url?: string;
  preview_url?: string;
  security_checklist?: SecurityCheckItemResponse[];
  rejection_reason?: string;
}

// 👉 Security checklist từ backend
export interface SecurityCheckItemResponse {
  id: string;
  label: string;
  checked?: boolean;
  required?: boolean;
}

// =========================
// 5. FRONTEND UI TYPES (CLEAN)
// =========================

export interface ReviewQueueItem {
  id: string;
  appId: string;
  appName: string;
  developerName: string;
  version_number: string;
  submittedAt: string;
  status: AppStatus;
}

export interface AppManifest {
  name: string;
  version_number: string;
  description: string;
  permissions: string[];
  themeColor?: string;
  icons?: { src: string; sizes: string; type: string }[];
}

export interface SecurityCheckItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

export interface AppSubmission {
  id: string;
  appId: string;
  appName: string;

  developerId: string;
  developerName: string;

  version: string;
  submittedAt: string;
  status: AppStatus;

  manifest: AppManifest;

  sourceUrl: string;
  previewUrl: string;

  securityChecklist: SecurityCheckItem[];

  rejectionReason?: string;
  reviewerId?: string;
}

// =========================
// 6. DEVELOPER
// =========================

export interface Developer {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  appCount: number;
  role: string;
}

// =========================
// 7. AUTH STATE (FRONTEND)
// =========================

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  developerName: string;
  status: "published" | "suspended";
  createdAt: string;
  isFeatured: boolean;
}
