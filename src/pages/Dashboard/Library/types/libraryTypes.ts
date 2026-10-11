export type ResourceCategory =
  | "study-material"
  | "past-question"
  | "textbook"
  | "lecture-slides"
  | "assignment";

export type ResourceStatus = "pending" | "approved" | "rejected" | "flagged";

export type ReportReason =
  | "incorrect"
  | "inappropriate"
  | "unauthorized"
  | "duplicate"
  | "other";

export type ResourceSort =
  | "recent"
  | "oldest"
  | "popular"
  | "downloads"
  | "views"
  | "title";

export interface Uploader {
  _id: string;
  name: string;
  email?: string;
  picture?: string | { url?: string } | null;
}

export interface LibraryResource {
  _id: string;
  uploaderId: Uploader | string;
  title: string;
  description?: string;
  category: ResourceCategory;
  courseCode?: string;
  subject?: string;
  department?: string;
  level?: string;
  session?: string;
  tags: string[];
  fileName: string;
  fileSize: number;
  fileType: string;
  fileMimeType?: string;
  pageCount?: number;
  allowDownload: boolean;
  status: ResourceStatus;
  rejectionReason?: string;
  reviewedByAi?: boolean;
  viewCount: number;
  downloadCount: number;
  bookmarkCount: number;
  openReportCount: number;
  createdAt: string;
  updatedAt: string;
  // added by the API
  isBookmarked?: boolean;
  isOwner?: boolean;
  canDownload?: boolean;
}

export interface PaginatedResources {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  resources: LibraryResource[];
}

export interface CategoryCount {
  key: ResourceCategory;
  count: number;
}

export interface LibraryFilters {
  departments: string[];
  subjects: string[];
  courseCodes: string[];
  levels: string[];
}

export interface ResourceListParams {
  q?: string;
  category?: ResourceCategory | "";
  courseCode?: string;
  department?: string;
  level?: string;
  sort?: ResourceSort;
  page?: number;
  limit?: number;
}

export interface PreviewResponse {
  previewMode: "pdf" | "image" | "text" | "office";
  url: string;
  viewerUrl?: string;
  fileName: string;
  fileType: string;
  mimeType?: string;
  pageCount?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface QuizResponse {
  title: string;
  resourceId: string;
  questions: QuizQuestion[];
}

export interface UploadResourcePayload {
  file: File;
  title: string;
  description?: string;
  category: ResourceCategory;
  courseCode?: string;
  subject?: string;
  department?: string;
  level?: string;
  session?: string;
  tags: string[];
  allowDownload: boolean;
}

/* ── Moderation ── */
export interface ModerationStats {
  pending: number;
  flagged: number;
  openReports: number;
  approved: number;
  rejected: number;
}

export interface LibraryReportItem {
  _id: string;
  reason: ReportReason;
  details?: string;
  status: "open" | "dismissed" | "resolved";
  createdAt: string;
  reporterId?: { _id: string; name: string } | null;
  resourceId?: {
    _id: string;
    title: string;
    courseCode?: string;
    category: ResourceCategory;
    status: ResourceStatus;
    openReportCount: number;
    uploaderId?: { _id: string; name: string } | null;
  } | null;
}

export interface PaginatedReports {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  reports: LibraryReportItem[];
}