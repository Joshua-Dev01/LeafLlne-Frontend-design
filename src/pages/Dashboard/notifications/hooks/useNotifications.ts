import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import {
  clearReadNotifications,
  deleteNotification,
  getNotificationPreferences,
  getNotifications,
  getNotificationSummary,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnread,
  updateNotificationPreferences,
} from "../api/api";
import type {
  NotificationFilter,
  NotificationItem,
  NotificationPage,
  NotificationPreferences,
  NotificationSummary,
  NotificationType,
} from "../interface/notificationTypes";

const POLL_MS = 30_000;

export const notificationKeys = {
  all: ["notifications"] as const,
  feeds: ["notifications", "feed"] as const,
  feed: (filter: NotificationFilter) =>
    ["notifications", "feed", filter] as const,
  attention: ["notifications", "attention"] as const,
  summary: ["notifications", "summary"] as const,
  preferences: ["notifications", "preferences"] as const,
};

type Feed = InfiniteData<NotificationPage, number>;

/* ───────────────────────────── queries ───────────────────────────── */

/** Counts for the bell badge + tabs. Shared (and de-duplicated) across the app. */
export const useNotificationSummary = () =>
  useQuery({
    queryKey: notificationKeys.summary,
    queryFn: getNotificationSummary,
    refetchInterval: POLL_MS,
    staleTime: 10_000,
    retry: 1,
  });

