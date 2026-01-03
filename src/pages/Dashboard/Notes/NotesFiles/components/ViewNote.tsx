// src/features/notes/pages/ViewNotePage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, getNoteById } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { formatBytes } from "../utilities/formatBytes";

import { MoreVertical, Edit, Trash2, Download, Eye } from "lucide-react";
import { useState } from "react";
import classNames from "classnames";
import { EmptyState } from "../../../../../components/Empty/EmptyState";

export default function ViewNotePage() {
  const { noteId } = useParams<{ noteId: string }>();
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
      navigate(-1);
    },
    onError: (err) => handleResponse({ error: err }),
  });

  if (isLoading) {
    return <Skeleton className="h-80 w-full rounded-xl" />;
  }

  const note: any = data?.note;
  if (!note) return <div className="text-center"><EmptyState /></div>;

  const previewArea = () => {
    const mime = note.fileMimeType?.toLowerCase() || "";

    if (!note.fileUrl) {
      return <div className="text-center py-20">No preview available</div>;
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
      <div className="py-20 flex flex-col items-center">
        <p className="mb-3 text-sm text-muted-foreground">
          Preview not available
        </p>
        <a
          href={note.fileUrl}
          download={note.title}
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-500"
        >
          Download File
        </a>
      </div>
    );
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = note.fileUrl;
    link.download = note.title;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <p className="text-sm text-muted-foreground">{note.description}</p>

          <p className="text-xs mt-2 text-muted-foreground">
            {formatBytes(note.fileSize)} •{" "}
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>

        {/* ACTION MENU */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-white/10"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreVertical />
          </button>

          {showMenu && (
            <div
              className={classNames(
                "absolute right-0 mt-2 p-2 w-32 rounded-xl",
                "bg-white/10 backdrop-blur-xl shadow-md z-10 space-y-1"
              )}
            >
              <button
                className="flex items-center gap-2 w-full text-sm hover:bg-white/20 px-2 py-1 rounded-md"
                onClick={() => downloadFile()}
              >
                <Download size={16} /> Download
              </button>

              <button
                className="flex items-center gap-2 w-full text-sm hover:bg-white/20 px-2 py-1 rounded-md"
                onClick={() => navigate(note.fileUrl)}
              >
                <Eye size={16} /> View Raw
              </button>

              <button
                className="flex items-center gap-2 w-full text-sm hover:bg-white/20 px-2 py-1 rounded-md"
                onClick={() => navigate(`/notes/${note._id}/edit`)}
              >
                <Edit size={16} /> Edit
              </button>

              <button
                className="flex items-center gap-2 w-full text-sm text-red-400 hover:bg-red-500/20 px-2 py-1 rounded-md"
                onClick={() => {
                  if (confirm("Delete this file?")) {
                    delMutation.mutate(note._id);
                  }
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File Preview */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-sm">
        {previewArea()}
      </div>
    </div>
  );
}
