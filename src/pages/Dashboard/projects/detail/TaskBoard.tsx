import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  KanbanSquare,
  ListChecks,
  ListTodo,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { EmptyBlock, FilterSelect, fieldClass } from "../../Library/components/LibraryBits";
import { useTaskMutations, useTasks } from "../api/useProject";
import { Avatar } from "../components/Bits";
import type { Member, Task, TaskPriority, TaskStatus } from "../interface/ProjectType";
import {
  COLOR_STYLES,
  PRIORITY_META,
  STATUS_META,
  TONE_TEXT,
  dueInfo,
} from "../utils/projectTheme";
import type { ProjectColor } from "../interface/ProjectType";

const COLUMNS: TaskStatus[] = ["not-started", "in-progress", "completed"];

interface Props {
  projectId: string;
  color: ProjectColor;
  members: Member[];
  writable: boolean;
  onOpenTask: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

/* ── One card ── */
const TaskCard = ({
  task,
  writable,
  onOpen,
  onToggle,
  color,
}: {
  task: Task;
  writable: boolean;
  onOpen: () => void;
  onToggle: () => void;
  color: ProjectColor;
}) => {
  const done = task.status === "completed";
  const due = dueInfo(task.dueDate, done);
  const subDone = task.subtasks.filter((s) => s.done).length;
  const subPct = task.subtasks.length ? Math.round((subDone / task.subtasks.length) * 100) : 0;

  return (
    <article
      draggable={writable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task._id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onOpen}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className={cn(
        "group rounded-xl border p-3.5 space-y-2.5 bg-white dark:bg-[#171717] transition-all",
        "border-neutral-200 dark:border-neutral-800 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        writable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            PRIORITY_META[task.priority].chip,
          )}
        >
          {PRIORITY_META[task.priority].label}
        </span>
        {task.dueDate && (
          <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", TONE_TEXT[due.tone])}>
            <CalendarDays className="w-3 h-3" />
            {due.tone === "overdue" || due.tone === "soon" ? due.label : due.label.split(" ·")[0].replace("Due ", "")}
          </span>
        )}
      </div>

      <div className="flex items-start gap-2">
        <button
          type="button"
          disabled={!writable}
          aria-label={done ? "Mark as not done" : "Mark as complete"}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="mt-0.5 shrink-0 text-neutral-300 hover:text-emerald-500 disabled:cursor-not-allowed cursor-pointer"
        >
          {done ? <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500" /> : <Circle className="w-[18px] h-[18px]" />}
        </button>
        <h4
          className={cn(
            "text-sm font-semibold leading-snug text-neutral-900 dark:text-white",
            done && "line-through text-neutral-400 dark:text-neutral-500",
          )}
        >
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 pl-[26px]">{task.description}</p>
      )}

      {task.subtasks.length > 0 && (
        <div className="pl-[26px] space-y-1">
          <div className="flex justify-between text-[11px] text-neutral-500">
            <span>Subtasks</span>
            <span className="font-semibold">
              {subDone}/{task.subtasks.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
            <div
              style={{ width: `${subPct}%` }}
              className={cn("h-full rounded-full bg-gradient-to-r transition-all", COLOR_STYLES[color].bar)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pl-[26px]">
        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
          {task.subtasks.length > 0 && (
            <>
              <ListChecks className="w-3 h-3" /> {task.subtasks.length}
            </>
          )}
        </span>
        {task.assignedTo ? (
          <Avatar person={task.assignedTo} size={22} />
        ) : (
          <span className="text-[11px] text-neutral-400">Unassigned</span>
        )}
      </div>
    </article>
  );
};

/* ── Board ── */
export const TaskBoard = ({ projectId, color, members, writable, onOpenTask, onAddTask }: Props) => {
  const { data: tasks, isLoading, isError, refetch } = useTasks(projectId);
  const { update } = useTaskMutations(projectId);

  const [layout, setLayout] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (tasks ?? []).filter(
      (t) =>
        (!needle || t.title.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle)) &&
        (!priority || t.priority === priority) &&
        (!assignee || (assignee === "none" ? !t.assignedTo : t.assignedTo?._id === assignee)),
    );
  }, [tasks, search, assignee, priority]);

  const move = (taskId: string, status: TaskStatus) => {
    const t = tasks?.find((x) => x._id === taskId);
    if (!t || t.status === status || !writable) return;
    update.mutate({ taskId, patch: { status } });
  };
  const toggle = (t: Task) =>
    update.mutate({ taskId: t._id, patch: { status: t.status === "completed" ? "not-started" : "completed" } });

  if (isLoading)
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {COLUMNS.map((c) => (
          <div key={c} className="rounded-2xl bg-neutral-100/70 dark:bg-white/5 p-3 space-y-3 animate-pulse">
            <div className="h-5 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-24 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70" />
            <div className="h-24 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70" />
          </div>
        ))}
      </div>
    );

  if (isError)
    return (
      <EmptyBlock
        icon={<ListTodo className="w-5 h-5" />}
        title="Couldn't load tasks"
        action={
          <button onClick={() => refetch()} className="text-sm font-medium text-violet-600 hover:underline cursor-pointer">
            Try again
          </button>
        }
      />
    );

