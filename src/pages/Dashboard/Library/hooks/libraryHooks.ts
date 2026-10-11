import { useEffect, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { handleResponse } from "../../../../utils/handleErrors";
import {
  approveResourceApi,
  askAiApi,
  deleteResourceApi,
  getBookmarksApi,
  getCategoriesApi,
  getFiltersApi,
  getModerationStatsApi,
  getMyResourcesApi,
  getPopularApi,
  getPreviewApi,
  getReportsApi,
  getResourceApi,
  getResourcesApi,
  getReviewQueueApi,
  quizAiApi,
  rejectResourceApi,
  reportResourceApi,
  resolveReportApi,
  runAiReviewApi,
  toggleBookmarkApi,
  uploadResourceApi,
} from "../api/libraryApi";
import type {
  PaginatedResources,
  ReportReason,
  ResourceListParams,
  UploadResourcePayload,
} from "../types/libraryTypes";

const KEY = "library";

export const useDebounced = <T,>(value: T, delay = 350) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

/* ── Queries ── */
export const useResources = (params: ResourceListParams) =>
  useQuery({
    queryKey: [KEY, "list", params],
    queryFn: () => getResourcesApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const usePopular = (enabled = true) =>
  useQuery({
    queryKey: [KEY, "popular"],
    queryFn: () => getPopularApi(8),
    enabled,
    staleTime: 60_000,
  });

export const useCategories = () =>
  useQuery({ queryKey: [KEY, "categories"], queryFn: getCategoriesApi, staleTime: 60_000 });

export const useLibraryFilters = () =>
  useQuery({ queryKey: [KEY, "filters"], queryFn: getFiltersApi, staleTime: 5 * 60_000 });

export const useMyResources = (page: number, enabled: boolean) =>
  useQuery({
    queryKey: [KEY, "mine", page],
    queryFn: () => getMyResourcesApi(page),
    enabled,
    placeholderData: keepPreviousData,
    // While an upload is waiting for review, check back every few seconds.
    refetchInterval: (q) =>
      q.state.data?.resources.some((r) => r.status === "pending") ? 8000 : false,
  });

export const useBookmarks = (page: number, enabled: boolean) =>
  useQuery({
    queryKey: [KEY, "bookmarks", page],
    queryFn: () => getBookmarksApi(page),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useResource = (id: string | null) =>
  useQuery({
    queryKey: [KEY, "resource", id],
    queryFn: () => getResourceApi(id as string),
    enabled: !!id,
    select: (d) => d.resource,
    retry: false,
  });

export const usePreview = (id: string | null) =>
  useQuery({
    queryKey: [KEY, "preview", id],
    queryFn: () => getPreviewApi(id as string),
    enabled: !!id,
    staleTime: 5 * 60_000,
    retry: false,
  });

/* ── Mutations ── */
export const useUploadResource = (onDone?: () => void) => {
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const mutation = useMutation({
    mutationFn: (p: UploadResourcePayload) => uploadResourceApi(p, setProgress),
    onSuccess: (res) => {
      toast.success(res.message || "Resource submitted");
      qc.invalidateQueries({ queryKey: [KEY] });
      setProgress(0);
      onDone?.();
    },
    onError: (err) => {
      setProgress(0);
      handleResponse({ error: err });
    },
  });
  return { ...mutation, progress };
};

export const useToggleBookmark = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleBookmarkApi(id),
    // Optimistically flip the bookmark everywhere the resource is cached.
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [KEY] });
      const snapshot = qc.getQueriesData({ queryKey: [KEY] });
      const flip = (r: any) =>
        r && r._id === id
          ? {
              ...r,
              isBookmarked: !r.isBookmarked,
              bookmarkCount: Math.max(0, (r.bookmarkCount ?? 0) + (r.isBookmarked ? -1 : 1)),
            }
          : r;
      qc.setQueriesData({ queryKey: [KEY] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old.resources))
          return { ...old, resources: old.resources.map(flip) };
        if (old.resource) return { ...old, resource: flip(old.resource) };
        return old;
      });
      return { snapshot };
    },
    onError: (err, _id, ctx) => {
      ctx?.snapshot.forEach(([k, v]) => qc.setQueryData(k, v));
      handleResponse({ error: err });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [KEY, "bookmarks"] });
    },
  });
};

export const useReportResource = (onDone?: () => void) =>
  useMutation({
    mutationFn: ({
      id,
      reason,
      details,
    }: {
      id: string;
      reason: ReportReason;
      details?: string;
    }) => reportResourceApi(id, { reason, details }),
    onSuccess: (res) => {
      toast.success(res.message);
      onDone?.();
    },
    onError: (err) => handleResponse({ error: err }),
  });

export const useDeleteResource = (onDone?: () => void) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResourceApi(id),
    onSuccess: () => {
      toast.success("Resource deleted");
      qc.invalidateQueries({ queryKey: [KEY] });
      onDone?.();
    },
    onError: (err) => handleResponse({ error: err }),
  });
};

export const useAskAi = () =>
  useMutation({
    mutationFn: ({ id, question }: { id: string; question: string }) =>
      askAiApi(id, question),
  });

export const useGenerateQuiz = () =>
  useMutation({
    mutationFn: ({ id, count }: { id: string; count: number }) => quizAiApi(id, count),
  });

/* ── Admin ── */
// The profile endpoint doesn't expose the user's role, so we probe an
// admin-only endpoint instead: it succeeds for admins and 403s for everyone else.
export const useModerationStats = () =>
  useQuery({
    queryKey: [KEY, "admin", "stats"],
    queryFn: getModerationStatsApi,
    retry: false,
    staleTime: 60_000,
  });

export const useReviewQueue = (
  status: "pending" | "flagged" | "rejected" | "approved",
  page: number,
  enabled: boolean,
) =>
  useQuery<PaginatedResources>({
    queryKey: [KEY, "admin", "queue", status, page],
    queryFn: () => getReviewQueueApi(status, page),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useReports = (page: number, enabled: boolean) =>
  useQuery({
    queryKey: [KEY, "admin", "reports", page],
    queryFn: () => getReportsApi(page),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useModerationActions = () => {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: [KEY] });
  const approve = useMutation({
    mutationFn: (id: string) => approveResourceApi(id),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
    },
    onError: (e) => handleResponse({ error: e }),
  });
  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectResourceApi(id, reason),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
    },
    onError: (e) => handleResponse({ error: e }),
  });
  const resolve = useMutation({
    mutationFn: ({
      id,
      action,
      note,
    }: {
      id: string;
      action: "dismiss" | "remove";
      note?: string;
    }) => resolveReportApi(id, { action, note }),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
    },
    onError: (e) => handleResponse({ error: e }),
  });
  return { approve, reject, resolve };
};

/** Admin: have the AI work through the pending queue (runs in the background). */
export const useRunAiReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: runAiReviewApi,
    onSuccess: (r) => {
      toast.success(r.message);
      // The server reviews in the background — refresh a few times as results land.
      [10_000, 30_000, 60_000].forEach((ms) =>
        setTimeout(() => qc.invalidateQueries({ queryKey: [KEY] }), ms),
      );
    },
    onError: (e) => handleResponse({ error: e }),
  });
};