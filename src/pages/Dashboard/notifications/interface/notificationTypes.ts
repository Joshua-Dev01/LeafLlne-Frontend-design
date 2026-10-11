// Mirrors the backend contract in
// leafline-backend/src/services/Notifications/notification.constants.ts

export const NOTIFICATION_TYPES = [
  "event",
  "library",
  "note",
  "ai",
  "project",
  "system",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationPriority = "low" | "normal" | "high";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon: string | null;
  actionUrl: string | null;
  actionLabel: string | null;
  meta: Record<string, unknown> | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface NotificationPage {
  data: NotificationItem[];
  pagination: NotificationPagination;
}

export interface NotificationCount {
  total: number;
  unread: number;
}

export interface NotificationSummary extends NotificationCount {
  byType: Record<NotificationType, NotificationCount>;
}

export interface NotificationPreferences {
  inApp: Record<NotificationType, boolean>;
  /** Types that can't be switched off. */
  locked: NotificationType[];
}

export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  unread?: boolean;
}

export interface NotificationQuery extends NotificationFilter {
  page?: number;
  limit?: number;
}
