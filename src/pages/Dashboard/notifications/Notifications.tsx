import { useMemo, useState } from "react";
import {
  BellOff,
  CheckCheck,
  Inbox,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  useNeedsAttention,
  useNotificationActions,
  useNotificationFeed,
  useNotificationSummary,
} from "./hooks/useNotifications";
import type { NotificationFilter } from "./interface/notificationTypes";
import { TYPE_META, ui } from "./notificationConfig";
import { groupNotifications } from "./notificationUtils";
import { NotificationCard } from "./components/NotificationCard";
import {
  NotificationFilters,
  type ActiveFilter,
} from "./components/NotificationFilters";
import { NotificationPreferenceList } from "./components/NotificationPreferenceList";
import { NeedsAttentionCard } from "./components/NeedsAttentionCard";
import { Toggle } from "./components/Toggle";

export default function Notifications() {
  const [active, setActive] = useState<ActiveFilter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const filter = useMemo<NotificationFilter>(
    () => ({
      ...(active !== "all" && { type: active }),
      ...(unreadOnly && { unread: true }),
    }),
    [active, unreadOnly],
  );

  const summary = useNotificationSummary();
  const feed = useNotificationFeed(filter);
  const attention = useNeedsAttention();
  const { markRead, markUnread, remove, markAllRead, clearRead } =
    useNotificationActions();

  const items = useMemo(
    () => feed.data?.pages.flatMap((p) => p.data) ?? [],
    [feed.data],
  );
  const groups = useMemo(() => groupNotifications(items), [items]);

  const unreadTotal = summary.data?.unread ?? 0;
  const unreadInScope =
    active === "all"
      ? unreadTotal
      : (summary.data?.byType[active]?.unread ?? 0);
  const readTotal = (summary.data?.total ?? 0) - unreadTotal;
  const scopeLabel = active === "all" ? "all" : TYPE_META[active].label;

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      {/* ───────── Header ───────── */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
              Notifications
            </h1>
            {unreadTotal > 0 && (
              <span className="rounded-full bg-violet-100 px-2.5 py-1 font-mono text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                {unreadTotal} Unread
              </span>
            )}
          </div>
          <p className={cn("mt-1.5 text-sm", ui.muted)}>
            Stay on top of events, library activity, your notes, and AI study
            alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label
            className={cn(
              ui.card,
              "flex cursor-pointer items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-700 dark:text-neutral-200",
            )}
          >
            Unread only
            <Toggle
              label="Show unread notifications only"
              checked={unreadOnly}
              onChange={setUnreadOnly}
            />
          </label>

          <button
            type="button"
            disabled={unreadInScope === 0 || markAllRead.isPending}
            onClick={() =>
              markAllRead.mutate(active === "all" ? undefined : active)
            }
            className={cn(
              ui.card,
              "inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-violet-300 dark:hover:bg-violet-500/10",
              ui.focus,
            )}
          >
            <CheckCheck className="h-4 w-4" aria-hidden />
            {active === "all"
              ? "Mark all as read"
              : `Mark ${scopeLabel} as read`}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More options"
                className={cn(
                  ui.card,
                  "flex h-[38px] w-[38px] items-center justify-center text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
                  ui.focus,
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                variant="destructive"
                disabled={readTotal <= 0}
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 className="h-4 w-4" /> Clear read notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="mt-5">
        <NotificationFilters
          active={active}
          onChange={setActive}
          summary={summary.data}
        />
      </div>

      {/* ───────── Body ───────── */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Feed */}
        <section
          aria-label="Notifications"
          aria-busy={feed.isLoading}
          className="min-w-0"
        >
          {feed.isLoading ? (
            <FeedSkeleton />
          ) : feed.isError ? (
            <FeedError onRetry={() => feed.refetch()} />
          ) : items.length === 0 ? (
            <FeedEmpty
              unreadOnly={unreadOnly}
              scope={active === "all" ? null : scopeLabel}
            />
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <div key={group.key}>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h2 className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      {group.label}
                      {group.unread > 0 && (
                        <span className="rounded bg-violet-100 px-1.5 py-0.5 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                          {group.unread} New
                        </span>
                      )}
                    </h2>
                    {group.dateLabel && (
                      <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                        {group.dateLabel}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <NotificationCard
                        key={item.id}
                        item={item}
                        onRead={markRead.mutate}
                        onUnread={markUnread.mutate}
                        onDelete={remove.mutate}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {feed.hasNextPage && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => feed.fetchNextPage()}
                    disabled={feed.isFetchingNextPage}
                    className={cn(ui.secondaryBtn, "px-4 py-2", ui.focus)}
                  >
                    {feed.isFetchingNextPage && (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    )}
                    {feed.isFetchingNextPage ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right rail */}
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-2">
          <section className={cn(ui.card, "p-5")} aria-labelledby="controls">
            <h2
              id="controls"
              className="mb-3 flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-50"
            >
              <SlidersHorizontal
                className="h-4 w-4 text-violet-500"
                aria-hidden
              />
              Notification controls
            </h2>
            <NotificationPreferenceList />
          </section>

          <NeedsAttentionCard
            items={attention.data ?? []}
            onOpen={(item) => markRead.mutate(item)}
          />
        </aside>
      </div>

      {/* ───────── Confirm: clear read ───────── */}
      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear read notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes {readTotal} read notification
              {readTotal === 1 ? "" : "s"}. Unread ones are kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer!">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600! hover:bg-red-500! cursor-pointer!" onClick={() => clearRead.mutate()}>
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─────────────────────────── states ─────────────────────────── */

function FeedSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading notifications">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={cn(ui.card, "flex gap-4 p-5")}>
          <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedEmpty({
  unreadOnly,
  scope,
}: {
  unreadOnly: boolean;
  scope: string | null;
}) {
  const Icon = unreadOnly ? BellOff : Inbox;
  return (
    <div
      className={cn(
        ui.card,
        "flex flex-col items-center px-6 py-16 text-center",
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-50">
        {unreadOnly ? "You're all caught up" : "No notifications yet"}
      </h2>
      <p className={cn("mt-1 max-w-sm text-sm", ui.muted)}>
        {unreadOnly
          ? `Nothing unread${scope ? ` in ${scope}` : ""}. Turn off “Unread only” to see earlier ones.`
          : scope
            ? `Nothing in ${scope} yet. New activity will show up here.`
            : "Event reminders, library updates and note activity will show up here."}
      </p>
    </div>
  );
}

function FeedError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className={cn(
        ui.card,
        "flex flex-col items-center px-6 py-14 text-center",
      )}
    >
      <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
        Couldn't load notifications
      </p>
      <p className={cn("mt-1 text-sm", ui.muted)}>
        Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(ui.primaryBtn, "mt-4", ui.focus)}
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        Retry
      </button>
    </div>
  );
}
