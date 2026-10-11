import { cn } from "../../../../lib/utils";
import {
  NOTIFICATION_TYPES,
  type NotificationSummary,
  type NotificationType,
} from "../interface/notificationTypes";
import { TYPE_META, ui } from "../notificationConfig";

export type ActiveFilter = NotificationType | "all";

interface NotificationFiltersProps {
  active: ActiveFilter;
  onChange: (next: ActiveFilter) => void;
  summary?: NotificationSummary;
}

export function NotificationFilters({
  active,
  onChange,
  summary,
}: NotificationFiltersProps) {
  const tabs: { key: ActiveFilter; label: string; unread: number }[] = [
    { key: "all", label: "All", unread: summary?.unread ?? 0 },
    ...NOTIFICATION_TYPES.map((t) => ({
      key: t as ActiveFilter,
      label: TYPE_META[t].label,
      unread: summary?.byType[t]?.unread ?? 0,
    })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Notification categories"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
              selected
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-[#2e2b30] dark:bg-[#111113] dark:text-neutral-300 dark:hover:border-[#3d393f] dark:hover:text-white",
              ui.focus
            )}
          >
            {tab.label}
            {tab.unread > 0 && (
              <span
                className={cn(
                  "min-w-[1.25rem] rounded-full px-1.5 text-center font-mono text-[11px] font-semibold leading-5",
                  selected
                    ? "bg-white/25 text-white"
                    : "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                )}
              >
                {tab.unread > 99 ? "99+" : tab.unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
