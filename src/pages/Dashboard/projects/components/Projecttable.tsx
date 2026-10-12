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

interface TableProps {
  projects: Project[];
  onRestore?: (id: string) => void;
  /** id of the project currently being restored, if any */
  restoringId?: string | null;
}

interface RowProps {
  project: Project;
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

const ProjectRow = ({ project: p, onRestore, restoring }: RowProps) => {
  const navigate = useNavigate();
  const c = COLOR_STYLES[p.color];
  const completed = p.status === "completed";
  const due = dueInfo(p.deadline, completed);
  const open = () => navigate(`/dashboard/projects/${p._id}`);

  const keyOpen = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return; // ignore keys pressed on the Restore button
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const cell = "px-4 py-3.5 align-middle";

  return (
    <tr
      tabIndex={0}
      onClick={open}
      onKeyDown={keyOpen}
      className={cn(
        "group cursor-pointer transition-colors",
        "border-b border-neutral-200 dark:border-neutral-800 last:border-b-0",
        "hover:bg-neutral-50 dark:hover:bg-white/[0.04]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500",
        p.archived && "opacity-80",
      )}
    >
      {/* Project */}
      <td className={cn(cell, "pl-5")}>
        <div className="flex items-center gap-3 min-w-0">
          <ProjectIcon icon={p.icon} color={p.color} size={40} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[260px]">
                {p.title}
              </span>
              {p.archived && (
                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 shrink-0">
                  <Archive className="w-3 h-3" /> Archived
                </span>
              )}
            </div>
            <div className="mt-1">
              <CategoryChip category={p.category} />
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className={cell}>
        <StatusChip status={p.status} />
      </td>

      {/* Progress */}
      <td className={cn(cell, "w-[220px]")}>
        <div className="flex justify-between text-xs mb-1.5 text-neutral-500">
          <span>
            {p.stats.completed}/{p.stats.total} tasks
            {p.stats.overdue > 0 && (
              <span className="ml-1.5 text-rose-600 dark:text-rose-400 font-medium">
                · {p.stats.overdue} overdue
              </span>
            )}
          </span>
          <span className={cn("font-semibold", c.text)}>{p.stats.percent}%</span>
        </div>
        <ProgressBar percent={p.stats.percent} color={p.color} height={6} />
      </td>

      {/* Due */}
      <td className={cn(cell, "whitespace-nowrap")}>
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", TONE_TEXT[due.tone])}>
          {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CalendarClock className="w-3.5 h-3.5" />}
          {completed && !p.deadline ? "Completed" : due.label}
        </span>
      </td>

      {/* Team */}
      <td className={cell}>
        {p.visibility === "team" && p.members.length > 1 ? (
          <AvatarStack people={p.members} max={4} size={26} />
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 rounded-full bg-neutral-100 dark:bg-white/10 px-2 py-1">
            <Users className="w-3 h-3" /> Solo
          </span>
        )}
      </td>

      {/* Actions */}
      <td className={cn(cell, "pr-5 text-right")}>
        {p.archived && p.role === "owner" && onRestore ? (
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
        ) : null}
      </td>
    </tr>
  );
};

const HEAD = "px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap";

export const ProjectTable = ({ projects, onRestore, restoringId }: TableProps) => (
  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th scope="col" className={cn(HEAD, "pl-5")}>Project</th>
            <th scope="col" className={HEAD}>Status</th>
            <th scope="col" className={HEAD}>Progress</th>
            <th scope="col" className={HEAD}>Due</th>
            <th scope="col" className={HEAD}>Team</th>
            <th scope="col" className={cn(HEAD, "pr-5 text-right")}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <ProjectRow
              key={p._id}
              project={p}
              onRestore={onRestore}
              restoring={restoringId === p._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);