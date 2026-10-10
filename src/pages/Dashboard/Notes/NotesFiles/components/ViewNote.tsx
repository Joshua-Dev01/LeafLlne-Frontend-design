import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";

import { getNotesBySubject } from "../api/notesFlies.api";
import NotesTable from "./NotesTable";
import DeleteNote from "./DeleteNote";
import EditNoteModal from "./Editnotemodal";
import AddNoteModal from "./Addnotemodal";
import type { Note } from "../interface/notes";
import NotesTableSkeleton from "./Notestableskeleton";

const PAGE_SIZE = 12;

export default function ViewNote() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", subjectId, search, page],
    queryFn: () => getNotesBySubject(subjectId!, { search, page, limit: PAGE_SIZE }),
    enabled: !!subjectId,
    placeholderData: (prev) => prev,
  });

  if (!subjectId) {
    return <div className="text-center text-neutral-400 py-10">No subject selected.</div>;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelectedIds((prev) => (prev.length === notes.length ? [] : notes.map((n) => n._id)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          to="/dashboard/notes"
          className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to subjects
        </Link>
        <AddNoteModal subjectId={subjectId} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notes</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Everything saved to this subject
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search notes…"
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-full border border-neutral-200 dark:border-purple-900/30 bg-neutral-50 dark:bg-[#111111] text-neutral-900 dark:text-white outline-none focus:border-purple-300 dark:focus:border-purple-500"
        />
      </div>

      {isError ? (
        <div className="text-red-500 text-sm">Failed to load notes</div>
      ) : isLoading ? (
        <NotesTableSkeleton />
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-purple-900/30 p-14 text-center text-neutral-400 text-sm">
          {search ? "No notes match this search." : "No notes yet — add your first one."}
        </div>
      ) : (
        <NotesTable
          notes={notes}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={(note) => setEditTarget(note)}
          onDelete={(note) => setDeleteTarget(note)}
        />
      )}

      {!isLoading && notes.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-neutral-200 dark:border-purple-900/30 text-sm text-neutral-600 dark:text-neutral-300 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-neutral-400">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded-md border border-neutral-200 dark:border-purple-900/30 text-sm text-neutral-600 dark:text-neutral-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <EditNoteModal note={editTarget} open={!!editTarget} onClose={() => setEditTarget(null)} />
      <DeleteNote note={deleteTarget} open={!!deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}