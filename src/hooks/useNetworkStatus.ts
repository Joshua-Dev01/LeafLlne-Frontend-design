import { useEffect, useSyncExternalStore } from "react";
import {
  getSnapshot,
  probe,
  startNetworkMonitor,
  subscribe,
  type NetworkState,
  type NetworkStatus,
} from "../lib/networkMonitor";

/** Live connection state: "online" | "offline" | "slow". */
export function useNetworkStatus(): NetworkState & {
  /** Re-check the connection now. Resolves to the new status. */
  recheck: () => Promise<NetworkStatus>;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    startNetworkMonitor();
  }, []);

  return { ...state, recheck: probe };
}
