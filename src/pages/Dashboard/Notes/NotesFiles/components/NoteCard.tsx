import { Link } from "react-router-dom";
import { FileText, FileImage, FileCode, MoreVertical } from "lucide-react";
import type { Note } from "../interface/notes";

const fileIcon = (fileType?: string) => {
  if (fileType === "image") return <FileImage className="w-[18px] h-[18px]" />;
  if (fileType === "file") return <FileCode className="w-[18px] h-[18px]" />;
  return <FileText className="w-[18px] h-[18px]" />;
};

const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

// content is rich-text HTML — strip tags for a plain-text card preview
const excerpt = (html: string, max = 140) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

type Props = {
  note: Note;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onDelete: () => void;
};

export default function NoteCard({ note, menuOpen, onToggleMenu, onDelete }: Props) {
  const subjectCode = typeof note.subjectId === "object" ? note.subjectId?.code : undefined;
  const preview = note.description || (note.content ? excerpt(note.content) : "No content yet.");

  return (
    <div className="relative rounded-xl border border-neutral-200 dark:border-[#2e2b30] bg-white dark:bg-[#1c1b1b] p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-[#9d4edd]/15 text-[#4b0082] dark:text-[#9d4edd] flex items-center justify-center">
          {fileIcon(note.fileType)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{relativeTime(note.updatedAt)}</span>
          <button onClick={onToggleMenu} className="text-neutral-400 dark:hover:text-neutral-200 hover:text-neutral-700">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-12 bg-white dark:bg-[#262525] border border-neutral-200 dark:border-[#2e2b30] rounded-lg shadow-lg text-sm z-10 overflow-hidden">
          <Link to={`/dashboard/notes/note/${note._id}`} className="block px-4 py-2 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-[#333]">
            Open
          </Link>
          <button onClick={onDelete} className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40">
            Delete
          </button>
        </div>
      )}

      <Link to={`/dashboard/notes/note/${note._id}`}>
        <h3 className="font-semibold text-neutral-900 dark:text-white">{note.title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{preview}</p>
      </Link>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {subjectCode && (
          <span className="text-xs bg-neutral-100 dark:bg-[#262525] text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded">{subjectCode}</span>
        )}
        {(note.tags ?? []).slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs bg-violet-50 dark:bg-[#9d4edd]/15 text-[#4b0082] dark:text-[#9d4edd] px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}