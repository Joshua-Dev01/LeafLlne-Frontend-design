import {
  Briefcase,
  BookOpen,
  Calculator,
  Cpu,
  FlaskConical,
  Folder,
  Globe,
  Heart,
  Lightbulb,
  Microscope,
  Palette,
  Rocket,
  Scale,
  Code,
  type LucideIcon,
} from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import type {
  ProjectColor,
  ProjectIconKey,
  TaskPriority,
  TaskStatus,
} from "../interface/ProjectType";

/* Tailwind needs whole class names, so every colour is spelled out. */
export const COLOR_STYLES: Record<
  ProjectColor,
  { grad: string; soft: string; bar: string; text: string; swatch: string; glow: string; edge: string }
> = {
  violet: {
    grad: "from-violet-500 to-fuchsia-500",
    soft: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    bar: "from-violet-500 to-fuchsia-500",
    text: "text-violet-600 dark:text-violet-300",
    swatch: "bg-violet-500",
    glow: "hover:shadow-violet-500/15",
    edge: "hover:border-violet-300 dark:hover:border-violet-500/50",
  },
  indigo: {
    grad: "from-indigo-500 to-violet-500",
    soft: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    bar: "from-indigo-500 to-violet-500",
    text: "text-indigo-600 dark:text-indigo-300",
    swatch: "bg-indigo-500",
    glow: "hover:shadow-indigo-500/15",
    edge: "hover:border-indigo-300 dark:hover:border-indigo-500/50",
  },
  sky: {
    grad: "from-sky-500 to-indigo-500",
    soft: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    bar: "from-sky-500 to-indigo-500",
    text: "text-sky-600 dark:text-sky-300",
    swatch: "bg-sky-500",
    glow: "hover:shadow-sky-500/15",
    edge: "hover:border-sky-300 dark:hover:border-sky-500/50",
  },
  teal: {
    grad: "from-teal-500 to-emerald-500",
    soft: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    bar: "from-teal-500 to-emerald-500",
    text: "text-teal-600 dark:text-teal-300",
    swatch: "bg-teal-500",
    glow: "hover:shadow-teal-500/15",
    edge: "hover:border-teal-300 dark:hover:border-teal-500/50",
  },
  emerald: {
    grad: "from-emerald-500 to-teal-400",
    soft: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    bar: "from-emerald-500 to-teal-400",
    text: "text-emerald-600 dark:text-emerald-300",
    swatch: "bg-emerald-500",
    glow: "hover:shadow-emerald-500/15",
    edge: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
  },
  amber: {
    grad: "from-amber-500 to-orange-500",
    soft: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    bar: "from-amber-500 to-orange-500",
    text: "text-amber-600 dark:text-amber-300",
    swatch: "bg-amber-500",
    glow: "hover:shadow-amber-500/15",
    edge: "hover:border-amber-300 dark:hover:border-amber-500/50",
  },
  rose: {
    grad: "from-rose-500 to-pink-500",
    soft: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    bar: "from-rose-500 to-pink-500",
    text: "text-rose-600 dark:text-rose-300",
    swatch: "bg-rose-500",
    glow: "hover:shadow-rose-500/15",
    edge: "hover:border-rose-300 dark:hover:border-rose-500/50",
  },
  fuchsia: {
    grad: "from-fuchsia-500 to-purple-500",
    soft: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
    bar: "from-fuchsia-500 to-purple-500",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
    swatch: "bg-fuchsia-500",
    glow: "hover:shadow-fuchsia-500/15",
    edge: "hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50",
  },
};

export const COLOR_KEYS = Object.keys(COLOR_STYLES) as ProjectColor[];

export const ICONS: Record<ProjectIconKey, LucideIcon> = {
  folder: Folder,
  rocket: Rocket,
  flask: FlaskConical,
  code: Code,
  book: BookOpen,
  palette: Palette,
  calculator: Calculator,
  globe: Globe,
  microscope: Microscope,
  briefcase: Briefcase,
  scale: Scale,
  heart: Heart,
  cpu: Cpu,
  lightbulb: Lightbulb,
};
export const ICON_KEYS = Object.keys(ICONS) as ProjectIconKey[];

// Keep in sync with PROJECT_CATEGORIES on the server.
export const CATEGORIES = [
  "Computer Science",
  "Engineering",
  "Biology & Life Sciences",
  "Physics & Chemistry",
  "Mathematics",
  "Medicine & Health",
  "Business & Economics",
  "Law",
  "Social Sciences",
  "Arts & Humanities",
  "Education",
  "Other",
];

export const CATEGORY_TONE: Record<string, ProjectColor> = {
  "Computer Science": "violet",
  Engineering: "amber",
  "Biology & Life Sciences": "emerald",
  "Physics & Chemistry": "sky",
  Mathematics: "indigo",
  "Medicine & Health": "rose",
  "Business & Economics": "teal",
  Law: "indigo",
  "Social Sciences": "fuchsia",
  "Arts & Humanities": "rose",
  Education: "sky",
  Other: "violet",
};

export const STATUS_META: Record<
  TaskStatus,
  { label: string; chip: string; dot: string; column: string }
> = {
  "not-started": {
    label: "Not Started",
    chip: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
    dot: "bg-neutral-400",
    column: "To do",
  },
  "in-progress": {
    label: "In Progress",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    dot: "bg-violet-500",
    column: "In progress",
  },
  completed: {
    label: "Completed",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    dot: "bg-emerald-500",
    column: "Completed",
  },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; chip: string; dot: string }> = {
  high: {
    label: "High",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  medium: {
    label: "Medium",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

/* ── Dates ── */
export const fmtDate = (iso?: string | null, pattern = "MMM d") =>
  iso ? format(new Date(iso), pattern) : "";

/** yyyy-MM-dd for <input type="date"> */
export const toInputDate = (iso?: string | null) => (iso ? format(new Date(iso), "yyyy-MM-dd") : "");

export type DueTone = "none" | "ok" | "soon" | "overdue" | "done";

export const dueInfo = (iso?: string | null, completed = false): { label: string; tone: DueTone } => {
  if (!iso) return { label: "No deadline", tone: "none" };
  const days = differenceInCalendarDays(new Date(iso), new Date());
  if (completed) return { label: `Due ${fmtDate(iso)}`, tone: "done" };
  if (days < 0) return { label: `Overdue by ${-days} day${days === -1 ? "" : "s"}`, tone: "overdue" };
  if (days === 0) return { label: "Due today", tone: "soon" };
  if (days === 1) return { label: "Due tomorrow", tone: "soon" };
  if (days <= 7) return { label: `Due in ${days} days`, tone: "soon" };
  return { label: `Due ${fmtDate(iso)} · ${days} days left`, tone: "ok" };
};

export const TONE_TEXT: Record<DueTone, string> = {
  none: "text-neutral-400",
  ok: "text-neutral-500 dark:text-neutral-400",
  soon: "text-amber-600 dark:text-amber-400",
  overdue: "text-rose-600 dark:text-rose-400",
  done: "text-emerald-600 dark:text-emerald-400",
};

/* ── People ── */
export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

const AVATAR_TONES = [
  "bg-violet-500",
  "bg-indigo-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-fuchsia-500",
];

/** The same person always gets the same colour. */
export const avatarTone = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_TONES[Math.abs(h) % AVATAR_TONES.length];
};
