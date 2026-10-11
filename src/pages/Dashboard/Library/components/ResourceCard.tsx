import { Bookmark, Eye } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { LibraryResource } from "../types/libraryTypes";
import {
  CATEGORY_META,
  compactNumber,
  fileTypeLabel,
  formatBytes,
  timeAgo,
  uploaderName,
} from "../utils/libraryUtils";
import { PersonAvatar, StatusBadge } from "./LibraryBits";

interface Props {
  resource: LibraryResource;
  onOpen: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  /** Show the moderation status (used in "My uploads"). */
  showStatus?: boolean;
}

export const ResourceCard = ({ resource: r, onOpen, onToggleBookmark, showStatus }: Props) => {
  const meta = CATEGORY_META[r.category];
  const Icon = meta.icon;
  const canBookmark = !!onToggleBookmark && r.status === "approved";

  return (
    <article
      onClick={() => onOpen(r._id)}
      className={cn(
        "group flex flex-col rounded-2xl cursor-pointer transition overflow-hidden",
        "bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800",
        "hover:border-violet-300 dark:hover:border-[#9d4edd]/60 hover:shadow-lg hover:shadow-violet-500/5",
      )}
    >
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium bg-violet-50 text-[#4b0082] dark:bg-[#9d4edd]/15 dark:text-[#d9b8ff]">
            <Icon className="w-3.5 h-3.5" />
            {meta.label}
          </span>
          <div className="flex items-center gap-1">
            {showStatus && <StatusBadge status={r.status} />}
            {canBookmark && (
              <button
                type="button"
                aria-label={r.isBookmarked ? "Remove bookmark" : "Save to bookmarks"}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark?.(r._id);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-[#262525] transition cursor-pointer"
              >
                <Bookmark
                  className={cn(
                    "w-4 h-4",
                    r.isBookmarked
                      ? "fill-[#4b0082] text-[#4b0082] dark:fill-[#9d4edd] dark:text-[#9d4edd]"
                      : "text-neutral-400",
                  )}
                />
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[15px] leading-snug text-neutral-900 dark:text-white line-clamp-2 group-hover:text-[#4b0082] dark:group-hover:text-[#d9b8ff] transition-colors">
            {r.title}
          </h3>
          {r.description && (
            <p className="text-[13px] text-neutral-500 mt-1.5 line-clamp-2">{r.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 mt-auto">
          <span className="rounded bg-neutral-100 dark:bg-[#1f1f1f] px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
            {fileTypeLabel(r.fileType)}
          </span>
          <span>{formatBytes(r.fileSize)}</span>
          {r.courseCode && (
            <>
              <span aria-hidden>•</span>
              <span className="font-medium text-[#4b0082] dark:text-[#d9b8ff]">{r.courseCode}</span>
            </>
          )}
          {r.level && (
            <>
              <span aria-hidden>•</span>
              <span>{r.level} Level</span>
            </>
          )}
        </div>

        {showStatus && r.status === "rejected" && r.rejectionReason && (
          <p className="text-xs rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 px-2.5 py-2">
            {r.rejectionReason}
          </p>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/60 dark:bg-[#0d0d0d]">
        <div className="flex items-center gap-2 min-w-0">
          <PersonAvatar resource={r} size={26} />
          <div className="min-w-0 leading-tight">
            <p className="text-xs font-medium text-neutral-800 dark:text-neutral-100 truncate">
              {uploaderName(r)}
            </p>
            <p className="text-[11px] text-neutral-400">{timeAgo(r.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500 shrink-0">
          <span className="inline-flex items-center gap-1" title="Views">
            <Eye className="w-3.5 h-3.5" /> {compactNumber(r.viewCount)}
          </span>
          <span className="inline-flex items-center gap-1" title="Saves">
            <Bookmark className="w-3.5 h-3.5" /> {compactNumber(r.bookmarkCount)}
          </span>
        </div>
      </footer>
    </article>
  );
};

export const ResourceCardSkeleton = () => (
  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] overflow-hidden animate-pulse">
    <div className="p-4 space-y-3">
      <div className="h-5 w-28 rounded-md bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-4/5 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
      <div className="h-3 w-2/3 rounded bg-neutral-100 dark:bg-neutral-900" />
      <div className="h-4 w-40 rounded bg-neutral-100 dark:bg-neutral-900 mt-6" />
    </div>
    <div className="h-14 border-t border-neutral-100 dark:border-neutral-900" />
  </div>
);

export const ResourceGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {children}
  </div>
);
