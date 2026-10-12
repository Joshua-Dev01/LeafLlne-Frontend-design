import { useState } from "react";
import { Check, Crown, Loader2, LogOut, Search, UserMinus, UserPlus, X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  CloseButton,
  ModalShell,
  fieldClass,
} from "../../Library/components/LibraryBits";
import { useDebounced } from "../../Library/hooks/libraryHooks";
import { useMemberMutations, useUserSearch } from "../api/useProject";
import { Avatar, ConfirmDialog } from "../components/Bits";
import type { Member, PendingInvitation, Project } from "../interface/ProjectType";

/* ── Invite modal ── */
export const InviteModal = ({
  open,
  onClose,
  project,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  project: Project;
  pending: PendingInvitation[];
}) => {
  const [text, setText] = useState("");
  const q = useDebounced(text.trim(), 300);
  const { data: users, isFetching } = useUserSearch(q);
  const { invite } = useMemberMutations(project._id);

  const memberIds = new Set(project.members.map((m) => m._id));
  const pendingIds = new Set(pending.map((p) => p.invitee?._id));

  return (
    <ModalShell open={open} onClose={onClose} className="sm:max-w-md">
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Invite classmates</h2>
          <p className="text-sm text-neutral-500">Search by name, or type someone's exact email.</p>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="px-5 pb-5 space-y-3 overflow-y-auto">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Search LeafLine users…"
            aria-label="Search users"
            className={cn(fieldClass, "pl-10")}
          />
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />}
        </div>

        <ul className="space-y-1.5 min-h-[80px]">
          {q.length < 2 ? (
            <li className="text-center text-sm text-neutral-400 py-6">Type at least 2 characters to search.</li>
          ) : users && users.length === 0 && !isFetching ? (
            <li className="text-center text-sm text-neutral-400 py-6">No LeafLine users found.</li>
          ) : (
            users?.map((u) => {
              const isMember = memberIds.has(u._id);
              const isPending = pendingIds.has(u._id);
              const busy = invite.isPending && invite.variables === u._id;
              return (
                <li
                  key={u._id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-neutral-50 dark:bg-white/5"
                >
                  <Avatar person={u} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{u.emailHint}</p>
                  </div>
                  {isMember || isPending ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> {isMember ? "On project" : "Invited"}
                    </span>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => invite.mutate(u._id)}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white bg-[#4b0082] hover:bg-[#5d1a8e] dark:bg-[#9d4edd] disabled:opacity-50 cursor-pointer"
                    >
                      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                      Invite
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </ModalShell>
  );
};

/* ── Members panel ── */
export const PeoplePanel = ({
  project,
  pending,
  onInvite,
  onLeft,
}: {
  project: Project;
  pending: PendingInvitation[];
  onInvite: () => void;
  onLeft: () => void;
}) => {
  const isOwner = project.role === "owner";
  const { removeMember, cancelInvite } = useMemberMutations(project._id);
  const [target, setTarget] = useState<Member | null>(null);
  const writable = !project.archived;

  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Team <span className="text-neutral-400 font-normal">· {project.members.length}</span>
        </h3>
        {isOwner && writable && (
          <button
            onClick={onInvite}
            disabled={project.visibility !== "team"}
            title={project.visibility !== "team" ? "Make this a team project to invite people" : undefined}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/15 hover:bg-violet-200 dark:hover:bg-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> Invite
          </button>
        )}
      </div>

      {isOwner && project.visibility !== "team" && (
        <p className="text-xs text-neutral-500 rounded-lg bg-neutral-50 dark:bg-white/5 px-3 py-2">
          This is a private project. Edit it and choose “Team” to invite classmates.
        </p>
      )}

      <ul className="space-y-1">
        {project.members.map((m) => (
          <li key={m._id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-neutral-50 dark:hover:bg-white/5">
            <Avatar person={m} size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {m.name}
                {m.isMe && <span className="text-neutral-400 font-normal"> (you)</span>}
              </p>
              <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                {m.role === "owner" ? (
                  <>
                    <Crown className="w-3 h-3 text-amber-500" /> Owner
                  </>
                ) : (
                  "Member"
                )}
              </p>
            </div>
            {writable && m.role === "member" && (isOwner || m.isMe) && (
              <button
                aria-label={m.isMe ? "Leave project" : `Remove ${m.name}`}
                title={m.isMe ? "Leave project" : "Remove from project"}
                onClick={() => setTarget(m)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                {m.isMe ? <LogOut className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
              </button>
            )}
          </li>
        ))}
      </ul>

      {pending.length > 0 && (
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-2">Pending invitations</p>
          {pending.map((p) => (
            <div key={p._id} className="flex items-center gap-3 px-2 py-1.5">
              <Avatar person={p.invitee} size={28} className="opacity-60" />
              <span className="flex-1 text-sm text-neutral-600 dark:text-neutral-300 truncate">
                {p.invitee?.name ?? "Unknown user"}
              </span>
              <button
                aria-label="Cancel invitation"
                disabled={cancelInvite.isPending}
                onClick={() => cancelInvite.mutate(p._id)}
                className="text-neutral-400 hover:text-rose-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
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
    </section>
  );
};
