import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Paperclip, Plus, Trash2, X } from "lucide-react";
import { Select } from "antd";

import { Skeleton } from "../../../../../components/ui/skeleton";
import { handleResponse } from "../../../../../utils/handleErrors";
import { getSubjects } from "../../api/subject.api";
import { getNoteById, createNoteApi, updateNoteApi, autosaveNoteApi, deleteNote } from "../api/notesFlies.api";
import type { Note } from "../interface/notes";
import RichTextEditor from "./Richtexteditor";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function NoteEditorPage() {
  const { noteId: routeNoteId } = useParams<{ noteId: string }>();
  const isNew = !routeNoteId || routeNoteId === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [noteId, setNoteId] = useState<string | undefined>(isNew ? undefined : routeNoteId);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const hydrated = useRef(false); // avoid autosaving right after loading an existing note

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const { data: noteData, isLoading: noteLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId!),
    enabled: !!noteId,
  });

  // Hydrate local state once when editing an existing note
  useEffect(() => {
    if (noteData?.note && !hydrated.current) {
      const note = noteData.note;
      setTitle(note.title);
      setContent(note.content ?? "");
      setTags(note.tags ?? []);
      setSubjectId(
        typeof note.subjectId === "string" ? note.subjectId : note.subjectId?._id
      );
      hydrated.current = true;
    }
  }, [noteData]);

  // Default to the first subject for brand-new notes once subjects load
  useEffect(() => {
    if (isNew && !subjectId && subjects && subjects.length > 0) {
      setSubjectId(subjects[0]._id);
    }
  }, [isNew, subjectId, subjects]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("title", title || "Untitled note");
    fd.append("content", content);
    fd.append("tags", JSON.stringify(tags));
    if (pendingFile) fd.append("file", pendingFile);
    return fd;
  };

  // Full multipart save — only needed to create the note the very first time
  // (no id yet) or when a file is attached (the lightweight autosave route
  // deliberately never touches files).
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!subjectId) throw new Error("Pick a course first");
      const fd = buildFormData();
      if (!noteId) {
        const res = await createNoteApi(subjectId, fd);
        return res.note;
      }
      const res = await updateNoteApi(noteId, fd);
      return res.note;
    },
    onMutate: () => setStatus("saving"),
    onSuccess: (note: Note) => {
      setStatus("saved");
      setPendingFile(null);
      if (!noteId) {
        setNoteId(note._id);
        navigate(`/dashboard/notes/note/${note._id}`, { replace: true });
      }
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", note._id] });
    },
    onError: (err) => {
      setStatus("error");
      handleResponse({ error: err });
    },
  });

  // Lightweight autosave — everyday typing on an existing note. Skips
  // multer/Cloudinary entirely, so it's cheap to fire on every debounce tick.
  const autosaveMutation = useMutation({
    mutationFn: () => autosaveNoteApi(noteId!, { title, content, tags }),
    onMutate: () => setStatus("saving"),
    onSuccess: () => {
      setStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      setStatus("error");
      handleResponse({ error: err });
    },
  });

  const delMutation = useMutation({
    mutationFn: () => deleteNote(noteId!),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Note deleted" });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate("/dashboard/notes");
    },
    onError: (err) => handleResponse({ error: err }),
  });

  // Debounced autosave whenever title/content/tags change after initial load.
  // First save for a brand-new note must go through the full multipart create
  // call (it needs a subject + returns the new id); every save after that
  // uses the lightweight PATCH autosave route.
  useEffect(() => {
    if (!subjectId) return;
    if (isNew && !noteId && !title && !content && tags.length === 0) return; // nothing to save yet
    const t = setTimeout(() => {
      if (noteId) autosaveMutation.mutate();
      else saveMutation.mutate();
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags, subjectId, noteId]);

  // File attachments save immediately rather than waiting on the debounce
  useEffect(() => {
    if (pendingFile && subjectId) saveMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFile]);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  if (noteLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const subjectOptions = (subjects ?? []).map((s) => ({ value: s._id, label: s.name }));

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard/notes")}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to notes
        </button>

        <div className="flex items-center gap-4">
          <SaveIndicator status={status} />
          {!isNew && (
            <button
              onClick={() => confirm("Delete this note?") && delMutation.mutate()}
              className="text-neutral-400 hover:text-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter note title…"
        className="w-full text-3xl font-semibold text-neutral-900 placeholder:text-neutral-300 outline-none bg-transparent"
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-400">Course:</span>
          <Select
            size="small"
            style={{ minWidth: 160 }}
            loading={subjectsLoading}
            value={subjectId}
            options={subjectOptions}
            placeholder="Select a course"
            onChange={(v) => setSubjectId(v)}
          />
        </div>

        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs bg-violet-50 text-[#4b0082] px-2.5 py-1 rounded-full"
          >
            #{tag}
            <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex items-center gap-1">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="add tag"
            className="text-xs w-20 outline-none border-b border-dashed border-neutral-300 focus:border-neutral-500"
          />
          <button onClick={addTag} className="text-neutral-400 hover:text-neutral-700">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <label className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-600 hover:border-violet-200 hover:text-[#4b0082] cursor-pointer transition">
          <Paperclip className="w-3.5 h-3.5" />
          {pendingFile ? pendingFile.name : noteData?.note?.fileUrl ? "Replace file" : "Upload PDF"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {noteData?.note?.fileUrl && !pendingFile && (
        <a
          href={noteData.note.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#4b0082] underline underline-offset-2"
        >
          <Paperclip className="w-3.5 h-3.5" /> View attached file
        </a>
      )}

      <RichTextEditor content={content} onChange={setContent} />

      {!subjects || subjects.length === 0 ? (
        <p className="text-sm text-amber-600">
          You don't have any courses yet — create a subject first so this note has somewhere to live.
        </p>
      ) : null}
    </div>
  );
}

const SaveIndicator = ({ status }: { status: SaveStatus }) => {
  const label =
    status === "saving"
      ? "Saving…"
      : status === "saved"
      ? "Auto-saved"
      : status === "error"
      ? "Failed to save"
      : "";
  if (!label) return null;
  return (
    <span
      className={`text-xs ${
        status === "error" ? "text-red-500" : "text-neutral-400"
      }`}
    >
      {label}
    </span>
  );
};