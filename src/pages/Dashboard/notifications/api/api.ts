import { apiGet, apiPut, apiDelete } from "../../../../services/apiCall";
import type {
  NotificationItem,
  NotificationPage,
  NotificationPreferences,
  NotificationQuery,
  NotificationSummary,
  NotificationType,
} from "../interface/notificationTypes";

const BASE = "/notifications";

const toQueryString = (query: NotificationQuery) => {
  const params = new URLSearchParams();
  if (query.type) params.set("type", query.type);
  if (query.priority) params.set("priority", query.priority);
  if (query.unread) params.set("unread", "true");
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

/** One page of the feed, newest first. */
export const getNotifications = (
  query: NotificationQuery = {}
): Promise<NotificationPage> =>
  apiGet<NotificationPage>(`${BASE}${toQueryString(query)}`);

/** Counts for the bell badge and filter tabs. */
export const getNotificationSummary = (): Promise<NotificationSummary> =>
  apiGet<NotificationSummary>(`${BASE}/summary`);

export const markNotificationRead = (id: string) =>
  apiPut<{ message: string; data: NotificationItem }, Record<string, never>>(
    `${BASE}/${id}/read`,
    {}
  );

export const markNotificationUnread = (id: string) =>
  apiPut<{ message: string; data: NotificationItem }, Record<string, never>>(
    `${BASE}/${id}/unread`,
    {}
  );

/** Mark everything read, or just one category. */
export const markAllNotificationsRead = (type?: NotificationType) =>
  apiPut<{ message: string; modified: number }, { type?: NotificationType }>(
    `${BASE}/mark-all-read`,
    type ? { type } : {}
  );

export const deleteNotification = (id: string) =>
  apiDelete<{ message: string }>(`${BASE}/${id}`);

/** Delete every notification that has already been read. */
export const clearReadNotifications = () =>
  apiDelete<{ message: string; deleted: number }>(`${BASE}/clear-read`);

export const getNotificationPreferences = (): Promise<NotificationPreferences> =>
  apiGet<NotificationPreferences>(`${BASE}/preferences`);

export const updateNotificationPreferences = (
  inApp: Partial<Record<NotificationType, boolean>>
) =>
  apiPut<
    NotificationPreferences,
    { inApp: Partial<Record<NotificationType, boolean>> }
  >(`${BASE}/preferences`, { inApp });
