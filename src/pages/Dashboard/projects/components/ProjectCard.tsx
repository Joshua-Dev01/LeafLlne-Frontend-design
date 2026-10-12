import { Archive, CalendarClock, CheckCircle2, Loader2, RotateCcw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../../lib/utils";
import type { Project } from "../interface/ProjectType";
import {
  CATEGORY_TONE,
  COLOR_STYLES,
  TONE_TEXT,
  dueInfo,
} from "../utils/projectTheme";
import { AvatarStack, ProgressBar, ProjectIcon, StatusChip } from "./Bits";

interface Props {
  project: Project;
  view: "grid" | "list";
  onRestore?: (id: string) => void;
  restoring?: boolean;
}

const CategoryChip = ({ category }: { category: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
      COLOR_STYLES[CATEGORY_TONE[category] ?? "violet"].soft,
    )}
  >
    {category}
  </span>
);

export const ProjectCard = ({ project: p, view, onRestore, restoring }: Props) => {
  const navigate = useNavigate();
  const c = COLOR_STYLES[p.color];
  const completed = p.status === "completed";
  const due = dueInfo(p.deadline, completed);
  const open = () => navigate(`/dashboard/projects/${p._id}`);

  const dueLine = (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", TONE_TEXT[due.tone])}>
      {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CalendarClock className="w-3.5 h-3.5" />}
      {completed && !p.deadline ? "Completed" : due.label}
    </span>
  );

  const restoreBtn =
    p.archived && p.role === "owner" && onRestore ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRestore(p._id);
        }}
        disabled={restoring}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer disabled:opacity-50"
      >
        {restoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        Restore
      </button>
    ) : null;

  const shell = cn(
    "group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-200",
    "bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800",
    "hover:shadow-xl hover:-translate-y-0.5",
    c.glow,
    c.edge,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
    p.archived && "opacity-80",
  );
  const keyOpen = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  /* ── List row ── */
  if (view === "list")
    return (
      <article role="link" tabIndex={0} onClick={open} onKeyDown={keyOpen} className={shell}>
        <span className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", c.grad)} />
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 p-4 pl-5">
          <div className="flex items-center gap-3 md:w-[34%] min-w-0">
            <ProjectIcon icon={p.icon} color={p.color} size={40} />
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{p.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <CategoryChip category={p.category} />
                {p.archived && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                    <Archive className="w-3 h-3" /> Archived
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-[24%]">
            <div className="flex justify-between text-xs mb-1.5 text-neutral-500">
              <span>
                {p.stats.completed}/{p.stats.total} tasks
              </span>
              <span className={cn("font-semibold", c.text)}>{p.stats.percent}%</span>
            </div>
            <ProgressBar percent={p.stats.percent} color={p.color} height={6} />
          </div>
          <div className="md:w-[18%]">{dueLine}</div>
          <div className="flex items-center justify-between md:justify-end gap-3 md:flex-1">
            <StatusChip status={p.status} />
            <AvatarStack people={p.members} max={3} size={26} />
            {restoreBtn}
          </div>
        </div>
      </article>
    );

  /* ── Grid card ── */
  return (
    <article role="link" tabIndex={0} onClick={open} onKeyDown={keyOpen} className={cn(shell, "flex flex-col")}>
      <span className={cn("h-1.5 w-full bg-gradient-to-r", c.grad)} />
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <ProjectIcon icon={p.icon} color={p.color} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryChip category={p.category} />
              <StatusChip status={p.status} />
            </div>
            <h3 className="mt-2 font-semibold text-[17px] leading-snug text-neutral-900 dark:text-white line-clamp-2">
              {p.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 min-h-[2.5rem]">
          {p.description || "No description yet."}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              {p.stats.completed} / {p.stats.total} tasks done
              {p.stats.overdue > 0 && (
                <span className="ml-2 text-rose-600 dark:text-rose-400 font-medium">
                  · {p.stats.overdue} overdue
                </span>
              )}
            </span>
            <span className={cn("font-bold", c.text)}>{p.stats.percent}%</span>
          </div>
          <ProgressBar percent={p.stats.percent} color={p.color} />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {dueLine}
          <div className="flex items-center gap-2">
            {p.visibility === "team" && p.members.length > 1 ? (
              <AvatarStack people={p.members} max={4} size={26} />
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 rounded-full bg-neutral-100 dark:bg-white/10 px-2 py-1">
                <Users className="w-3 h-3" /> Solo
              </span>
            )}
            {restoreBtn}
          </div>
        </div>
      </div>
      {p.archived && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-neutral-900/80 text-white text-[10px] font-semibold px-2 py-1">
          <Archive className="w-3 h-3" /> Archived
        </span>
      )}
    </article>
  );
};