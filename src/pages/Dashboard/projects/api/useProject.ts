import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { handleResponse } from "../../../../utils/handleErrors";
import type {
  ListParams,
  ProjectDetailResponse,
  ProjectFormValues,
  Task,
  TaskInput,
} from "../interface/ProjectType";
import * as api from "./Project";

const K = "projects";
const fail = (error: unknown) => handleResponse({ error });

/* ── Queries ── */
export const useProjects = (params: ListParams) =>
  useQuery({
    queryKey: [K, "list", params],
    queryFn: () => api.listProjectsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
  });

export const useProjectSummary = () =>
  useQuery({ queryKey: [K, "summary"], queryFn: api.getSummaryApi, staleTime: 20_000 });

export const useProject = (id: string) =>
  useQuery({
    queryKey: [K, "detail", id],
    queryFn: () => api.getProjectApi(id),
    retry: false,
  });

export const useTasks = (id: string) =>
  useQuery({
    queryKey: [K, "tasks", id],
    queryFn: () => api.listTasksApi(id),
    select: (d) => d.tasks,
  });

export const useComments = (id: string, page: number) =>
  useQuery({
    queryKey: [K, "comments", id, page],
    queryFn: () => api.listCommentsApi(id, page),
    placeholderData: keepPreviousData,
  });

export const useActivity = (id: string, page: number) =>
  useQuery({
    queryKey: [K, "activity", id, page],
    queryFn: () => api.listActivityApi(id, page),
    placeholderData: keepPreviousData,
  });

export const useFiles = (id: string) =>
  useQuery({
    queryKey: [K, "files", id],
    queryFn: () => api.listFilesApi(id),
    select: (d) => d.files,
  });

export const useMyInvitations = () =>
  useQuery({
    queryKey: [K, "invitations"],
    queryFn: api.myInvitationsApi,
    select: (d) => d.invitations,
    staleTime: 30_000,
  });

export const useUserSearch = (q: string) =>
  useQuery({
    queryKey: [K, "userSearch", q],
    queryFn: () => api.searchUsersApi(q),
    enabled: q.trim().length >= 2,
    select: (d) => d.users,
    staleTime: 30_000,
  });

/* ── Project mutations ── */
export const useProjectMutations = () => {
  const qc = useQueryClient();
  const refreshAll = () => qc.invalidateQueries({ queryKey: [K] });

  const create = useMutation({
    mutationFn: (v: ProjectFormValues) => api.createProjectApi(v),
    onSuccess: (r) => {
      toast.success(r.message);
      refreshAll();
    },
    onError: fail,
  });
  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProjectFormValues }) =>
      api.updateProjectApi(id, values),
    onSuccess: (r) => {
      toast.success(r.message);
      refreshAll();
    },
    onError: fail,
  });
  const archive = useMutation({
    mutationFn: api.archiveProjectApi,
    onSuccess: (r) => {
      toast.success(r.message);
      refreshAll();
    },
    onError: fail,
  });
  const restore = useMutation({
    mutationFn: api.restoreProjectApi,
    onSuccess: (r) => {
      toast.success(r.message);
      refreshAll();
    },
    onError: fail,
  });
  const duplicate = useMutation({
    mutationFn: api.duplicateProjectApi,
    onSuccess: (r) => {
      toast.success(r.message);
      refreshAll();
    },
    onError: fail,
  });
  const remove = useMutation({
    mutationFn: api.deleteProjectApi,
    onSuccess: (r) => {
      toast.success(r.message);
      refreshAll();
    },
    onError: fail,
  });
  return { create, update, archive, restore, duplicate, remove };
};

