// App-wide connection monitor.
//
// A tiny external store so both React (useNetworkStatus) and non-React code
// (the axios interceptors in services/apis.ts) can read and update it.
//
//   offline → the browser reports no network, or a probe request fails
//   slow    → a slow connection type, a slow probe, or an API request that has
//             been pending for longer than SLOW_REQUEST_MS
//   online  → everything else

export type NetworkStatus = "online" | "offline" | "slow";
export type SlowReason = "connection" | "request" | "probe";

export interface NetworkState {
  status: NetworkStatus;
  reason: SlowReason | null;
  /**
   * Increments every time we leave "online". The modal uses it so a dismissed
   * warning stays dismissed for that episode but shows again for the next one.
   */
  episode: number;
}

/** A request pending longer than this marks the connection as slow. */
export const SLOW_REQUEST_MS = 8_000;
/** A probe slower than this marks the connection as slow. */
const SLOW_PROBE_MS = 3_000;
/** A probe with no answer after this long counts as offline. */
const PROBE_TIMEOUT_MS = 6_000;
/** While offline, re-check this often. */
const OFFLINE_POLL_MS = 4_000;
/** Network-Information-API round-trip time considered slow. */
const SLOW_RTT_MS = 1_500;

interface NetworkInformationLike extends EventTarget {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number;
  saveData?: boolean;
}

const getConnection = (): NetworkInformationLike | undefined =>
  (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;

const isSlowConnectionType = (): boolean => {
  const c = getConnection();
  if (!c) return false;
  return (
    c.effectiveType === "slow-2g" ||
    c.effectiveType === "2g" ||
    (typeof c.rtt === "number" && c.rtt > SLOW_RTT_MS)
  );
};

let state: NetworkState = {
  status: typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : "online",
  reason: null,
  episode: 0,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Number of tracked requests that have outlived SLOW_REQUEST_MS. */
let slowRequests = 0;
let probeTimer: ReturnType<typeof setTimeout> | undefined;
let probing: Promise<NetworkStatus> | null = null;

const set = (status: NetworkStatus, reason: SlowReason | null = null) => {
  if (state.status === status && state.reason === reason) return;
  const leftOnline = state.status === "online" && status !== "online";
  state = {
    status,
    reason: status === "slow" ? reason : null,
    episode: leftOnline ? state.episode + 1 : state.episode,
  };
  emit();

  if (status === "offline") schedulePoll();
  else if (probeTimer) {
    clearTimeout(probeTimer);
    probeTimer = undefined;
  }
};

/** Work out the status from everything we know right now (when not offline). */
const settle = () => {
  if (state.status === "offline") return;
  if (slowRequests > 0) return set("slow", "request");
  if (isSlowConnectionType()) return set("slow", "connection");
  set("online");
};

/* ───────────────────────────── probing ───────────────────────────── */

/**
 * Ask our own origin for a tiny resource, bypassing every cache.
 * `navigator.onLine` only says the device has *a* network — a dead Wi-Fi
 * still reports true — so a real request is the source of truth.
 */
export const probe = (): Promise<NetworkStatus> => {
  if (probing) return probing;

  probing = (async (): Promise<NetworkStatus> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const started = performance.now();
    try {
      await fetch(`${import.meta.env.BASE_URL}vite.svg?_=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      const took = performance.now() - started;

      if (took > SLOW_PROBE_MS) {
        set("slow", "probe");
        return "slow";
      }
      // Reachable and quick: leave offline, then re-evaluate the other signals.
      if (state.status === "offline") set("online");
      settle();
      return state.status;
    } catch {
      set("offline");
      return "offline";
    } finally {
      clearTimeout(timeout);
      probing = null;
    }
  })();

  return probing;
};

const schedulePoll = () => {
  if (probeTimer) clearTimeout(probeTimer);
  probeTimer = setTimeout(async () => {
    probeTimer = undefined;
    if (state.status !== "offline") return;
    await probe();
    if (state.status === "offline") schedulePoll();
  }, OFFLINE_POLL_MS);
};

/* ───────────────────────── request tracking ───────────────────────── */

interface Tracked {
  timer: ReturnType<typeof setTimeout>;
  flagged: boolean;
}
const tracked = new WeakMap<object, Tracked>();

/**
 * Uploads and AI calls are legitimately slow; they must not trigger a
 * "slow connection" warning on their own.
 */
const shouldIgnore = (config: { url?: string; data?: unknown }) =>
  config.data instanceof FormData || /\/(chatAi|ai)(\/|$|\?)/i.test(config.url ?? "");

export const requestStarted = (config: {
  url?: string;
  data?: unknown;
}) => {
  if (shouldIgnore(config)) return;
  const entry: Tracked = {
    flagged: false,
    timer: setTimeout(() => {
      entry.flagged = true;
      slowRequests += 1;
      settle();
    }, SLOW_REQUEST_MS),
  };
  tracked.set(config, entry);
};

const finish = (config: object | undefined) => {
  if (!config) return;
  const entry = tracked.get(config);
  if (!entry) return;
  clearTimeout(entry.timer);
  tracked.delete(config);
  if (entry.flagged) {
    slowRequests = Math.max(0, slowRequests - 1);
    settle();
  }
};

/** Call from an axios response interceptor (success). */
export const requestSucceeded = (config: object | undefined) => {
  finish(config);
  // A completed request proves we can reach the network.
  if (state.status === "offline") set("online");
};

/** Call from an axios error interceptor. */
export const requestFailed = (
  config: object | undefined,
  error: { response?: unknown; code?: string }
) => {
  finish(config);
  // No response at all = the request never got through.
  const neverArrived = !error.response && error.code !== "ERR_CANCELED";
  if (neverArrived) {
    if (navigator.onLine === false) set("offline");
    else void probe();
  } else if (state.status === "offline") {
    set("online");
  }
};

/* ───────────────────────────── store API ───────────────────────────── */

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => state;

let started = false;

/** Attach browser listeners once. Safe to call repeatedly. */
export const startNetworkMonitor = () => {
  if (started || typeof window === "undefined") return;
  started = true;

  window.addEventListener("offline", () => set("offline"));
  window.addEventListener("online", () => void probe());
  getConnection()?.addEventListener("change", settle);

  // Initial check; also catches "online" devices with a dead connection.
  if (navigator.onLine === false) set("offline");
  else {
    settle();
    void probe();
  }
};
