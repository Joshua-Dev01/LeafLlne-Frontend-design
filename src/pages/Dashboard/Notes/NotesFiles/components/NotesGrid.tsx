// src/features/notes/components/NotesGrid.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import NoteCard from "./NoteCard";
import type { NotesListResponse } from "../interface/notes";
import { getNotesBySubject, deleteNote } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import NoteCardSkeleton from "./Notecardskeleton";

type Props = {
  subjectId: string;
};

export default function NotesGrid({ subjectId }: Props) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<NotesListResponse>({
    queryKey: ["notes", subjectId, search, page],
    queryFn: () => getNotesBySubject(subjectId, { search, page, limit: 12 }),
    placeholderData: (prev) => prev,
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Deleted" });
      queryClient.invalidateQueries({ queryKey: ["notes", subjectId] });
    },
    onError: (err) => handleResponse({ error: err }),
  });

  const onDelete = (id: string) => {
    if (!confirm("Delete this note?")) return;
    delMutation.mutate(id);
  };

  if (isError) {
    return <div className="text-red-500">Failed to load notes</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Notes</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Everything saved to this subject</p>
        </div>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search notes…"
          className="px-3 py-2 rounded-full border border-neutral-200 dark:border-[#2e2b30] bg-neutral-50 dark:bg-[#1c1b1b] text-neutral-900 dark:text-white text-sm w-48 outline-none focus:border-violet-200"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.notes?.length ? (
            data.notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                menuOpen={openMenuId === note._id}
                onToggleMenu={() => setOpenMenuId(openMenuId === note._id ? null : note._id)}
                onDelete={() => {
                  onDelete(note._id);
                  setOpenMenuId(null);
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-400 dark:text-neutral-500 py-10">
              No notes yet — add your first one 👍
            </div>
          )}
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-md border border-neutral-200 dark:border-[#2e2b30] text-sm text-neutral-600 dark:text-neutral-300 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm text-neutral-400">{page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (data?.totalPages ?? 1)}
          className="px-3 py-1 rounded-md border border-neutral-200 dark:border-[#2e2b30] text-sm text-neutral-600 dark:text-neutral-300 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}