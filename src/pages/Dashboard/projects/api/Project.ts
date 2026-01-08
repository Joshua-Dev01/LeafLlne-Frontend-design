import { apiGet, apiPost } from "../../../../services/apiCall";
import type { CreateProjectPayload } from "../interface/ProjectType";
import type { ProjectsResponse } from "../interface/ProjectType";


export const getProjectsApi = async (
    query: string
): Promise<ProjectsResponse> => {
    return apiGet(`/project/project?${query}`);
};






// export const createProjectApi = async (payload: ProjectsResponse): Promise<Project> => {
//     return apiPost("/project/project", payload);
// };



export const createProjectApi = async (
  data: CreateProjectPayload
): Promise<ProjectsResponse> => {
  return await apiPost<ProjectsResponse, CreateProjectPayload>(
    "/project/create-project",
    data
  );
};