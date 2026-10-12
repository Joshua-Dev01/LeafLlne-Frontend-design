import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  Copy,
  Globe2,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  UserPlus,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { EmptyBlock, GhostButton, PrimaryButton } from "../../Library/components/LibraryBits";
import {
  useFiles,
  useProject,
  useProjectMutations,
  useTasks,
} from "../api/useProject";
import { Avatar, ConfirmDialog, ProgressBar, ProjectIcon, StatusChip } from "../components/Bits";
import { ProjectFormModal } from "../components/ProjectFormModal";
import type { TaskStats, TaskStatus } from "../interface/ProjectType";
import { COLOR_STYLES, TONE_TEXT, dueInfo, fmtDate } from "../utils/projectTheme";
import { ActivityRow, ActivityTab, DiscussionTab, FilesTab } from "./EngageTabs";
import { InviteModal, PeoplePanel } from "./PeoplePanel";
import { TaskBoard } from "./TaskBoard";
import { TaskModal } from "./TaskModal";
import { useActivity } from "../api/useProject";

type Tab = "tasks" | "overview" | "files" | "discussion" | "activity";

const statsFrom = (tasks: { status: TaskStatus; dueDate: string | null }[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter(
    (t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate).getTime() < Date.now(),
  ).length;
  return {
    total,
    completed,
    inProgress,
    notStarted: total - completed - inProgress,
    overdue,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
};

const ProjectDetailPage = () => {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProject(projectId);
  const { data: tasks } = useTasks(projectId);
  const { data: files } = useFiles(projectId);
  const { data: recent } = useActivity(projectId, 1);
  const { archive, restore, duplicate, remove } = useProjectMutations();

  const [tab, setTab] = useState<Tab>("tasks");
  const [taskModal, setTaskModal] = useState<{ open: boolean; taskId: string | null; status: TaskStatus }>({
    open: false,
    taskId: null,
    status: "not-started",
  });
  const [editing, setEditing] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const project = data?.project;
  // Progress follows the task list the moment you change a task.
  const stats = useMemo(
    () => (tasks && project ? statsFrom(tasks) : (project?.stats ?? statsFrom([]))),
    [tasks, project],
  );

  if (isLoading)
    return (
      <div className="max-w-[1400px] mx-auto space-y-5 animate-pulse">
        <div className="h-5 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-44 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/70" />
        <div className="h-72 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/70" />
      </div>
    );

  if (isError || !project)
    return (
      <div className="max-w-xl mx-auto pt-10">
        <EmptyBlock
          icon={<Lock className="w-5 h-5" />}
          title="Project not found"
          text="It may have been deleted, or you don't have access to it."
          action={
            <PrimaryButton onClick={() => navigate("/dashboard/projects")}>
              <ArrowLeft className="w-4 h-4" /> Back to projects
            </PrimaryButton>
          }
        />
      </div>
    );

  const isOwner = project.role === "owner";
  const writable = !project.archived;
  const completed = stats.total > 0 && stats.completed === stats.total;
  const status: TaskStatus = completed
    ? "completed"
    : stats.completed > 0 || stats.inProgress > 0
      ? "in-progress"
      : "not-started";
  const due = dueInfo(project.deadline, completed);
  const c = COLOR_STYLES[project.color];

  const openTask = (id: string) => setTaskModal({ open: true, taskId: id, status: "not-started" });
  const addTask = (s: TaskStatus = "not-started") => setTaskModal({ open: true, taskId: null, status: s });

  const tabs: { key: Tab; label: string }[] = [
    { key: "tasks", label: `Tasks (${stats.completed}/${stats.total})` },
    { key: "overview", label: "Overview" },
    { key: "files", label: `Files${files ? ` (${files.length})` : ""}` },
    { key: "discussion", label: "Discussion" },
    { key: "activity", label: "Activity" },
  ];

  const menuItem =
    "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer";

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 pb-10">
      {/* Breadcrumb + actions */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-neutral-500 min-w-0">
            <Link to="/dashboard/projects" className="hover:text-violet-600 dark:hover:text-violet-300 shrink-0">
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="shrink-0">{project.category}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-neutral-900 dark:text-white truncate">{project.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={status} />
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 dark:bg-white/10",
                TONE_TEXT[due.tone],
              )}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              {project.deadline ? due.label : "No deadline"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
              {project.visibility === "team" ? <Globe2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {project.visibility === "team" ? "Team project" : "Private"}
            </span>
            {project.archived && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <Archive className="w-3.5 h-3.5" /> Archived
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && writable && project.visibility === "team" && (
            <GhostButton onClick={() => setInviting(true)}>
              <UserPlus className="w-4 h-4" /> Invite
            </GhostButton>
          )}
          {writable && (
            <PrimaryButton onClick={() => addTask()} className="shadow-lg shadow-violet-500/20">
              <Plus className="w-4 h-4" /> Add task
            </PrimaryButton>
          )}
          <div className="relative" ref={menuRef}>
            <button
              aria-label="Project actions"
              aria-haspopup="menu"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menu && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 z-30 rounded-xl py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 shadow-xl"
              >
                {isOwner && writable && (
                  <button role="menuitem" className={menuItem} onClick={() => { setMenu(false); setEditing(true); }}>
                    <Pencil className="w-4 h-4" /> Edit project
                  </button>
                )}
                {isOwner && (
                  <button
                    role="menuitem"
                    className={menuItem}
                    onClick={() => {
                      setMenu(false);
                      duplicate.mutate(projectId, { onSuccess: (r) => navigate(`/dashboard/projects/${r.project._id}`) });
                    }}
                  >
                    <Copy className="w-4 h-4" /> Duplicate
                  </button>
                )}
                {isOwner &&
                  (project.archived ? (
                    <button role="menuitem" className={menuItem} onClick={() => { setMenu(false); restore.mutate(projectId); }}>
                      <RotateCcw className="w-4 h-4" /> Restore
                    </button>
                  ) : (
                    <button role="menuitem" className={menuItem} onClick={() => { setMenu(false); archive.mutate(projectId); }}>
                      <Archive className="w-4 h-4" /> Archive
                    </button>
                  ))}
                {isOwner && (
                  <button
                    role="menuitem"
                    className={cn(menuItem, "text-rose-600 dark:text-rose-400")}
                    onClick={() => { setMenu(false); setConfirmDelete(true); }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete project
                  </button>
                )}
                {!isOwner && (
                  <p className="px-3 py-2 text-xs text-neutral-500">Use the Team panel to leave this project.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {project.archived && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/60 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <span>This project is archived and read-only.</span>
          {isOwner && (
            <button
              onClick={() => restore.mutate(projectId)}
              disabled={restore.isPending}
              className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" /> Restore it
            </button>
          )}
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111]">
        <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", c.grad)} />
        <div className={cn("absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br", c.grad)} />
        <div className="relative grid lg:grid-cols-[1fr_340px] gap-6 p-5 sm:p-7">
          <div className="space-y-4 min-w-0">
            <div className="flex items-start gap-4">
              <ProjectIcon icon={project.icon} color={project.color} size={56} />
              <div className="min-w-0">
                <p className={cn("text-[11px] font-bold uppercase tracking-widest", c.text)}>{project.category}</p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white break-words">
                  {project.title}
                </h1>
              </div>
            </div>
            {project.description && (
              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap max-w-3xl">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {project.members.slice(0, 6).map((m) => (
                  <Avatar key={m._id} person={m} size={32} ring />
                ))}
              </div>
              {isOwner && writable && project.visibility === "team" && (
                <button
                  onClick={() => setInviting(true)}
                  className={cn("inline-flex items-center gap-1.5 text-sm font-semibold hover:underline cursor-pointer", c.text)}
                >
                  <UserPlus className="w-4 h-4" /> Invite classmate
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 space-y-3 self-start">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Progress</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {stats.percent}% <span className="text-base font-semibold text-neutral-400">done</span>
                </p>
              </div>
              <span className={cn("rounded-lg px-2.5 py-1 text-xs font-bold font-mono", c.soft)}>
                {stats.completed}/{stats.total} tasks
              </span>
            </div>
            <ProgressBar percent={stats.percent} color={project.color} height={10} label="Project progress" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500" /> {stats.total - stats.completed} active
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {stats.completed} closed
              </span>
              {stats.overdue > 0 && (
                <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> {stats.overdue} overdue
                </span>
              )}
              {project.deadline && <span className="ml-auto font-mono">Target: {fmtDate(project.deadline)}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative px-4 h-11 text-sm font-medium whitespace-nowrap transition cursor-pointer",
              tab === t.key
                ? "text-violet-700 dark:text-violet-300"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white",
            )}
          >
            {t.label}
            {tab === t.key && (
              <span className={cn("absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r", c.grad)} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "tasks" && (
        <div className="grid xl:grid-cols-[1fr_320px] gap-5 items-start">
          <TaskBoard
            projectId={projectId}
            color={project.color}
            members={project.members}
            writable={writable}
            onOpenTask={openTask}
            onAddTask={addTask}
          />
          <div className="space-y-5">
            <PeoplePanel
              project={project}
              pending={data.pendingInvitations}
              onInvite={() => setInviting(true)}
              onLeft={() => navigate("/dashboard/projects")}
            />
            <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Recent activity</h3>
                <button onClick={() => setTab("activity")} className="text-xs font-medium text-violet-600 dark:text-violet-300 hover:underline cursor-pointer">
                  View all
                </button>
              </div>
              {recent?.activity.length ? (
                <ul className="space-y-3">
                  {recent.activity.slice(0, 5).map((a) => (
                    <ActivityRow key={a._id} a={a} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400">Nothing yet.</p>
              )}
            </section>
          </div>
        </div>
      )}

      {tab === "overview" && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          <div className="space-y-5">
            <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-5 grid sm:grid-cols-2 gap-5">
              {[
                ["Category", project.category],
                ["Visibility", project.visibility === "team" ? "Team project" : "Private"],
                ["Start date", project.startDate ? fmtDate(project.startDate, "MMM d, yyyy") : "Not set"],
                ["Deadline", project.deadline ? fmtDate(project.deadline, "MMM d, yyyy") : "Not set"],
                ["Owner", project.owner?.name ?? "—"],
                ["Created", fmtDate(project.createdAt, "MMM d, yyyy")],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">{k}</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">{v}</p>
                </div>
              ))}
            </section>
            <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-5">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Task breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["Not started", stats.notStarted, "text-neutral-700 dark:text-neutral-200", "bg-neutral-100 dark:bg-white/5"],
                  ["In progress", stats.inProgress, "text-violet-700 dark:text-violet-300", "bg-violet-50 dark:bg-violet-500/10"],
                  ["Completed", stats.completed, "text-emerald-700 dark:text-emerald-300", "bg-emerald-50 dark:bg-emerald-500/10"],
                  ["Overdue", stats.overdue, "text-rose-700 dark:text-rose-300", "bg-rose-50 dark:bg-rose-500/10"],
                ].map(([label, n, text, bg]) => (
                  <div key={label as string} className={cn("rounded-xl p-4", bg as string)}>
                    <p className={cn("text-3xl font-bold", text as string)}>{n}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <PeoplePanel
            project={project}
            pending={data.pendingInvitations}
            onInvite={() => setInviting(true)}
            onLeft={() => navigate("/dashboard/projects")}
          />
        </div>
      )}

      {tab === "files" && <FilesTab projectId={projectId} writable={writable} />}
      {tab === "discussion" && <DiscussionTab projectId={projectId} writable={writable} />}
      {tab === "activity" && <ActivityTab projectId={projectId} />}

      {/* Modals */}
      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal((s) => ({ ...s, open: false }))}
        projectId={projectId}
        members={project.members}
        taskId={taskModal.taskId}
        defaultStatus={taskModal.status}
      />
      <ProjectFormModal open={editing} onClose={() => setEditing(false)} project={project} />
      <InviteModal open={inviting} onClose={() => setInviting(false)} project={project} pending={data.pendingInvitations} />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this project?"
        message={`"${project.title}" and all of its tasks, files and discussion will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete project"
        busy={remove.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          remove.mutate(projectId, { onSuccess: () => navigate("/dashboard/projects", { replace: true }) })
        }
      />
    </div>
  );
};

export default ProjectDetailPage;
