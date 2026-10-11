import {
  Bell,
  CalendarClock,
  FolderKanban,
  Library,
  NotebookPen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "./interface/notificationTypes";

export interface NotificationTypeMeta {
  /** Tab / chip label */
  label: string;
  /** Row title in the preferences list */
  preferenceLabel: string;
  description: string;
  icon: LucideIcon;
  /** Icon tile colours — light and dark */
  tile: string;
}

export const TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  event: {
    label: "Events",
    preferenceLabel: "Events & reminders",
    description: "24-hour reminders for events you joined",
    icon: CalendarClock,
    tile: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
  library: {
    label: "Library",
    preferenceLabel: "Library",
    description: "Uploads, approvals and moderation decisions",
    icon: Library,
    tile: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  note: {
    label: "Notes",
    preferenceLabel: "Notes & subjects",
    description: "Activity on your notes and subjects",
    icon: NotebookPen,
    tile: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
  ai: {
    label: "AI Assistant",
    preferenceLabel: "AI study assistant",
    description: "Summaries and study insights",
    icon: Sparkles,
    tile: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
  },
  project: {
    label: "Projects",
    preferenceLabel: "Projects",
    description: "Updates on your projects",
    icon: FolderKanban,
    tile: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  system: {
    label: "System",
    preferenceLabel: "Account & system",
    description: "Important account messages — always on",
    icon: Bell,
    tile: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
  },
};

/** Shared control styles so the page reads as one system in both themes. */
export const ui = {
  card: "rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-[#2e2b30] dark:bg-[#111113] dark:shadow-none",
  focus:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black",
  primaryBtn:
    "inline-flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-violet-600 dark:hover:bg-violet-400",
  secondaryBtn:
    "inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10",
  ghostBtn:
    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100",
  chip: "rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:bg-white/5 dark:text-neutral-300",
  muted: "text-neutral-500 dark:text-neutral-400",
} as const;
