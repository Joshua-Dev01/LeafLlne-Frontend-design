import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Flag,
  ListChecks,
  Pencil,
  Trash2,
  User,
  X,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { useTaskMutations, useTasks } from "../api/useProject";
import { Avatar, ConfirmDialog } from "../components/Bits";
import { PRIORITY_META, STATUS_META, TONE_TEXT, dueInfo } from "../utils/projectTheme";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  taskId: string | null;
  /** false for archived projects: hides Edit, Delete and the checkboxes */
  writable: boolean;
  /** Hand off to the edit modal */
  onEdit: (taskId: string) => void;
}

const Row = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 py-2.5">
    <span className="w-28 shrink-0 inline-flex items-center gap-2 text-xs font-medium text-neutral-500">
      {icon}
      {label}
    </span>
    <div className="min-w-0 text-sm text-neutral-900 dark:text-white">{children}</div>
  </div>
);

export const TaskDrawer = ({ open, onClose, projectId, taskId, writable, onEdit }: Props) => {
  const { data: tasks } = useTasks(projectId);
  const m = useTaskMutations(projectId);
  // Remember the last task so its content stays visible while the panel slides out
  const lastId = useRef<string | null>(null);
  if (taskId) lastId.current = taskId;
  const activeId = taskId ?? lastId.current;
  const task = activeId ? tasks?.find((t) => t._id === activeId) : undefined;

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Keep the panel mounted while it slides out
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  // Esc closes (unless the delete confirmation is on top)
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmDelete) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, confirmDelete, onClose]);

  if (!mounted) return null;

  const done = task?.status === "completed";
  const due = task ? dueInfo(task.dueDate, done) : null;
  const subs = task?.subtasks ?? [];
  const subDone = subs.filter((s) => s.done).length;
  const subPct = subs.length ? Math.round((subDone / subs.length) * 100) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-1/2 sm:min-w-[420px] sm:max-w-[640px]",
          "bg-white dark:bg-[#111111] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          shown ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 h-14 border-b border-neutral-100 dark:border-neutral-900 shrink-0">
          {task ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                STATUS_META[task.status].chip,
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_META[task.status].dot)} />
              {STATUS_META[task.status].label}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1">
            {task && writable && (
              <button
                onClick={() => onEdit(task._id)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            )}
            {task && writable && task.canDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close task details"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!task ? (
          <div className="flex-1 flex items-center justify-center text-sm text-neutral-500">Task not found.</div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            <h2
              className={cn(
                "text-xl font-bold leading-snug text-neutral-900 dark:text-white break-words",
                done && "line-through text-neutral-400 dark:text-neutral-500",
              )}
            >
              {task.title}
            </h2>

            {/* Properties */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-4">
              <Row icon={<User className="w-3.5 h-3.5" />} label="Assignee">
                {task.assignedTo ? (
                  <span className="inline-flex items-center gap-2">
                    <Avatar person={task.assignedTo} size={24} />
                    {task.assignedTo.name}
                  </span>
                ) : (
                  <span className="text-neutral-400">Unassigned</span>
                )}
              </Row>
              <Row icon={<CalendarDays className="w-3.5 h-3.5" />} label="Due date">
                {task.dueDate && due ? (
                  <span className={cn("font-medium", TONE_TEXT[due.tone])}>{due.label}</span>
                ) : (
                  <span className="text-neutral-400">No due date</span>
                )}
              </Row>
              <Row icon={<Flag className="w-3.5 h-3.5" />} label="Priority">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-bold",
                    PRIORITY_META[task.priority].chip,
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_META[task.priority].dot)} />
                  {PRIORITY_META[task.priority].label}
                </span>
              </Row>
            </div>

            {/* Description */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Description</h3>
              {task.description ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap break-words">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-neutral-400">No description added.</p>
              )}
            </section>

            {/* Subtasks */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                  <ListChecks className="w-4 h-4 text-neutral-400" /> Subtasks
                </h3>
                {subs.length > 0 && (
                  <span className="text-xs font-mono text-neutral-500">
                    {subDone}/{subs.length} done
                  </span>
                )}
              </div>
              {subs.length > 0 ? (
                <>
                  <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                    <div style={{ width: `${subPct}%` }} className="h-full rounded-full bg-emerald-500 transition-all" />
                  </div>
                  <ul className="space-y-1.5">
                    {subs.map((s) => (
                      <li
                        key={s._id}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 bg-neutral-50 dark:bg-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={s.done}
                          disabled={!writable}
                          onChange={(e) =>
                            m.toggleSubtask.mutate({ taskId: task._id, subId: s._id, done: e.target.checked })
                          }
                          aria-label={`Mark "${s.title}" done`}
                          className="w-4 h-4 accent-violet-600 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span
                          className={cn(
                            "flex-1 text-sm text-neutral-800 dark:text-neutral-100",
                            s.done && "line-through text-neutral-400",
                          )}
                        >
                          {s.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-neutral-400">No subtasks.</p>
              )}
            </section>

            <p className="text-xs text-neutral-400">Created {new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        {/* Footer */}
        {task && writable && (
          <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-900 shrink-0">
            <button
              disabled={m.update.isPending}
              onClick={() =>
                m.update.mutate({ taskId: task._id, patch: { status: done ? "not-started" : "completed" } })
              }
              className={cn(
                "w-full h-10 rounded-lg inline-flex items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer disabled:opacity-50",
                done
                  ? "border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5"
                  : "text-white bg-emerald-600 hover:bg-emerald-700",
              )}
            >
              {done ? <Circle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {done ? "Reopen task" : "Mark as complete"}
            </button>
          </div>
        )}
      </aside>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this task?"
        message={`"${task?.title ?? "This task"}" and its subtasks will be removed from the project.`}
        confirmLabel="Delete task"
        busy={m.remove.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          task &&
          m.remove.mutate(task._id, {
            onSuccess: () => {
              setConfirmDelete(false);
              onClose();
            },
          })
        }
      />
    </>
  );
};