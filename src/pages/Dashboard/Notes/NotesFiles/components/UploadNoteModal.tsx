// src/features/notes/components/UploadNoteModal.tsx
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, UploadCloud } from "lucide-react";
import { createNoteApi } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";

type Props = {
  open: boolean;
  onClose: () => void;
  subjectId: string;
};

export default function UploadNoteModal({ open, onClose, subjectId }: Props) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createNoteApi(subjectId, formData),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Note uploaded!" });
      queryClient.invalidateQueries({ queryKey: ["notes", subjectId] });
      handleClose();
    },
    onError: (err) => handleResponse({ error: err }),
  });

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const fd = new FormData();
    fd.append("title", title.trim());
    if (description) fd.append("description", description);
    if (file) fd.append("file", file);
    mutation.mutate(fd);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="
        w-full max-w-md mx-4 rounded-sm
        bg-white dark:bg-[#111111]
        border border-amber-200/30 dark:border-neutral-800
        shadow-xl p-6 space-y-5
      ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-['Georgia',_serif] font-bold text-lg text-[#0D1F3C] dark:text-white">
            Upload Note
          </h2>
          <button onClick={handleClose} className="p-1 rounded hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Week 3 Lecture Slides"
            className="
              w-full px-3 py-2 rounded-sm text-sm
              bg-[#F7F4EE] dark:bg-[#1b1b1b]
              border border-amber-200/30 dark:border-neutral-700
              text-[#0D1F3C] dark:text-white
              placeholder:text-slate-400 outline-none
              focus:border-amber-400/60 transition
            "
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional notes..."
            className="
              w-full px-3 py-2 rounded-sm text-sm resize-none
              bg-[#F7F4EE] dark:bg-[#1b1b1b]
              border border-amber-200/30 dark:border-neutral-700
              text-[#0D1F3C] dark:text-white
              placeholder:text-slate-400 outline-none
              focus:border-amber-400/60 transition
            "
          />
        </div>

        {/* File picker */}
        <div
          onClick={() => fileRef.current?.click()}
          className="
            flex flex-col items-center justify-center gap-2
            border-2 border-dashed border-amber-300/40 dark:border-neutral-700
            rounded-sm py-8 cursor-pointer
            hover:border-amber-400/60 transition
          "
        >
          <UploadCloud className="w-8 h-8 text-amber-500" />
          {file ? (
            <p className="text-sm font-semibold text-[#0D1F3C] dark:text-white">
              {file.name}
            </p>
          ) : (
            <p className="text-sm text-slate-400">Click to select a file</p>
          )}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleClose}
            className="
              flex-1 py-2 rounded-sm text-sm font-semibold
              border border-amber-200/40 dark:border-neutral-700
              text-slate-500 dark:text-neutral-400
              hover:bg-white/5 transition
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || mutation.isPending}
            className="
              flex-1 py-2 rounded-sm text-sm font-semibold
              bg-amber-500 hover:bg-amber-600 text-white
              disabled:opacity-50 disabled:cursor-not-allowed transition
            "
          >
            {mutation.isPending ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}