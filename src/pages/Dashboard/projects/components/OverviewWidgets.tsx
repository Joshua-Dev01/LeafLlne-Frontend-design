import { Check, Folders, Loader2, Mail, Timer, X, Zap, BadgeCheck } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { useInvitationActions, useMyInvitations, useProjectSummary } from "../api/useProject";
import { fmtDate } from "../utils/projectTheme";
import { Avatar, ProjectIcon } from "./Bits";

/* ── Summary cards ── */
export const SummaryCards = () => {
  const { data, isLoading } = useProjectSummary();

  const cards = [
    {
      label: "Total projects",
      value: data?.total,
      note: data
        ? data.limit.max === null
          ? "Unlimited on your plan"
          : `${data.limit.used} of ${data.limit.max} owned · ${data.limit.plan} plan`
        : "",
      icon: Folders,
      grad: "from-violet-500 to-fuchsia-500",
      tint: "bg-violet-500/10",
    },
    {
      label: "In progress",
      value: data?.inProgress,
      note: data ? `${data.notStarted} not started yet` : "",
      icon: Zap,
      grad: "from-sky-500 to-indigo-500",
      tint: "bg-sky-500/10",
    },
    {
      label: "Completed",
      value: data?.completed,
      note: data ? (data.completed ? "Nicely done 🎉" : "Finish a task list to see it here") : "",
      icon: BadgeCheck,
      grad: "from-emerald-500 to-teal-400",
      tint: "bg-emerald-500/10",
    },
    {
      label: "Upcoming deadlines",
      value: data?.upcomingDeadlines,
      note: data?.nextDeadline
        ? `${data.nextDeadline.title} · ${fmtDate(data.nextDeadline.deadline)}`
        : "Nothing due in the next 7 days",
      icon: Timer,
      grad: "from-amber-500 to-rose-500",
      tint: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4 sm:p-5"
        >
          <span className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl", c.tint)} />
          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{c.label}</p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              ) : (
                <p className="mt-1 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {c.value ?? 0}
                </p>
              )}
            </div>
            <span
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm bg-gradient-to-br shrink-0",
                c.grad,
              )}
            >
              <c.icon className="w-5 h-5" />
            </span>
          </div>
          <p className="relative mt-3 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{c.note}</p>
        </div>
      ))}
    </div>
  );
};

/* ── Pending invitations ── */
export const InvitationsBanner = () => {
  const { data: invites } = useMyInvitations();
  const { accept, decline } = useInvitationActions();
  if (!invites?.length) return null;

  return (
    <section
      aria-label="Project invitations"
      className="rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-500/10 dark:to-fuchsia-500/10 p-4 space-y-3"
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-200">
        <Mail className="w-4 h-4" /> You've been invited to {invites.length === 1 ? "a project" : `${invites.length} projects`}
      </h2>
      <div className="space-y-2">
        {invites.map((inv) => {
          const busy =
            (accept.isPending && accept.variables === inv._id) ||
            (decline.isPending && decline.variables === inv._id);
          return (
            <div
              key={inv._id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-white/80 dark:bg-[#111111]/80 p-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <ProjectIcon icon={inv.project.icon} color={inv.project.color} size={36} />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                    {inv.project.title}
                  </p>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    {inv.inviter && <Avatar person={inv.inviter} size={16} />}
                    Invited by {inv.inviter?.name ?? "a classmate"} · {fmtDate(inv.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => decline.mutate(inv._id)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
                <button
                  disabled={busy}
                  onClick={() => accept.mutate(inv._id)}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-[#4b0082] hover:bg-[#5d1a8e] dark:bg-[#9d4edd] disabled:opacity-50 cursor-pointer"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
