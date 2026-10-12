import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  Circle,
  LayoutGrid,
  ListChecks,
  ListTodo,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { EmptyBlock, fieldClass } from "../../Library/components/LibraryBits";
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
const ALL = "__all__"; // radio items need a non-empty value, so "no filter" uses this

type Layout = "table" | "cards";
type SortKey = "default" | "due" | "priority" | "title";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Default order" },
  { value: "due", label: "Due date (soonest)" },
  { value: "priority", label: "Priority (highest first)" },
  { value: "title", label: "Title (A–Z)" },
];

const PRIORITY_RANK: Record<string, number> = { urgent: -1, high: 0, medium: 1, low: 2 };

const iconBtn =
  "relative inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500";

interface Props {
  projectId: string;
  color: ProjectColor;
  members: Member[];
  writable: boolean;
  onOpenTask: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

const dueShort = (task: Task, done: boolean) => {
  const due = dueInfo(task.dueDate, done);
  return { due, text: task.dueDate ? due.label.split(" ·")[0].replace("Due ", "") : "—" };
};

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
  const { due, text: dueText } = dueShort(task, done);
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
            "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold",
            PRIORITY_META[task.priority].chip,
          )}
        >
          {PRIORITY_META[task.priority].label}
        </span>
        {task.dueDate && (
          <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", TONE_TEXT[due.tone])}>
            <CalendarDays className="w-3 h-3" />
            {due.tone === "overdue" || due.tone === "soon" ? due.label : dueText}
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

const HEAD = "px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap";

/* ── Board ── */
export const TaskBoard = ({ projectId, color, members, writable, onOpenTask, onAddTask }: Props) => {
  const { data: tasks, isLoading, isError, refetch } = useTasks(projectId);
  const { update } = useTaskMutations(projectId);

  const [layout, setLayout] = useState<Layout>("table");
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [sort, setSort] = useState<SortKey>("default");
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const list = (tasks ?? []).filter(
      (t) =>
        (!needle || t.title.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle)) &&
        (!priority || t.priority === priority) &&
        (!statusFilter || t.status === statusFilter) &&
        (!assignee || (assignee === "none" ? !t.assignedTo : t.assignedTo?._id === assignee)),
    );
    if (sort === "default") return list;
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "priority") return (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
      // due: tasks without a date go last
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    });
  }, [tasks, search, assignee, priority, statusFilter, sort]);

  const move = (taskId: string, status: TaskStatus) => {
    const t = tasks?.find((x) => x._id === taskId);
    if (!t || t.status === status || !writable) return;
    update.mutate({ taskId, patch: { status } });
  };
  const toggle = (t: Task) =>
    update.mutate({ taskId: t._id, patch: { status: t.status === "completed" ? "not-started" : "completed" } });

  const activeFilters = [assignee, priority, statusFilter].filter(Boolean).length;
  const filtersActive = !!(search || activeFilters);
  const clearFilters = () => {
    setSearch("");
    setAssignee("");
    setPriority("");
    setStatusFilter("");
  };

  if (isLoading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70" />
        <div className="h-64 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/70" />
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

  return (
    <div className="space-y-4">
      {/* Toolbar: layout, search, filter, sort */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex rounded-xl bg-neutral-100 dark:bg-white/5 p-1" role="group" aria-label="Task layout">
          {(
            [
              ["table", Table2, "Table"],
              ["cards", LayoutGrid, "Cards"],
            ] as const
          ).map(([k, Icon, label]) => (
            <button
              key={k}
              aria-pressed={layout === k}
              aria-label={`${label} view`}
              onClick={() => setLayout(k)}
              className={cn(
                "h-8 px-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 transition cursor-pointer",
                layout === k
                  ? "bg-white dark:bg-[#1c1c1c] text-violet-700 dark:text-violet-300 shadow-sm"
                  : "text-neutral-500",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[150px] max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            aria-label="Search tasks"
            className={cn(fieldClass, "h-10 pl-9 pr-9")}
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={iconBtn} aria-label="Filter tasks">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilters > 0 && (
                  <span className="min-w-5 h-5 px-1 rounded-full bg-violet-600 text-white text-[11px] font-semibold flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={statusFilter || ALL}
                    onValueChange={(v) => setStatusFilter(v === ALL ? "" : (v as TaskStatus))}
                  >
                    <DropdownMenuRadioItem value={ALL}>Any status</DropdownMenuRadioItem>
                    {COLUMNS.map((s) => (
                      <DropdownMenuRadioItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Assignee</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
                  <DropdownMenuRadioGroup value={assignee || ALL} onValueChange={(v) => setAssignee(v === ALL ? "" : v)}>
                    <DropdownMenuRadioItem value={ALL}>Everyone</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="none">Unassigned</DropdownMenuRadioItem>
                    {members.map((m) => (
                      <DropdownMenuRadioItem key={m._id} value={m._id}>
                        {m.isMe ? `${m.name} (you)` : m.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={priority || ALL}
                    onValueChange={(v) => setPriority(v === ALL ? "" : (v as TaskPriority))}
                  >
                    <DropdownMenuRadioItem value={ALL}>Any priority</DropdownMenuRadioItem>
                    {(Object.keys(PRIORITY_META) as TaskPriority[]).map((p) => (
                      <DropdownMenuRadioItem key={p} value={p}>
                        {PRIORITY_META[p].label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {filtersActive && (
                <>
                  <DropdownMenuSeparator />
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Clear filters
                  </button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={iconBtn} aria-label="Sort tasks">
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Sort</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                {SORT_OPTIONS.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={o.value}>
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
      ) : filtered.length === 0 ? (
        <EmptyBlock
          icon={<Search className="w-5 h-5" />}
          title="No tasks match these filters"
          action={
            <button onClick={clearFilters} className="text-sm font-medium text-violet-600 hover:underline cursor-pointer">
              Clear filters
            </button>
          }
        />
      ) : layout === "cards" ? (
        /* ── Card (board) layout ── */
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
                  "rounded-2xl p-3 space-y-3 transition-colors",
                  "bg-neutral-100/70 dark:bg-white/[0.04]",
                  overCol === col && "bg-violet-100/80 dark:bg-violet-500/10 ring-2 ring-violet-400/60",
                )}
              >
                <header className="flex items-center justify-between px-1">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    <span className={cn("w-2 h-2 rounded-full", STATUS_META[col].dot)} />
                    {STATUS_META[col].column}
                    <span className="rounded-full min-w-5 px-1.5 text-center text-[11px] font-mono bg-white dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                      {items.length}
                    </span>
                  </h3>
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
                  <div
                    className={cn(
                      "rounded-xl border border-dashed px-3 py-6 text-center text-xs transition-colors",
                      overCol === col
                        ? "border-violet-400 text-violet-600 dark:text-violet-300"
                        : "border-neutral-300 dark:border-neutral-700 text-neutral-400",
                    )}
                  >
                    {writable ? "Drag a task here" : "No tasks"}
                  </div>
                )}

                {writable && (
                  <button
                    onClick={() => onAddTask(col)}
                    className="w-full h-9 rounded-lg inline-flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-white dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add task
                  </button>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* ── Table layout ── */
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th scope="col" className={cn(HEAD, "pl-4 w-10")}>
                    <span className="sr-only">Done</span>
                  </th>
                  <th scope="col" className={HEAD}>Task</th>
                  <th scope="col" className={HEAD}>Priority</th>
                  <th scope="col" className={HEAD}>Due</th>
                  <th scope="col" className={HEAD}>Assignee</th>
                  <th scope="col" className={cn(HEAD, "pr-4")}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const done = t.status === "completed";
                  const { due, text: dueText } = dueShort(t, done);
                  const subDone = t.subtasks.filter((s) => s.done).length;
                  return (
                    <tr
                      key={t._id}
                      tabIndex={0}
                      onClick={() => onOpenTask(t._id)}
                      onKeyDown={(e) => {
                        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onOpenTask(t._id);
                        }
                      }}
                      className="cursor-pointer border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 transition-colors"
                    >
                      <td className="pl-4 pr-1 py-3 align-middle">
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
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <p
                          className={cn(
                            "font-semibold text-neutral-900 dark:text-white max-w-[360px] truncate",
                            done && "line-through text-neutral-400 dark:text-neutral-500",
                          )}
                        >
                          {t.title}
                        </p>
                        {t.subtasks.length > 0 && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-neutral-500">
                            <ListChecks className="w-3 h-3" /> {subDone}/{t.subtasks.length} subtasks
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold",
                            PRIORITY_META[t.priority].chip,
                          )}
                        >
                          {PRIORITY_META[t.priority].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle whitespace-nowrap">
                        <span className={cn("text-xs font-medium", t.dueDate ? TONE_TEXT[due.tone] : "text-neutral-400")}>
                          {dueText}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {t.assignedTo ? (
                          <span className="inline-flex items-center gap-2 min-w-0">
                            <Avatar person={t.assignedTo} size={24} />
                            <span className="text-xs text-neutral-600 dark:text-neutral-300 truncate max-w-[120px]">
                              {t.assignedTo.name}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 pr-4 align-middle">
                        <select
                          value={t.status}
                          disabled={!writable}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {writable && (
            <button
              onClick={() => onAddTask("not-started")}
              className="w-full h-11 inline-flex items-center justify-center gap-1.5 border-t border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-500 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add task
            </button>
          )}
        </div>
      )}
    </div>
  );
};