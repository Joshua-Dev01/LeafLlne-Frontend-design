// src/features/notes/components/NotesGrid.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import NoteCard from "./NoteCard";
import type { NotesListResponse, Note } from "../interface/notes";
import { getNotesBySubject, deleteNote } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import { Skeleton } from "../../../../../components/ui/skeleton";

type Props = {
  subjectId: string;
};

export default function NotesGrid({ subjectId }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<NotesListResponse>({
    queryKey: ["notes", subjectId, search, page],
    queryFn: () => getNotesBySubject(subjectId, { search, page, limit: 12 }),
    placeholderData: (prev) => prev, // ✅ REPLACES keepPreviousData
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Deleted" });
      queryClient.invalidateQueries({ queryKey: ["notes", subjectId] });
    },
    onError: (err) => handleResponse({ error: err }),
  });

  const onView = (id: string) => navigate(`/notes/${id}`);
  const onEdit = (note: Note) => navigate(`/notes/${note._id}/edit`);
  const onDelete = (id: string) => {
    if (!confirm("Delete this file?")) return;
    delMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load notes</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <p className="text-sm text-muted-foreground">
            Your subject uploaded files
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search files..."
          className="px-3 py-2 rounded-md bg-white/5 text-sm w-48"
        />
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {data?.notes?.length ? (
          data.notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-10">
            No files yet — upload your first note 👍
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-md bg-white/5"
        >
          Prev
        </button>

        <span className="text-sm text-muted-foreground">{page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (data?.totalPages ?? 1)}
          className="px-3 py-1 rounded-md bg-white/5"
        >
          Next
        </button>
      </div>
    </div>
  );
}
