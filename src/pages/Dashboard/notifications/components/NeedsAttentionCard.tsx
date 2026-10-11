import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { NotificationItem } from "../interface/notificationTypes";
import { TYPE_META, ui } from "../notificationConfig";
import { formatShortAgo } from "../notificationUtils";

interface NeedsAttentionCardProps {
  items: NotificationItem[];
  onOpen: (item: NotificationItem) => void;
}

/** Unread, high-priority notifications (e.g. event reminders, rejected uploads). */
export function NeedsAttentionCard({ items, onOpen }: NeedsAttentionCardProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn(ui.card, "p-5")} aria-labelledby="needs-attention">
      <h2
        id="needs-attention"
        className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-50"
      >
        <AlertTriangle
          className="h-4 w-4 text-red-500 dark:text-red-400"
          aria-hidden
        />
        Needs attention
      </h2>

      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const Icon = TYPE_META[item.type].icon;
          const to =
            item.actionUrl && item.actionUrl.startsWith("/") && !item.actionUrl.startsWith("//")
              ? item.actionUrl
              : null;

          const body = (
            <>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  TYPE_META[item.type].tile
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </span>
                <span className="block truncate font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  {item.message}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                {formatShortAgo(item.createdAt)}
              </span>
            </>
          );

          const rowClass = cn(
            "flex w-full items-center gap-3 rounded-xl bg-neutral-50 p-2.5 text-left transition hover:bg-neutral-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]",
            ui.focus
          );

          return (
            <li key={item.id}>
              {to ? (
                <Link to={to} onClick={() => onOpen(item)} className={rowClass}>
                  {body}
                </Link>
              ) : (
                <button type="button" onClick={() => onOpen(item)} className={rowClass}>
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
