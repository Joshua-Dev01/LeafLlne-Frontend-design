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
} from "lucide-react";

import type { Note } from "../interface/notes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";

const fileIcon = (fileType?: string) => {
  if (fileType === "image") return <FileImage className="w-[18px] h-[18px]" />;
  if (fileType === "file") return <FileCode className="w-[18px] h-[18px]" />;
  return <FileText className="w-[18px] h-[18px]" />;
};

const lastModified = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const excerpt = (html: string, max = 70) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

type Props = {
  notes: Note[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NotesTable({
  notes,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: Props) {
  const allSelected = notes.length > 0 && selectedIds.length === notes.length;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-purple-900/30 bg-white dark:bg-black overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-purple-900/30 text-left">
            <th className="w-10 py-3 pl-5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="accent-purple-600 w-4 h-4 rounded"
              />
            </th>
            <th className="py-3 px-3 text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              Title &amp; Snippet
            </th>
            <th className="py-3 px-3 text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
              Course
            </th>
            <th className="py-3 px-3 text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">
              Tags
            </th>
            <th className="py-3 px-3 text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">
              Last Modified
            </th>
            <th className="py-3 pr-5 text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, i) => {
            const subject =
              typeof note.subjectId === "object" ? note.subjectId : undefined;
            const preview =
              note.description || (note.content ? excerpt(note.content) : "No content yet.");

            return (
              <motion.tr
                key={note._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className="border-b last:border-b-0 border-neutral-100 dark:border-purple-900/20 hover:bg-purple-50/50 dark:hover:bg-purple-500/[0.04] transition-colors"
              >
                <td className="py-4 pl-5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(note._id)}
                    onChange={() => onToggleSelect(note._id)}
                    className="accent-purple-600 w-4 h-4 rounded"
                  />
                </td>

                <td className="py-4 px-3">
                  <Link to={`/dashboard/notes/note/${note._id}`} className="flex items-start gap-3">
                    <span className="w-9 h-9 flex-shrink-0 rounded-lg bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                      {fileIcon(note.fileType)}
                    </span>
                    <span>
                      <span className="block font-semibold text-neutral-900 dark:text-white">
                        {note.title}
                      </span>
                      <span className="block text-neutral-500 dark:text-neutral-400 text-xs mt-0.5 max-w-xs line-clamp-1">
                        {preview}
                      </span>
                    </span>
                  </Link>
                </td>

                <td className="py-4 px-3 hidden md:table-cell align-top">
                  {subject ? (
                    <>
                      <span className="block font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                        {subject.code}
                      </span>
                      <span className="block text-neutral-400 dark:text-neutral-500 text-xs">
                        {subject.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-neutral-300 dark:text-neutral-600 text-xs">—</span>
                  )}
                </td>

                <td className="py-4 px-3 hidden lg:table-cell align-top">
                  <div className="flex flex-wrap gap-1.5 max-w-[160px]">
                    {(note.tags ?? []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="py-4 px-3 hidden sm:table-cell align-top text-neutral-500 dark:text-neutral-400 text-xs">
                  {lastModified(note.updatedAt)}
                </td>

                <td className="py-4 pr-5 text-right align-top">
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
                          to={`/dashboard/notes/note/${note._id}`}
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
                        className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition"
                        onClick={() => onDelete(note)}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}