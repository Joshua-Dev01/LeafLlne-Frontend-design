import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import type { NotificationItem } from "./interface/notificationTypes";

/** "Just now", "14m ago", "3h ago", "2d ago", then "Oct 4". */
export const formatShortAgo = (iso: string, now = new Date()): string => {
  const date = new Date(iso);
  const seconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return format(date, "MMM d");
};

export interface NotificationGroup {
  key: "today" | "yesterday" | "week" | "earlier";
  label: string;
  /** e.g. "Wednesday, Oct 23" for Today / Yesterday */
  dateLabel?: string;
  items: NotificationItem[];
  unread: number;
}

const GROUP_ORDER: NotificationGroup["key"][] = [
  "today",
  "yesterday",
  "week",
  "earlier",
];

const LABELS: Record<NotificationGroup["key"], string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This week",
  earlier: "Earlier",
};

/** Buckets a newest-first list into Today / Yesterday / This week / Earlier. */
export const groupNotifications = (
  items: NotificationItem[],
  now = new Date()
): NotificationGroup[] => {
  const buckets = new Map<NotificationGroup["key"], NotificationItem[]>();

  for (const item of items) {
    const date = new Date(item.createdAt);
    let key: NotificationGroup["key"];
    if (isToday(date)) key = "today";
    else if (isYesterday(date)) key = "yesterday";
    else if (differenceInCalendarDays(now, date) < 7) key = "week";
    else key = "earlier";
    buckets.set(key, [...(buckets.get(key) ?? []), item]);
  }

  return GROUP_ORDER.filter((key) => buckets.has(key)).map((key) => {
    const groupItems = buckets.get(key)!;
    return {
      key,
      label: LABELS[key],
      dateLabel:
        key === "today" || key === "yesterday"
          ? format(new Date(groupItems[0].createdAt), "EEEE, MMM d")
          : undefined,
      items: groupItems,
      unread: groupItems.filter((i) => !i.read).length,
    };
  });
};
