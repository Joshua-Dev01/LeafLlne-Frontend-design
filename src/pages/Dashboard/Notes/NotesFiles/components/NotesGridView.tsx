// src/pages/Dashboard/Notes/NotesFiles/components/NotesGridView.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MoreVertical,
  FileText,
  FileImage,
  FileCode,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

import type { Note } from "../interface/notes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { downloadNoteAttachment, downloadNoteContent } from "../utilities/downloadNote";

const fileIcon = (fileType?: string) => {
  if (fileType === "image") return <FileImage className="w-[18px] h-[18px]" />;
  if (fileType === "file") return <FileCode className="w-[18px] h-[18px]" />;
  return <FileText className="w-[18px] h-[18px]" />;
};

const lastModified = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "2-digit" });

const excerpt = (html: string, max = 90) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

type Props = {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NotesGridView({ notes, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note, i) => {
        const subject = typeof note.subjectId === "object" ? note.subjectId : undefined;
        const preview = note.description || (note.content ? excerpt(note.content) : "No content yet.");

        return (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
            className="rounded-2xl border border-neutral-200 dark:border-purple-900/30 bg-white dark:bg-black p-4 flex flex-col gap-3 hover:border-purple-300 dark:hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="w-9 h-9 flex-shrink-0 rounded-lg bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                {fileIcon(note.fileType)}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition">
                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="rounded-xl bg-white dark:bg-[#1b1b1b] overflow-hidden border border-neutral-200 dark:border-purple-900/30 shadow-xl"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/dashboard/notes/view/${note._id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition"
                    onClick={() => onEdit(note)}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition"
                    onClick={() => downloadNoteContent(note)}
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </DropdownMenuItem>

                  {note.fileUrl && (
                    <DropdownMenuItem
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition"
                      onClick={() => downloadNoteAttachment(note)}
                    >
                      <Download className="w-3.5 h-3.5" /> Download attachment
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition"
                    onClick={() => onDelete(note)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link to={`/dashboard/notes/view/${note._id}`} className="flex-1 flex flex-col gap-1.5">
              <span className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                {note.title}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-2">
                {preview}
              </span>
            </Link>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-purple-900/20">
              {subject ? (
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  {subject.code}
                </span>
              ) : (
                <span />
              )}
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {lastModified(note.updatedAt)}
              </span>
            </div>

            {(note.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(note.tags ?? []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}