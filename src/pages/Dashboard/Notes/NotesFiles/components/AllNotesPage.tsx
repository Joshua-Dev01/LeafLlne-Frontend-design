import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Plus,
  FileText,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Check,
  LayoutGrid,
  Rows3,
} from "lucide-react";

import { getAllNotes } from "../api/notesFlies.api";
import { getSubjects } from "../../api/subject.api";
import NotesTable from "./NotesTable";
import NotesGridView from "./NotesGridView";
import DeleteNote from "./DeleteNote";
import EditNoteModal from "./Editnotemodal";
import AddNoteModal from "./Addnotemodal";
import type { Note } from "../interface/notes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import NotesTableSkeleton from "./Notestableskeleton";

const PAGE_SIZE = 6;

type SortOption = {
  label: string;
  sortBy: "title" | "updatedAt" | "createdAt";
  order: "asc" | "desc";
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Date modified (Newest)", sortBy: "updatedAt", order: "desc" },
  { label: "Date modified (Oldest)", sortBy: "updatedAt", order: "asc" },
  { label: "Date created (Newest)", sortBy: "createdAt", order: "desc" },
  { label: "Date created (Oldest)", sortBy: "createdAt", order: "asc" },
  { label: "Name (A–Z)", sortBy: "title", order: "asc" },
  { label: "Name (Z–A)", sortBy: "title", order: "desc" },
];

export default function AllNotesPage() {
  const [subjectFilter, setSubjectFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const { data: subjects } = useQuery({ queryKey: ["subjects"], queryFn: getSubjects });

  const { data, isLoading } = useQuery({
    queryKey: ["notes", "all", subjectFilter, search, page, sort.sortBy, sort.order],
    queryFn: () =>
      getAllNotes({
        subjectId: subjectFilter,
        search,
        page,
        limit: PAGE_SIZE,
        sortBy: sort.sortBy,
        order: sort.order,
      }),
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalNotes = data?.total ?? 0;

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelectedIds((prev) => (prev.length === notes.length ? [] : notes.map((n) => n._id)));

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page, "...", totalPages];
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Study Notes</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Manage your academic insights and research materials.
          </p>
          <div className="flex gap-2 mt-3 items-center flex-wrap">
            <span className="flex items-center gap-1.5 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full font-semibold">
              <FileText className="w-3.5 h-3.5" />
              {totalNotes} {totalNotes === 1 ? "Note" : "Notes"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AddNoteModal />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search your workspace…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-full border border-neutral-200 dark:border-purple-900/30 bg-neutral-50 dark:bg-[#111111] text-neutral-900 dark:text-white outline-none focus:border-purple-300 dark:focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#141414]">
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`p-2 rounded-lg transition ${
              viewMode === "grid"
                ? "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            aria-label="Table view"
            className={`p-2 rounded-lg transition ${
              viewMode === "table"
                ? "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            <Rows3 className="w-4 h-4" />
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#141414] text-neutral-600 dark:text-neutral-300 hover:border-purple-300 dark:hover:border-purple-500/50 transition">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl bg-white dark:bg-[#1b1b1b] overflow-hidden border border-neutral-200 dark:border-purple-900/30 shadow-xl min-w-[200px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.label}
                onClick={() => {
                  setSort(opt);
                  setPage(1);
                }}
                className="flex items-center justify-between gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition"
              >
                {opt.label}
                {sort.label === opt.label && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill
          label="All"
          active={!subjectFilter}
          onClick={() => {
            setSubjectFilter(undefined);
            setPage(1);
          }}
        />
        {(subjects ?? []).map((s) => (
          <FilterPill
            key={s._id}
            label={s.name}
            active={subjectFilter === s._id}
            onClick={() => {
              setSubjectFilter(s._id);
              setPage(1);
            }}
          />
        ))}
      </div>

      {isLoading ? (
        <NotesTableSkeleton />
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-purple-900/30 p-14 flex flex-col items-center text-center text-neutral-400 gap-3">
          <Plus className="w-6 h-6" />
          <p className="text-sm">
            {subjectFilter || search ? "No notes match this filter yet." : "No notes yet — create your first one."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <NotesGridView
          notes={notes}
          onEdit={(note) => setEditTarget(note)}
          onDelete={(note) => setDeleteTarget(note)}
        />
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Showing <span className="font-semibold text-neutral-800 dark:text-white">{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalNotes)}</span> of{" "}
            <span className="font-semibold text-neutral-800 dark:text-white">{totalNotes}</span> notes
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-purple-900/30 text-xs text-neutral-600 dark:text-neutral-300 disabled:opacity-40 hover:border-purple-300 dark:hover:border-purple-500/50 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {pageNumbers.map((n, i) =>
              n === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-neutral-400 text-xs">…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n as number)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                    page === n
                      ? "bg-purple-600 text-white"
                      : "text-neutral-500 dark:text-neutral-400 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                  }`}
                >
                  {n}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-purple-900/30 text-xs text-neutral-600 dark:text-neutral-300 disabled:opacity-40 hover:border-purple-300 dark:hover:border-purple-500/50 transition"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <EditNoteModal note={editTarget} open={!!editTarget} onClose={() => setEditTarget(null)} />
      <DeleteNote note={deleteTarget} open={!!deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}

const FilterPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-sm px-4 py-1.5 rounded-full font-medium transition ${
      active
        ? "bg-black dark:bg-purple-600 text-white"
        : "bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10"
    }`}
  >
    {label}
  </button>
);