  const filtersActive = !!(search || assignee || priority);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-3">
        <div className="flex rounded-xl bg-neutral-100 dark:bg-white/5 p-1" role="group" aria-label="Task layout">
          {(
            [
              ["kanban", KanbanSquare, "Board"],
              ["list", ListTodo, "List"],
            ] as const
          ).map(([k, Icon, label]) => (
            <button
              key={k}
              aria-pressed={layout === k}
              onClick={() => setLayout(k)}
              className={cn(
                "h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 transition cursor-pointer",
                layout === k
                  ? "bg-white dark:bg-[#1c1c1c] text-violet-700 dark:text-violet-300 shadow-sm"
                  : "text-neutral-500",
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter tasks…"
            aria-label="Filter tasks"
            className={cn(fieldClass, "pl-9")}
          />
        </div>
        <FilterSelect
          label="Assignee"
          value={assignee}
          onChange={setAssignee}
          placeholder="Everyone"
          options={[
            { value: "none", label: "Unassigned" },
            ...members.map((m) => ({ value: m._id, label: m.isMe ? `${m.name} (you)` : m.name })),
          ]}
        />
        <FilterSelect
          label="Priority"
          value={priority}
          onChange={(v) => setPriority(v as TaskPriority | "")}
          placeholder="Any"
          options={(Object.keys(PRIORITY_META) as TaskPriority[]).map((p) => ({
            value: p,
            label: PRIORITY_META[p].label,
          }))}
        />
      </div>

      {(tasks ?? []).length === 0 ? (
        <EmptyBlock
          icon={<ListChecks className="w-5 h-5" />}
          title="No tasks yet"
          text={writable ? "Add your first task to start tracking progress." : "This project has no tasks."}
          action={
            writable && (
              <button
                onClick={() => onAddTask("not-started")}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-white bg-[#4b0082] hover:bg-[#5d1a8e] dark:bg-[#9d4edd] cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add task
              </button>
            )
          }
        />
      ) : filtered.length === 0 && filtersActive ? (
        <EmptyBlock icon={<Search className="w-5 h-5" />} title="No tasks match these filters" />
      ) : layout === "kanban" ? (
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {COLUMNS.map((col) => {
            const items = filtered.filter((t) => t.status === col);
            return (
              <section
                key={col}
                aria-label={STATUS_META[col].label}
                onDragOver={(e) => {
                  if (!writable) return;
                  e.preventDefault();
                  setOverCol(col);
                }}
                onDragLeave={() => setOverCol((c) => (c === col ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  setOverCol(null);
                  move(e.dataTransfer.getData("text/plain"), col);
                }}
                className={cn(
                  "rounded-2xl p-3 space-y-3 transition-colors min-h-[160px]",
                  "bg-neutral-100/70 dark:bg-white/[0.04]",
                  overCol === col && "bg-violet-100/80 dark:bg-violet-500/10 ring-2 ring-violet-400/60",
                )}
              >
                <header className="flex items-center justify-between px-1">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-neutral-100">
                    <span className={cn("w-2 h-2 rounded-full", STATUS_META[col].dot)} />
                    {STATUS_META[col].column}
                    <span className="rounded-full px-1.5 text-[11px] font-mono bg-white dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                      {items.length}
                    </span>
                  </h3>
                  {writable && (
                    <button
                      aria-label={`Add task to ${STATUS_META[col].column}`}
                      onClick={() => onAddTask(col)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-white dark:hover:bg-white/10 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </header>
                {items.map((t) => (
                  <TaskCard
                    key={t._id}
                    task={t}
                    color={color}
                    writable={writable}
                    onOpen={() => onOpenTask(t._id)}
                    onToggle={() => toggle(t)}
                  />
                ))}
                {items.length === 0 && (
                  <p className="text-center text-xs text-neutral-400 py-6">
                    {writable ? "Drop a task here" : "Nothing here"}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* List layout */
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] divide-y divide-neutral-100 dark:divide-neutral-900 overflow-hidden">
          {filtered.map((t) => {
            const done = t.status === "completed";
            const due = dueInfo(t.dueDate, done);
            const subDone = t.subtasks.filter((s) => s.done).length;
            return (
              <div
                key={t._id}
                onClick={() => onOpenTask(t._id)}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-white/[0.03] cursor-pointer"
              >
                <button
                  disabled={!writable}
                  aria-label={done ? "Mark as not done" : "Mark as complete"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(t);
                  }}
                  className="text-neutral-300 hover:text-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                >
                  {done ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                </button>
                <div className="flex-1 min-w-[180px]">
                  <p className={cn("text-sm font-semibold text-neutral-900 dark:text-white", done && "line-through text-neutral-400")}>
                    {t.title}
                  </p>
                  {t.subtasks.length > 0 && (
                    <p className="text-[11px] text-neutral-500">
                      {subDone}/{t.subtasks.length} subtasks
                    </p>
                  )}
                </div>
                <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", PRIORITY_META[t.priority].chip)}>
                  {PRIORITY_META[t.priority].label}
                </span>
                <span className={cn("text-xs font-medium w-32", TONE_TEXT[due.tone])}>
                  {t.dueDate ? due.label.split(" ·")[0] : "—"}
                </span>
                <span className="w-7">{t.assignedTo ? <Avatar person={t.assignedTo} size={24} /> : null}</span>
                <select
                  value={t.status}
                  disabled={!writable}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => move(t._id, e.target.value as TaskStatus)}
                  aria-label="Task status"
                  className={cn(
                    "h-8 rounded-lg px-2 text-xs font-semibold border-0 outline-none cursor-pointer disabled:cursor-not-allowed",
                    STATUS_META[t.status].chip,
                  )}
                >
                  {COLUMNS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
