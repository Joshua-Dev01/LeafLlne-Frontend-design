import { apiGet, apiPost, apiPut, apiDelete } from "../../../../services/apiCall";
import type { CreateSubjectPayload, Subject } from "../types/Note";

// fetch all subjects
export const getSubjects = async (): Promise<Subject[]> => {
  return await apiGet<Subject[]>("/subjects");
};

export const getSubjectById = async (id: string): Promise<Subject> => {
  return await apiGet<Subject>(`/subjects/${id}`);
};

// add subject
export const addSubjectApi = async (
  data: CreateSubjectPayload
): Promise<Subject> => {
  return await apiPost<Subject, CreateSubjectPayload>(
    "/subjects/add-subjects",
    data
  );
};

// edit subject
export const editSubjectApi = async (
  id: string,
  data: Partial<CreateSubjectPayload>
): Promise<Subject> => {
  return await apiPut<Subject, Partial<CreateSubjectPayload>>(
    `/subjects/${id}`,
    data
  );
};

// delete subject
export const deleteSubjectApi = async (id: string): Promise<{ message: string }> => {
  return await apiDelete<{ message: string }>(`/subjects/${id}`);
};
