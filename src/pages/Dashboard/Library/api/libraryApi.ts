import { apiDelete, apiGet, apiPost } from "../../../../services/apiCall";
import type {
  CategoryCount,
  LibraryFilters,
  LibraryResource,
  ModerationStats,
  PaginatedReports,
  PaginatedResources,
  PreviewResponse,
  QuizResponse,
  ReportReason,
  ResourceListParams,
  UploadResourcePayload,
} from "../types/libraryTypes";

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

const toQuery = (params: Record<string, string | number | undefined | null>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
};

/* ── Browse ── */
export const getResourcesApi = (p: ResourceListParams): Promise<PaginatedResources> =>
  apiGet(`/library/resources${toQuery({ ...p })}`);

export const getPopularApi = (limit = 8): Promise<{ resources: LibraryResource[] }> =>
  apiGet(`/library/resources/popular?limit=${limit}`);

export const getCategoriesApi = (): Promise<{ categories: CategoryCount[] }> =>
  apiGet("/library/categories");

export const getFiltersApi = (): Promise<LibraryFilters> => apiGet("/library/filters");

export const getMyResourcesApi = (page = 1): Promise<PaginatedResources> =>
  apiGet(`/library/resources/mine?page=${page}&limit=12`);

export const getBookmarksApi = (page = 1): Promise<PaginatedResources> =>
  apiGet(`/library/resources/bookmarks?page=${page}&limit=12`);

/* ── Single resource ── */
export const getResourceApi = (id: string): Promise<{ resource: LibraryResource }> =>
  apiGet(`/library/resources/${id}`);

export const getPreviewApi = (id: string): Promise<PreviewResponse> =>
  apiGet(`/library/resources/${id}/preview`);

export const getDownloadApi = (
  id: string,
): Promise<{ downloadUrl: string; fileName: string }> =>
  apiGet(`/library/resources/${id}/download`);

export const deleteResourceApi = (id: string) =>
  apiDelete<{ message: string }>(`/library/resources/${id}`);

export const toggleBookmarkApi = (id: string) =>
  apiPost<{ bookmarked: boolean; bookmarkCount: number }, object>(
    `/library/resources/${id}/bookmark`,
    {},
  );

export const reportResourceApi = (
  id: string,
  body: { reason: ReportReason; details?: string },
) => apiPost<{ message: string }, typeof body>(`/library/resources/${id}/report`, body);

/* ── Upload ── */
export const uploadResourceApi = (
  payload: UploadResourcePayload,
  onProgress?: (percent: number) => void,
) => {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("title", payload.title.trim());
  form.append("category", payload.category);
  form.append("allowDownload", String(payload.allowDownload));
  (["description", "courseCode", "subject", "department", "level", "session"] as const).forEach(
    (k) => {
      const v = payload[k];
      if (v && v.trim()) form.append(k, v.trim());
    },
  );
  if (payload.tags.length) form.append("tags", JSON.stringify(payload.tags));

  return apiPost<{ message: string; resource: LibraryResource }, FormData>(
    "/library/resources",
    form,
    {
      ...MULTIPART,
      onUploadProgress: (e: { loaded: number; total?: number }) => {
        if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    },
  );
};

/* ── AI ── */
export const askAiApi = (id: string, question: string) =>
  apiPost<{ answer: string }, { question: string }>(`/library/resources/${id}/ai/ask`, {
    question,
  });

export const quizAiApi = (id: string, count = 5) =>
  apiPost<QuizResponse, { count: number }>(`/library/resources/${id}/ai/quiz`, { count });

/* ── Admin moderation ── */
export const getModerationStatsApi = (): Promise<ModerationStats> =>
  apiGet("/library/admin/stats");

export const getReviewQueueApi = (
  status: "pending" | "flagged" | "rejected" | "approved",
  page = 1,
): Promise<PaginatedResources> =>
  apiGet(`/library/admin/resources?status=${status}&page=${page}&limit=20`);

export const approveResourceApi = (id: string) =>
  apiPost<{ message: string }, object>(`/library/admin/resources/${id}/approve`, {});

export const rejectResourceApi = (id: string, reason: string) =>
  apiPost<{ message: string }, { reason: string }>(`/library/admin/resources/${id}/reject`, {
    reason,
  });

export const getReportsApi = (page = 1): Promise<PaginatedReports> =>
  apiGet(`/library/admin/reports?status=open&page=${page}&limit=20`);

export const resolveReportApi = (
  id: string,
  body: { action: "dismiss" | "remove"; note?: string },
) => apiPost<{ message: string }, typeof body>(`/library/admin/reports/${id}/resolve`, body);

export const runAiReviewApi = () =>
  apiPost<{ queued: number; message: string }, object>("/library/admin/ai-review", {});