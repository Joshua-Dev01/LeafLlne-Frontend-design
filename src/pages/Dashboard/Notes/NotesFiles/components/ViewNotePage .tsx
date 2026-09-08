// src/pages/Dashboard/Notes/NotesFiles/pages/ViewNotePage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, getNoteById } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { formatBytes } from "../utilities/formatBytes";
import { MoreVertical, Edit, Trash2, Download, Eye, ArrowLeft } from "lucide-react";
import { useState } from "react";
import classNames from "classnames";
import { EmptyState } from "../../../../../components/Empty/EmptyState";

export default function ViewNotePage() {
  const { subjectId, noteId } = useParams<{ subjectId: string; noteId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId!),
    enabled: !!noteId,
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Deleted" });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate(`/dashboard/notes/viewNotes/${subjectId}`);
    },
    onError: (err) => handleResponse({ error: err }),
  });

  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;

  const note = data?.note;
  if (!note) return <div className="text-center"><EmptyState /></div>;

  const previewArea = () => {
    const mime = note.fileMimeType?.toLowerCase() || "";

    if (!note.fileUrl) {
      return <div className="text-center py-20 text-muted-foreground">No preview available</div>;
    }

    if (mime.includes("pdf")) {
      return (
        <iframe
          src={note.fileUrl}
          className="w-full h-[70vh] rounded-xl border"
        />
      );
    }

    if (mime.includes("image")) {
      return (
        <img
          src={note.fileUrl}
          className="max-h-[70vh] mx-auto rounded-xl"
          alt={note.title}
        />
      );
    }

    return (
      <div className="py-20 flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
        <a 
          href={note.fileUrl}
          download={note.title}
          target="_blank"
          rel="noreferrer"
          className="underline text-amber-500"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          {/* Back to notes list */}
          <button
            onClick={() => navigate(`/dashboard/notes/viewNotes/${subjectId}`)}
            className="p-2 rounded-md hover:bg-white/10 transition mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-2xl font-bold font-['Georgia',_serif] text-[#0D1F3C] dark:text-white">
              {note.title}
            </h1>
            {note.description && (
              <p className="text-sm text-muted-foreground mt-1">{note.description}</p>
            )}
            <p className="text-xs mt-2 text-muted-foreground">
              {formatBytes(note.fileSize)} • {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ── Action menu ──────────────────────────────────────── */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-white/10 transition"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreVertical />
          </button>

          {showMenu && (
            <div className={classNames(
              "absolute right-0 mt-2 p-2 w-36 rounded-xl z-10 space-y-1",
              "bg-white/10 backdrop-blur-xl shadow-md"
            )}>
              <a  
                href={note.fileUrl}
                download={note.title}
                className="flex items-center gap-2 w-full text-sm hover:bg-white/20 px-2 py-1 rounded-md"
              >
                <Download size={16} /> Download
              </a>

              <a 
                href={note.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 w-full text-sm hover:bg-white/20 px-2 py-1 rounded-md"
              >
                <Eye size={16} /> View Raw
              </a>

              <button
                className="flex items-center gap-2 w-full text-sm hover:bg-white/20 px-2 py-1 rounded-md"
                onClick={() => navigate(`/dashboard/notes/viewNotes/${subjectId}/${noteId}/edit`)}
              >
                <Edit size={16} /> Edit
              </button>

              <button
                className="flex items-center gap-2 w-full text-sm text-red-400 hover:bg-red-500/20 px-2 py-1 rounded-md"
                onClick={() => {
                  if (confirm("Delete this note?")) delMutation.mutate(note._id);
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── File preview ─────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-sm">
        {previewArea()}
      </div>
    </div>
  );
}