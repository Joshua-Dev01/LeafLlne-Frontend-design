import { apiGet, apiPost } from "../../../../services/apiCall";
import type { CreateSubjectPayload, Subject } from "../types/Note";

// fetch all subjects
export const getSubjects = async (): Promise<Subject[]> => {
  return await apiGet<Subject[]>("/subjects");
};

//add subject
export const addSubjectApi = async (
  data: CreateSubjectPayload
): Promise<CreateSubjectPayload[]> => {
  return await apiPost<CreateSubjectPayload[], CreateSubjectPayload>(
    "/subjects/add-subjects",
    data
  );
};
