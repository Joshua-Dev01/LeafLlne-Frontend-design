import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, UploadCloud } from "lucide-react";

import {  deleteNote, getAllNotes } from "../api/notesFlies.api";
import { getSubjects } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import NoteCard from "./NoteCard";
import AddNoteModal from "./Addnotemodal";
import NoteCardSkeleton from "./Notecardskeleton";

const PAGE_SIZE = 6;

export default function AllNotesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [subjectFilter, setSubjectFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: subjects } = useQuery({ queryKey: ["subjects"], queryFn: getSubjects });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["notes", "all", subjectFilter, search, page],
    queryFn: () =>
      getAllNotes({ subjectId: subjectFilter, search, page, limit: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Note deleted" });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => handleResponse({ error: err }),
  });

  const totalUnits = useMemo(
    () => (subjects ?? []).reduce((sum, s) => sum + (s.unit || 0), 0),
    [subjects]
  );

  const notes = data?.notes ?? [];
  const hasMore = data ? page < data.totalPages : false;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2e0052]">Study Notes</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage your academic insights and research materials.
          </p>
          <div className="flex gap-2 mt-3 items-center">
            <span className="text-xs bg-violet-50 text-[#4b0082] px-3 py-1 rounded-full font-medium">
              {subjects?.length ?? 0} Courses
            </span>
            <span className="text-xs bg-violet-50 text-[#4b0082] px-3 py-1 rounded-full font-medium">
              {totalUnits} Total Units
            </span>
            <Link
              to="/dashboard/notes/subjects"
              className="text-xs text-neutral-400 hover:text-[#4b0082] underline underline-offset-2 ml-1"
            >
              Manage courses
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard/notes/new")}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: "#2e0052" }}
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
          <AddNoteModal />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search your notes…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-neutral-200 bg-neutral-50 outline-none focus:border-violet-200"
          />
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 p-14 flex flex-col items-center text-center text-neutral-400 gap-3">
          <UploadCloud className="w-6 h-6" />
          <p className="text-sm">
            {subjectFilter || search
              ? "No notes match this filter yet."
              : "No notes yet — create your first one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              menuOpen={openMenuId === note._id}
              onToggleMenu={() => setOpenMenuId(openMenuId === note._id ? null : note._id)}
              onDelete={() => {
                if (confirm("Delete this note?")) delMutation.mutate(note._id);
                setOpenMenuId(null);
              }}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="text-sm px-5 py-2 rounded-full border border-neutral-200 text-neutral-600 hover:border-violet-200 hover:text-[#4b0082] transition disabled:opacity-50"
          >
            {isFetching ? "Loading…" : "Load More Notes"}
          </button>
        </div>
      )}
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
      active ? "text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
    }`}
    style={active ? { background: "#2e0052" } : undefined}
  >
    {label}
  </button>
);