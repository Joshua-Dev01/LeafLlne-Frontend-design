import { useEffect, useRef, useState } from "react";
import { Gauge, Loader2, RefreshCw, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

const COPY = {
  offline: {
    title: "You're offline",
    body: "We can't reach the internet. Check your Wi-Fi or mobile data — we'll reconnect automatically as soon as you're back.",
    icon: WifiOff,
    tile: "bg-red-50 text-red-600 ring-8 ring-red-50/60 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/5",
  },
  slow: {
    title: "Slow connection",
    body: "Your connection is slow right now, so pages and saves may take longer than usual. Hang tight — nothing is lost.",
    icon: Gauge,
    tile: "bg-amber-50 text-amber-600 ring-8 ring-amber-50/60 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/5",
  },
} as const;

/**
 * Pops up when the connection drops or gets slow, closes itself when it
 * recovers. Mount once near the app root.
 */
export function NetworkStatusModal() {
  const { status, episode, recheck } = useNetworkStatus();
  const [dismissedEpisode, setDismissedEpisode] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const wasDegraded = useRef(false);

  // Tell the user when things recover (only if we had said something was wrong).
  useEffect(() => {
    if (status === "online") {
      if (wasDegraded.current) toast.success("You're back online");
      wasDegraded.current = false;
      setCheckedOnce(false);
    } else {
      wasDegraded.current = true;
    }
  }, [status]);

  const open = status !== "online" && dismissedEpisode !== episode;
  const copy = status === "slow" ? COPY.slow : COPY.offline;
  const Icon = copy.icon;

  const handleRetry = async () => {
    setChecking(true);
    try {
      await recheck();
    } finally {
      setChecking(false);
      setCheckedOnce(true);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setDismissedEpisode(episode);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border-neutral-200 bg-white p-0 shadow-2xl sm:max-w-md dark:border-[#2e2b30] dark:bg-[#111113]"
      >
        <div className="flex flex-col items-center px-6 pb-2 pt-8 text-center">
          <div
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-2xl",
              copy.tile
            )}
          >
            <Icon className="h-8 w-8" aria-hidden />
          </div>

          <DialogTitle className="mt-5 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {copy.body}
          </DialogDescription>

          <p
            role="status"
            aria-live="polite"
            className="mt-3 min-h-5 font-mono text-[11px] text-neutral-400 dark:text-neutral-500"
          >
            {checking
              ? "Checking connection…"
              : checkedOnce && status !== "online"
                ? status === "offline"
                  ? "Still offline. Trying again automatically…"
                  : "Still slow. Trying again automatically…"
                : status === "offline"
                  ? "Reconnecting automatically…"
                  : ""}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 px-6 pb-6 pt-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setDismissedEpisode(episode)}
            className="inline-flex items-center justify-center rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            {status === "offline" ? "Dismiss" : "Continue anyway"}
          </button>
          <button
            type="button"
            onClick={handleRetry}
            disabled={checking}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-violet-400"
          >
            {checking ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden />
            )}
            {checking ? "Checking…" : "Try again"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
