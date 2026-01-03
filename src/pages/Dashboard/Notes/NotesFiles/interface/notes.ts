// src/features/notes/types/notes.ts
export interface Note {
    _id: string;
    userId: string;
    subjectId: string;
    title: string;
    description?: string;
    fileUrl?: string;
    filePublicId?: string;
    fileSize?: number;
    fileType?: string; // "image", "video", "document", "file", ...
    fileMimeType?: string; // "application/pdf", "image/png", ...
    createdAt: string;
    updatedAt: string;
}

export interface NotesListResponse {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    notes: Note[];
}