/* ── Task mutations (optimistic) ── */
export const useTaskMutations = (projectId: string) => {
  const qc = useQueryClient();
  const tasksKey = [K, "tasks", projectId];
  // Progress, activity and the overview list all depend on tasks.
  const refreshRelated = () => {
    qc.invalidateQueries({ queryKey: [K, "detail", projectId] });
    qc.invalidateQueries({ queryKey: [K, "activity", projectId] });
    qc.invalidateQueries({ queryKey: [K, "list"] });
    qc.invalidateQueries({ queryKey: [K, "summary"] });
  };
  const replaceTask = (t: Task) =>
    qc.setQueryData<{ tasks: Task[] }>(tasksKey, (old) =>
      old ? { tasks: old.tasks.map((x) => (x._id === t._id ? t : x)) } : old,
    );

  const create = useMutation({
    mutationFn: (t: TaskInput) => api.createTaskApi(projectId, t),
    onSuccess: (r) => {
      qc.setQueryData<{ tasks: Task[] }>(tasksKey, (old) =>
        old ? { tasks: [...old.tasks, r.task] } : { tasks: [r.task] },
      );
      toast.success("Task added");
      refreshRelated();
    },
    onError: fail,
  });

  const update = useMutation({
    mutationFn: ({ taskId, patch }: { taskId: string; patch: Partial<TaskInput> }) =>
      api.updateTaskApi(projectId, taskId, patch),
    // Move the card right away; roll back if the server says no.
    onMutate: async ({ taskId, patch }) => {
      await qc.cancelQueries({ queryKey: tasksKey });
      const prev = qc.getQueryData<{ tasks: Task[] }>(tasksKey);
      qc.setQueryData<{ tasks: Task[] }>(tasksKey, (old) =>
        old
          ? {
              tasks: old.tasks.map((t) =>
                t._id === taskId
                  ? ({
                      ...t,
                      ...(patch.status ? { status: patch.status } : {}),
                      ...(patch.priority ? { priority: patch.priority } : {}),
                    } as Task)
                  : t,
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(tasksKey, ctx.prev);
      fail(e);
    },
    onSuccess: (r) => replaceTask(r.task),
    onSettled: refreshRelated,
  });

  const remove = useMutation({
    mutationFn: (taskId: string) => api.deleteTaskApi(projectId, taskId),
    onSuccess: (_r, taskId) => {
      qc.setQueryData<{ tasks: Task[] }>(tasksKey, (old) =>
        old ? { tasks: old.tasks.filter((t) => t._id !== taskId) } : old,
      );
      toast.success("Task deleted");
      refreshRelated();
    },
    onError: fail,
  });

  const addSubtask = useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      api.addSubtaskApi(projectId, taskId, title),
    onSuccess: (r) => replaceTask(r.task),
    onError: fail,
  });
  const toggleSubtask = useMutation({
    mutationFn: ({ taskId, subId, done }: { taskId: string; subId: string; done: boolean }) =>
      api.updateSubtaskApi(projectId, taskId, subId, { done }),
    onSuccess: (r) => {
      replaceTask(r.task);
      qc.invalidateQueries({ queryKey: [K, "activity", projectId] });
    },
    onError: fail,
  });
  const removeSubtask = useMutation({
    mutationFn: ({ taskId, subId }: { taskId: string; subId: string }) =>
      api.deleteSubtaskApi(projectId, taskId, subId),
    onSuccess: (r) => replaceTask(r.task),
    onError: fail,
  });

  return { create, update, remove, addSubtask, toggleSubtask, removeSubtask };
};

/* ── People ── */
export const useMemberMutations = (projectId: string) => {
  const qc = useQueryClient();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: [K, "detail", projectId] });
    qc.invalidateQueries({ queryKey: [K, "activity", projectId] });
    qc.invalidateQueries({ queryKey: [K, "list"] });
  };
  const invite = useMutation({
    mutationFn: (userId: string) => api.inviteApi(projectId, userId),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
    },
    onError: fail,
  });
  const cancelInvite = useMutation({
    mutationFn: (invId: string) => api.cancelInvitationApi(projectId, invId),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
    },
    onError: fail,
  });
  const removeMember = useMutation({
    mutationFn: (userId: string) => api.removeMemberApi(projectId, userId),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
      qc.invalidateQueries({ queryKey: [K, "tasks", projectId] });
    },
    onError: fail,
  });
  return { invite, cancelInvite, removeMember };
};

export const useInvitationActions = () => {
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: [K] });
  const accept = useMutation({
    mutationFn: api.acceptInvitationApi,
    onSuccess: (r) => {
      toast.success(r.message);
      done();
    },
    onError: fail,
  });
  const decline = useMutation({
    mutationFn: api.declineInvitationApi,
    onSuccess: (r) => {
      toast.success(r.message);
      done();
    },
    onError: fail,
  });
  return { accept, decline };
};

/* ── Discussion & files ── */
export const useCommentMutations = (projectId: string) => {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: [K, "comments", projectId] });
  const add = useMutation({
    mutationFn: (body: string) => api.addCommentApi(projectId, body),
    onSuccess: refresh,
    onError: fail,
  });
  const remove = useMutation({
    mutationFn: (commentId: string) => api.deleteCommentApi(projectId, commentId),
    onSuccess: refresh,
    onError: fail,
  });
  return { add, remove };
};

export const useFileMutations = (projectId: string) => {
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: [K, "files", projectId] });
    qc.invalidateQueries({ queryKey: [K, "activity", projectId] });
  };
  const upload = useMutation({
    mutationFn: (file: File) => api.uploadFileApi(projectId, file, setProgress),
    onSuccess: (r) => {
      toast.success(r.message);
      setProgress(0);
      refresh();
    },
    onError: (e) => {
      setProgress(0);
      fail(e);
    },
  });
  const remove = useMutation({
    mutationFn: (fileId: string) => api.deleteFileApi(projectId, fileId),
    onSuccess: (r) => {
      toast.success(r.message);
      refresh();
    },
    onError: fail,
  });
  return { upload, remove, progress };
};

export type { ProjectDetailResponse };
