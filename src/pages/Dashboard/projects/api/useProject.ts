import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectsResponse } from "../interface/ProjectType";
import { createProjectApi, getProjectsApi } from "./Project";

interface UseProjectsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
}

export const useProjects = (params: UseProjectsParams) => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return useQuery<ProjectsResponse>({
    queryKey: ["projects", params],
    queryFn: () => getProjectsApi(queryString),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};




export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Parameters<typeof createProjectApi>[0]) => createProjectApi(payload),
        onSuccess: () => {
            // Invalidate projects query to refetch and show the new project
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (err: any) => {
            console.error("Failed to create project:", err);
        },
    });
};
