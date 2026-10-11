import {
  BookOpen,
  ClipboardList,
  FileCheck2,
  LibraryBig,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import type {
  LibraryResource,
  ReportReason,
  ResourceCategory,
  ResourceStatus,
  Uploader,
} from "../types/libraryTypes";

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // matches the backend cap

export const ACCEPTED_EXTENSIONS =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp";

export const ACCEPTED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const CATEGORY_META: Record<
  ResourceCategory,
  { label: string; blurb: string; icon: LucideIcon }
> = {
  "study-material": {
    label: "Study Materials",
    blurb: "Lecture notes, handouts and summaries",
    icon: BookOpen,
  },
  "past-question": {
    label: "Past Questions",
    blurb: "Previous examination papers",
    icon: ClipboardList,
  },
  textbook: {
    label: "Textbooks & Guides",
    blurb: "Textbooks and supplementary guides",
    icon: LibraryBig,
  },
  "lecture-slides": {
    label: "Lecture Slides",
    blurb: "Shared presentations and decks",
    icon: Presentation,
  },
  assignment: {
    label: "Assignments",
    blurb: "Practice exercises and revision",
    icon: FileCheck2,
  },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META) as ResourceCategory[];

export const REPORT_REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: "incorrect", label: "Incorrect content", hint: "Wrong or misleading information" },
  { value: "inappropriate", label: "Inappropriate", hint: "Offensive or unsuitable material" },
  {
    value: "unauthorized",
    label: "Unauthorized",
    hint: "Copyrighted or shared without permission",
  },
  { value: "duplicate", label: "Duplicate", hint: "Already uploaded to the Library" },
  { value: "other", label: "Something else", hint: "Tell us more below" },
];

export const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "popular", label: "Most popular" },
  { value: "downloads", label: "Most downloaded" },
  { value: "views", label: "Most viewed" },
  { value: "title", label: "Title (A–Z)" },
  { value: "oldest", label: "Oldest first" },
] as const;

export const LEVELS = ["100", "200", "300", "400", "500", "600"];

export const STATUS_STYLES: Record<ResourceStatus, { label: string; className: string }> = {
  approved: {
    label: "Live",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  pending: {
    label: "Awaiting review",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  flagged: {
    label: "Under review",
    className: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  },
};

export const FILE_TYPE_LABEL: Record<string, string> = {
  pdf: "PDF",
  document: "DOC",
  presentation: "PPT",
  spreadsheet: "XLS",
  image: "IMG",
  text: "TXT",
  file: "FILE",
};

export const fileTypeLabel = (t: string) => FILE_TYPE_LABEL[t] ?? t.toUpperCase();

export const formatBytes = (bytes?: number) => {
  if (bytes == null) return "—";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const compactNumber = (n = 0) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const timeAgo = (iso: string) => {
  try {
    return `${formatDistanceToNowStrict(new Date(iso))} ago`;
  } catch {
    return "";
  }
};

export const getUploader = (r: Pick<LibraryResource, "uploaderId">): Uploader | null =>
  r.uploaderId && typeof r.uploaderId === "object" ? r.uploaderId : null;

export const uploaderName = (r: Pick<LibraryResource, "uploaderId">) =>
  getUploader(r)?.name || "LeafLine student";

export const uploaderPicture = (r: Pick<LibraryResource, "uploaderId">): string | null => {
  const p = getUploader(r)?.picture;
  if (!p) return null;
  return typeof p === "string" ? p : (p.url ?? null);
};

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

/**
 * Download a file under its original name (with extension).
 *
 * We fetch the file and save it from a blob so the filename is always correct
 * and nothing depends on a popup (a new-tab link opened after an `await` gets
 * blocked by most browsers). If the fetch itself can't run (e.g. blocked by
 * CORS) we fall back to a same-tab navigation — the file host sends a
 * "download" header, so the browser saves the file without leaving the app.
 */
export const downloadFromUrl = async (url: string, filename: string) => {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    window.location.assign(url);
    return;
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403)
      throw new Error(
        "The file server refused the download (" +
          res.status +
          "). If you use Cloudinary, enable “PDF and ZIP files delivery” under Settings → Security.",
      );
    if (res.status === 404) throw new Error("The file could not be found on the file server.");
    throw new Error(`Download failed (${res.status}). Please try again.`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
};