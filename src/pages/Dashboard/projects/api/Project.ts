import { apiDelete, apiGet, apiPatch, apiPost } from "../../../../services/apiCall";
import type {
  ListParams,
  MyInvitation,
  PagedActivity,
  PagedComments,
  Project,
  ProjectDetailResponse,
  ProjectFileItem,
  ProjectFormValues,
  ProjectSummary,
  ProjectsResponse,
  Task,
  TaskInput,
  UserSearchResult,
} from "../interface/ProjectType";

const B = "/project";
const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

const qs = (params: Record<string, string | number | undefined | null>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
};

const patch = <T>(url: string, body: unknown): Promise<T> => apiPatch<T, unknown>(url, body);

/* ── Projects ── */
// Raw query-string form kept for the dashboard home widget.
export const getProjectsApi = (query: string): Promise<ProjectsResponse> =>
  apiGet(`${B}?${query}`);

export const listProjectsApi = (p: ListParams): Promise<ProjectsResponse> =>
  apiGet(`${B}${qs({ ...p })}`);

export const getSummaryApi = (): Promise<ProjectSummary> => apiGet(`${B}/summary`);

export const getProjectApi = (id: string): Promise<ProjectDetailResponse> => apiGet(`${B}/${id}`);

const toPayload = (v: ProjectFormValues) => ({
  title: v.title.trim(),
  description: v.description.trim(),
  category: v.category,
  startDate: v.startDate ? `${v.startDate}T12:00:00.000Z` : null,
  deadline: v.deadline ? `${v.deadline}T12:00:00.000Z` : null,
  visibility: v.visibility,
  color: v.color,
  icon: v.icon,
});

export const createProjectApi = (v: ProjectFormValues) =>
  apiPost<{ message: string; project: Project }, ReturnType<typeof toPayload>>(B, toPayload(v));

export const updateProjectApi = (id: string, v: ProjectFormValues) =>
  patch<{ message: string; project: Project }>(`${B}/${id}`, toPayload(v));

export const archiveProjectApi = (id: string) =>
  apiPost<{ message: string }, object>(`${B}/${id}/archive`, {});
export const restoreProjectApi = (id: string) =>
  apiPost<{ message: string }, object>(`${B}/${id}/restore`, {});
export const duplicateProjectApi = (id: string) =>
  apiPost<{ message: string; project: Project }, object>(`${B}/${id}/duplicate`, {});
export const deleteProjectApi = (id: string) => apiDelete<{ message: string }>(`${B}/${id}`);

/* ── Tasks ── */
const dateOut = (d?: string | null) => (d === undefined ? undefined : d ? `${d}T12:00:00.000Z` : null);

export const listTasksApi = (id: string): Promise<{ tasks: Task[] }> => apiGet(`${B}/${id}/tasks`);

export const createTaskApi = (id: string, t: TaskInput) =>
  apiPost<{ task: Task }, TaskInput>(`${B}/${id}/tasks`, { ...t, dueDate: dateOut(t.dueDate) });

export const updateTaskApi = (id: string, taskId: string, t: Partial<TaskInput>) =>
  patch<{ task: Task }>(`${B}/${id}/tasks/${taskId}`, { ...t, dueDate: dateOut(t.dueDate) });

export const deleteTaskApi = (id: string, taskId: string) =>
  apiDelete<{ message: string }>(`${B}/${id}/tasks/${taskId}`);

export const addSubtaskApi = (id: string, taskId: string, title: string) =>
  apiPost<{ task: Task }, { title: string }>(`${B}/${id}/tasks/${taskId}/subtasks`, { title });

export const updateSubtaskApi = (
  id: string,
  taskId: string,
  subId: string,
  body: { title?: string; done?: boolean },
) => patch<{ task: Task }>(`${B}/${id}/tasks/${taskId}/subtasks/${subId}`, body);

export const deleteSubtaskApi = (id: string, taskId: string, subId: string) =>
  apiDelete<{ task: Task }>(`${B}/${id}/tasks/${taskId}/subtasks/${subId}`);

/* ── People ── */
export const searchUsersApi = (q: string): Promise<{ users: UserSearchResult[] }> =>
  apiGet(`${B}/users/search${qs({ q })}`);

export const inviteApi = (id: string, userId: string) =>
  apiPost<{ message: string }, { userId: string }>(`${B}/${id}/invitations`, { userId });

export const cancelInvitationApi = (id: string, invId: string) =>
  apiDelete<{ message: string }>(`${B}/${id}/invitations/${invId}`);

export const removeMemberApi = (id: string, userId: string) =>
  apiDelete<{ message: string }>(`${B}/${id}/members/${userId}`);

export const myInvitationsApi = (): Promise<{ invitations: MyInvitation[] }> =>
  apiGet(`${B}/invitations/mine`);

export const acceptInvitationApi = (invId: string) =>
  apiPost<{ message: string; projectId: string }, object>(`${B}/invitations/${invId}/accept`, {});

export const declineInvitationApi = (invId: string) =>
  apiPost<{ message: string }, object>(`${B}/invitations/${invId}/decline`, {});

/* ── Discussion & activity ── */
export const listCommentsApi = (id: string, page = 1): Promise<PagedComments> =>
  apiGet(`${B}/${id}/comments?page=${page}&limit=20`);

export const addCommentApi = (id: string, body: string) =>
  apiPost<{ comment: PagedComments["comments"][number] }, { body: string }>(
    `${B}/${id}/comments`,
    { body },
  );

export const deleteCommentApi = (id: string, commentId: string) =>
  apiDelete<{ message: string }>(`${B}/${id}/comments/${commentId}`);

export const listActivityApi = (id: string, page = 1): Promise<PagedActivity> =>
  apiGet(`${B}/${id}/activity?page=${page}&limit=20`);

/* ── Files ── */
export const listFilesApi = (id: string): Promise<{ files: ProjectFileItem[] }> =>
  apiGet(`${B}/${id}/files`);

export const uploadFileApi = (id: string, file: File, onProgress?: (p: number) => void) => {
  const form = new FormData();
  form.append("file", file);
  return apiPost<{ message: string; file: ProjectFileItem }, FormData>(`${B}/${id}/files`, form, {
    ...MULTIPART,
    onUploadProgress: (e: { loaded: number; total?: number }) => {
      if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
};

export const getFileLinkApi = (id: string, fileId: string) =>
  apiGet<{ fileName: string; url: string; downloadUrl: string }>(`${B}/${id}/files/${fileId}/link`);

export const deleteFileApi = (id: string, fileId: string) =>
  apiDelete<{ message: string }>(`${B}/${id}/files/${fileId}`);
