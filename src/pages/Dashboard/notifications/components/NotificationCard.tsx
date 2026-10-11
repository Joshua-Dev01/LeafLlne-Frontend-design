import { memo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  MailOpen,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import type { NotificationItem } from "../interface/notificationTypes";
import { TYPE_META, ui } from "../notificationConfig";
import { formatShortAgo } from "../notificationUtils";

interface NotificationCardProps {
  item: NotificationItem;
  onRead: (item: NotificationItem) => void;
  onUnread: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}

const isInternal = (url: string) => url.startsWith("/") && !url.startsWith("//");
const isExternal = (url: string) => /^https?:\/\//i.test(url);

export const NotificationCard = memo(function NotificationCard({
  item,
  onRead,
  onUnread,
  onDelete,
}: NotificationCardProps) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  const urgent = item.priority === "high";
  const unread = !item.read;

  const markReadOnOpen = () => {
    if (unread) onRead(item);
  };

  const actionLabel = item.actionLabel || "Open";

  return (
    <article
      aria-label={`${unread ? "Unread: " : ""}${item.title}`}
      className={cn(
        ui.card,
        "group relative flex gap-3.5 overflow-hidden p-4 transition-colors sm:gap-4 sm:p-5",
        unread
          ? "hover:border-neutral-300 dark:hover:border-[#3d393f]"
          : "bg-neutral-50/60 dark:bg-[#0c0c0e]"
      )}
    >
      {/* Unread accent bar */}
      {unread && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-4 left-0 w-1 rounded-r-full",
            urgent ? "bg-red-500" : "bg-violet-500"
          )}
        />
      )}

      {/* Type icon */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          meta.tile,
          !unread && "opacity-75"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        {/* Eyebrow + time + menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={ui.chip}>{meta.label}</span>
            {urgent && (
              <span className="rounded-md bg-red-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-red-600 dark:bg-red-500/10 dark:text-red-400">
                Urgent
              </span>
            )}
          </div>

          <div className="-mr-1.5 -mt-1 flex shrink-0 items-center gap-1">
            <time
              dateTime={item.createdAt}
              title={new Date(item.createdAt).toLocaleString()}
              className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500"
            >
              {formatShortAgo(item.createdAt)}
            </time>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="More actions"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-200",
                    ui.focus
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {unread ? (
                  <DropdownMenuItem onClick={() => onRead(item)}>
                    <Check className="h-4 w-4" /> Mark as read
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onUnread(item)}>
                    <MailOpen className="h-4 w-4" /> Mark as unread
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mt-1.5 flex items-center gap-2 text-[15px] leading-snug text-neutral-900 dark:text-neutral-50",
            unread ? "font-semibold" : "font-medium text-neutral-600 dark:text-neutral-300"
          )}
        >
          <span className="min-w-0 break-words">{item.title}</span>
          {unread && (
            <span
              aria-hidden
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                urgent ? "bg-red-500" : "bg-violet-500"
              )}
            />
          )}
        </h3>

        <p className={cn("mt-1 break-words text-sm leading-relaxed", ui.muted)}>
          {item.message}
        </p>

        {/* Actions */}
        {(item.actionUrl || unread) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.actionUrl && isInternal(item.actionUrl) && (
              <Link
                to={item.actionUrl}
                onClick={markReadOnOpen}
                className={cn(ui.primaryBtn, ui.focus)}
              >
                {actionLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
            {item.actionUrl && isExternal(item.actionUrl) && (
              <a
                href={item.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markReadOnOpen}
                className={cn(ui.primaryBtn, ui.focus)}
              >
                {actionLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
            {unread && (
              <button
                type="button"
                onClick={() => onRead(item)}
                className={cn(ui.secondaryBtn, ui.focus)}
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
                Mark as read
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
});
