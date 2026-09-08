// src/features/notes/types/notes.ts

// subjectId is populated with { _id, name, code } on getAllNotes/getNoteById,
// but is a plain string id on subject-scoped calls — keep both possible.
export interface NoteSubjectRef {
    _id: string;
    name: string;
    code: string;
}

export interface Note {
    _id: string;
    userId: string;
    subjectId: string | NoteSubjectRef;
    title: string;
    description?: string;
    content?: string;
    tags?: string[];
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