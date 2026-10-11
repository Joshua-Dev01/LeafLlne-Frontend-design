import { Skeleton } from "../../../../components/ui/skeleton";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
} from "../interface/notificationTypes";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../hooks/useNotifications";
import { TYPE_META, ui } from "../notificationConfig";
import { cn } from "../../../../lib/utils";
import { Toggle } from "./Toggle";

/** One switch per category. Used on the notifications page and in Settings. */
export function NotificationPreferenceList() {
  const { data, isLoading, isError, refetch } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {NOTIFICATION_TYPES.map((t) => (
          <Skeleton key={t} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className={cn("text-sm", ui.muted)}>
        Couldn't load your settings.{" "}
        <button
          type="button"
          onClick={() => refetch()}
          className="font-medium text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
        >
          Try again
        </button>
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {NOTIFICATION_TYPES.map((type: NotificationType) => {
        const meta = TYPE_META[type];
        const locked = data.locked.includes(type);
        return (
          <li
            key={type}
            className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3.5 py-3 dark:bg-white/[0.04]"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {meta.preferenceLabel}
              </p>
              <p className="mt-0.5 font-mono text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                {meta.description}
              </p>
            </div>
            <Toggle
              label={`${meta.preferenceLabel} notifications`}
              checked={locked ? true : data.inApp[type]}
              disabled={locked}
              onChange={(next) => update.mutate({ [type]: next })}
            />
          </li>
        );
      })}
    </ul>
  );
}