/** Paginated feed for the notifications page. */
export const useNotificationFeed = (filter: NotificationFilter) =>
  useInfiniteQuery({
    queryKey: notificationKeys.feed(filter),
    queryFn: ({ pageParam }) =>
      getNotifications({ ...filter, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.hasMore ? last.pagination.page + 1 : undefined,
    refetchInterval: POLL_MS,
  });

/** Unread, high-priority items for the "Needs attention" card. */
export const useNeedsAttention = () =>
  useQuery({
    queryKey: notificationKeys.attention,
    queryFn: () =>
      getNotifications({ unread: true, priority: "high", limit: 3 }),
    refetchInterval: POLL_MS,
    select: (page) => page.data,
  });

export const useNotificationPreferences = () =>
  useQuery({
    queryKey: notificationKeys.preferences,
    queryFn: getNotificationPreferences,
    staleTime: 60_000,
  });

/* ─────────────────────── optimistic-update helpers ─────────────────────── */

const patchFeeds = (
  qc: QueryClient,
  fn: (items: NotificationItem[]) => NotificationItem[]
) =>
  qc.setQueriesData<Feed>({ queryKey: notificationKeys.feeds }, (old) =>
    old
      ? { ...old, pages: old.pages.map((p) => ({ ...p, data: fn(p.data) })) }
      : old
  );

const patchSummary = (
  qc: QueryClient,
  fn: (s: NotificationSummary) => NotificationSummary
) =>
  qc.setQueryData<NotificationSummary>(notificationKeys.summary, (old) =>
    old ? fn(old) : old
  );

const bump = (
  s: NotificationSummary,
  type: NotificationType,
  delta: { total?: number; unread?: number }
): NotificationSummary => {
  const t = delta.total ?? 0;
  const u = delta.unread ?? 0;
  const cur = s.byType[type];
  return {
    total: Math.max(0, s.total + t),
    unread: Math.max(0, s.unread + u),
    byType: {
      ...s.byType,
      [type]: {
        total: Math.max(0, cur.total + t),
        unread: Math.max(0, cur.unread + u),
      },
    },
  };
};

/** Snapshot every cached feed + summary so a failed mutation can roll back. */
const snapshot = async (qc: QueryClient) => {
  await qc.cancelQueries({ queryKey: notificationKeys.all });
  return {
    feeds: qc.getQueriesData<Feed>({ queryKey: notificationKeys.feeds }),
    summary: qc.getQueryData<NotificationSummary>(notificationKeys.summary),
  };
};

type Snapshot = Awaited<ReturnType<typeof snapshot>>;

const rollback = (qc: QueryClient, snap?: Snapshot) => {
  if (!snap) return;
  snap.feeds.forEach(([key, data]) => qc.setQueryData(key, data));
  qc.setQueryData(notificationKeys.summary, snap.summary);
};

/* ───────────────────────────── mutations ───────────────────────────── */

export const useNotificationActions = () => {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: notificationKeys.all });

  const markRead = useMutation({
    mutationFn: (item: NotificationItem) => markNotificationRead(item.id),
    onMutate: async (item) => {
      const snap = await snapshot(qc);
      if (!item.read) {
        patchFeeds(qc, (items) =>
          items.map((i) => (i.id === item.id ? { ...i, read: true } : i))
        );
        patchSummary(qc, (s) => bump(s, item.type, { unread: -1 }));
      }
      return snap;
    },
    onError: (_e, _item, snap) => rollback(qc, snap),
    onSettled: refresh,
  });

  const markUnread = useMutation({
    mutationFn: (item: NotificationItem) => markNotificationUnread(item.id),
    onMutate: async (item) => {
      const snap = await snapshot(qc);
      if (item.read) {
        patchFeeds(qc, (items) =>
          items.map((i) => (i.id === item.id ? { ...i, read: false } : i))
        );
        patchSummary(qc, (s) => bump(s, item.type, { unread: 1 }));
      }
      return snap;
    },
    onError: (_e, _item, snap) => rollback(qc, snap),
    onSettled: refresh,
  });

  const remove = useMutation({
    mutationFn: (item: NotificationItem) => deleteNotification(item.id),
    onMutate: async (item) => {
      const snap = await snapshot(qc);
      patchFeeds(qc, (items) => items.filter((i) => i.id !== item.id));
      patchSummary(qc, (s) =>
        bump(s, item.type, { total: -1, unread: item.read ? 0 : -1 })
      );
      return snap;
    },
    onError: (_e, _item, snap) => rollback(qc, snap),
    onSettled: refresh,
  });

  /** No argument = everything, otherwise just that category. */
  const markAllRead = useMutation({
    mutationFn: (type?: NotificationType) => markAllNotificationsRead(type),
    onMutate: async (type) => {
      const snap = await snapshot(qc);
      patchFeeds(qc, (items) =>
        items.map((i) => (!type || i.type === type ? { ...i, read: true } : i))
      );
      patchSummary(qc, (s) => {
        const byType = { ...s.byType };
        let unread = s.unread;
        (Object.keys(byType) as NotificationType[]).forEach((t) => {
          if (type && t !== type) return;
          unread -= byType[t].unread;
          byType[t] = { ...byType[t], unread: 0 };
        });
        return { ...s, unread: Math.max(0, unread), byType };
      });
      return snap;
    },
    onError: (_e, _type, snap) => rollback(qc, snap),
    onSettled: refresh,
  });

  const clearRead = useMutation({
    mutationFn: () => clearReadNotifications(),
    onMutate: async () => {
      const snap = await snapshot(qc);
      patchFeeds(qc, (items) => items.filter((i) => !i.read));
      return snap;
    },
    onError: (_e, _v, snap) => rollback(qc, snap),
    onSettled: refresh,
  });

  return { markRead, markUnread, remove, markAllRead, clearRead };
};

export const useUpdateNotificationPreferences = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (change: Partial<Record<NotificationType, boolean>>) =>
      updateNotificationPreferences(change),
    onMutate: async (change) => {
      await qc.cancelQueries({ queryKey: notificationKeys.preferences });
      const previous = qc.getQueryData<NotificationPreferences>(
        notificationKeys.preferences
      );
      qc.setQueryData<NotificationPreferences>(
        notificationKeys.preferences,
        (old) => (old ? { ...old, inApp: { ...old.inApp, ...change } } : old)
      );
      return { previous };
    },
    onError: (_e, _change, ctx) =>
      qc.setQueryData(notificationKeys.preferences, ctx?.previous),
    onSettled: () =>
      qc.invalidateQueries({ queryKey: notificationKeys.preferences }),
  });
};
