import { useMemo, useState } from "react";
import { Crown, LogOut, Search, UserMinus, UserPlus, X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { useMemberMutations, useTasks } from "../api/useProject";
import { Avatar, ConfirmDialog } from "../components/Bits";
import type { Member, PendingInvitation, Project } from "../interface/ProjectType";

const HEAD = "px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap";
const CELL = "px-4 py-3.5 align-middle";

interface Props {
  project: Project;
  pending: PendingInvitation[];
  onInvite: () => void;
  onLeft: () => void;
}

export const TeamTable = ({ project, pending, onInvite, onLeft }: Props) => {
  const isOwner = project.role === "owner";
  const writable = !project.archived;
  const isTeam = project.visibility === "team";

  const { removeMember, cancelInvite } = useMemberMutations(project._id);
  const { data: tasks } = useTasks(project._id);

  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<Member | null>(null);

  // Per-member workload, worked out from the task list
  const workload = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, { assigned: number; done: number; overdue: number }>();
    for (const t of tasks ?? []) {
      const id = t.assignedTo?._id;
      if (!id) continue;
      const row = map.get(id) ?? { assigned: 0, done: 0, overdue: 0 };
      row.assigned += 1;
      if (t.status === "completed") row.done += 1;
      else if (t.dueDate && new Date(t.dueDate).getTime() < now) row.overdue += 1;
      map.set(id, row);
    }
    return map;
  }, [tasks]);

  const unassigned = useMemo(() => (tasks ?? []).filter((t) => !t.assignedTo).length, [tasks]);

  const members = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return project.members.filter((m) => !needle || m.name.toLowerCase().includes(needle));
  }, [project.members, search]);

  const canInvite = isOwner && writable;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[160px] max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            aria-label="Search members"
            className="w-full h-10 pl-9 pr-9 rounded-xl text-sm bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
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

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-neutral-500">
            {project.members.length} {project.members.length === 1 ? "member" : "members"}
            {pending.length > 0 && ` · ${pending.length} pending`}
            {unassigned > 0 && ` · ${unassigned} unassigned ${unassigned === 1 ? "task" : "tasks"}`}
          </span>
          {canInvite && (
            <button
              onClick={onInvite}
              disabled={!isTeam}
              title={!isTeam ? "Make this a team project to invite people" : undefined}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-violet-500/20"
            >
              <UserPlus className="w-4 h-4" /> Invite
            </button>
          )}
        </div>
      </div>

      {isOwner && !isTeam && (
        <p className="text-sm text-neutral-500 rounded-xl bg-neutral-100 dark:bg-white/5 px-4 py-3">
          This is a private project. Edit it and choose “Team” to invite classmates.
        </p>
      )}

      {/* Members */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th scope="col" className={cn(HEAD, "pl-5")}>Member</th>
                <th scope="col" className={HEAD}>Role</th>
                <th scope="col" className={HEAD}>Assigned</th>
                <th scope="col" className={HEAD}>Completed</th>
                <th scope="col" className={HEAD}>Overdue</th>
                <th scope="col" className={cn(HEAD, "pr-5 text-right")}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">
                    No members match “{search}”.
                  </td>
                </tr>
              )}
              {members.map((m) => {
                const w = workload.get(m._id) ?? { assigned: 0, done: 0, overdue: 0 };
                const pct = w.assigned ? Math.round((w.done / w.assigned) * 100) : 0;
                const canAct = writable && m.role === "member" && (isOwner || m.isMe);
                return (
                  <tr
                    key={m._id}
                    className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <td className={cn(CELL, "pl-5")}>
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar person={m} size={36} />
                        <p className="font-semibold text-neutral-900 dark:text-white truncate max-w-[220px]">
                          {m.name}
                          {m.isMe && <span className="text-neutral-400 font-normal"> (you)</span>}
                        </p>
                      </div>
                    </td>
                    <td className={CELL}>
                      {m.role === "owner" ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          <Crown className="w-3 h-3" /> Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                          Member
                        </span>
                      )}
                    </td>
                    <td className={cn(CELL, "text-neutral-700 dark:text-neutral-200 font-medium")}>
                      {w.assigned}
                      <span className="text-neutral-400 font-normal"> {w.assigned === 1 ? "task" : "tasks"}</span>
                    </td>
                    <td className={cn(CELL, "w-[200px]")}>
                      {w.assigned ? (
                        <div>
                          <div className="flex justify-between text-xs mb-1 text-neutral-500">
                            <span>
                              {w.done}/{w.assigned}
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                            <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-emerald-500 transition-all" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">No tasks yet</span>
                      )}
                    </td>
                    <td className={CELL}>
                      {w.overdue > 0 ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                          {w.overdue} overdue
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className={cn(CELL, "pr-5 text-right")}>
                      {canAct && (
                        <button
                          aria-label={m.isMe ? "Leave project" : `Remove ${m.name}`}
                          title={m.isMe ? "Leave project" : "Remove from project"}
                          onClick={() => setTarget(m)}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                        >
                          {m.isMe ? <LogOut className="w-3.5 h-3.5" /> : <UserMinus className="w-3.5 h-3.5" />}
                          {m.isMe ? "Leave" : "Remove"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invitations */}
      {pending.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Pending invitations <span className="text-neutral-400 font-normal">· {pending.length}</span>
          </h3>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th scope="col" className={cn(HEAD, "pl-5")}>Invitee</th>
                    <th scope="col" className={HEAD}>Status</th>
                    <th scope="col" className={cn(HEAD, "pr-5 text-right")}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      <td className={cn(CELL, "pl-5")}>
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar person={p.invitee} size={32} className="opacity-60" />
                          <span className="text-neutral-700 dark:text-neutral-200 truncate max-w-[260px]">
                            {p.invitee?.name ?? "Unknown user"}
                          </span>
                        </div>
                      </td>
                      <td className={CELL}>
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          Awaiting reply
                        </span>
                      </td>
                      <td className={cn(CELL, "pr-5 text-right")}>
                        {isOwner && writable && (
                          <button
                            aria-label="Cancel invitation"
                            disabled={cancelInvite.isPending}
                            onClick={() => cancelInvite.mutate(p._id)}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-50 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={!!target}
        title={target?.isMe ? "Leave this project?" : `Remove ${target?.name}?`}
        message={
          target?.isMe
            ? "You'll lose access to its tasks, files and discussion. Tasks assigned to you become unassigned."
            : "They'll lose access to this project, and their tasks become unassigned."
        }
        confirmLabel={target?.isMe ? "Leave project" : "Remove member"}
        busy={removeMember.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() =>
          target &&
          removeMember.mutate(target._id, {
            onSuccess: () => {
              const left = target.isMe;
              setTarget(null);
              if (left) onLeft();
            },
          })
        }
      />
    </div>
  );
};