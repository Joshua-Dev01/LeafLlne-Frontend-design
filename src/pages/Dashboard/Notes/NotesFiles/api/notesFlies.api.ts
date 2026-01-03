// src/features/notes/api/notes.api.ts

import { apiDelete, apiGet, apiPost, apiPut } from "../../../../../services/apiCall";
import type { Note, NotesListResponse } from "../interface/notes";


// list notes for a subject (supports search, page, limit, sortBy, order)
export const getNotesBySubject = async (
    subjectId: string,
    params?: { search?: string; page?: number; limit?: number; sortBy?: string; order?: "asc" | "desc" }
): Promise<NotesListResponse> => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.sortBy) qs.set("sortBy", params.sortBy);
    if (params?.order) qs.set("order", params.order);
    const url = `/subjects/notes/${subjectId}?${qs.toString()}`;
    return await apiGet<NotesListResponse>(url);
};

export const getNoteById = async (id: string): Promise<{ note: Note }> => {
    return await apiGet<{ note: Note }>(`/subjects/notes/single/${id}`);
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
    return await apiDelete<{ message: string }>(`/subjects/notes/${id}`);
};

// optional helpers if you want to edit/create from frontend too
export const updateNoteApi = async (id: string, payload: any) => {
    return await apiPut<{ message: string; note: Note }, any>(`/subjects/notes/${id}`, payload);
};

export const createNoteApi = async (subjectId: string, formData: FormData) => {
    return await apiPost<{ message: string; note: Note }, FormData>(`/subjects/notes/${subjectId}`, formData);
};
