import { useEffect, useState, useCallback, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getAllEventsApi } from "../apis/eventsApi";
import type { PaginatedEvents } from "../types/eventsTypes";
import { handleResponse } from "../../../../utils/handleErrors";

interface Props {
  onResults: (data: PaginatedEvents) => void;
  onLoading: (loading: boolean) => void;
}

const TOPICS  = ["Technology", "Business", "Design", "Science", "Arts", "Sports", "Health", "Other"];
const STATUSES = ["upcoming", "ongoing", "ended"] as const;

export const EventSearchBar = ({ onResults, onLoading }: Props) => {
  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState<"latest" | "date">("latest");
  const [topic,        setTopic]        = useState("all");
  const [status,       setStatus]       = useState("all");
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFiltersOpen(false);
    };
    if (filtersOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filtersOpen]);

  const fetchEvents = useCallback(async () => {
    const params = new URLSearchParams({ search, sort, page: "1", limit: "12" });
    if (topic  !== "all") params.append("topic",  topic);
    if (status !== "all") params.append("status", status);
    try {
      onLoading(true);
      const data = await getAllEventsApi(params.toString());
      onResults(data);
    } catch (error) {
      handleResponse({ error });
    } finally {
      onLoading(false);
    }
  }, [search, sort, topic, status, onLoading, onResults]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 400);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const hasFilters = sort !== "latest" || topic !== "all" || status !== "all";

  const reset = () => { setSort("latest"); setTopic("all"); setStatus("all"); };

  const selectClass = `
    w-full bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8
    rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 dark:focus:ring-white/10
    font-['DM_Sans',sans-serif]
  `;

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      {/* Search input */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/25 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, topics, locations..."
          className="
            w-full pl-11 pr-4 py-2.5 rounded-xl
            bg-white dark:bg-white/4
            border border-slate-200 dark:border-white/8
            text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/25
            focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 dark:focus:ring-white/10
            shadow-sm font-['DM_Sans',sans-serif]
          "
        />
      </div>

      {/* Filter toggle */}
      <button
        onClick={() => setFiltersOpen((p) => !p)}
        className={`
          relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
          font-['DM_Sans',sans-serif]
          ${filtersOpen || hasFilters
            ? "bg-[#0A1931] border-[#0A1931] text-white"
            : "bg-white dark:bg-white/4 border-slate-200 dark:border-white/8 text-slate-600 dark:text-white/50 hover:border-slate-300 dark:hover:border-white/15"
          }
        `}
      >
        <SlidersHorizontal size={15} />
        <span className="hidden sm:inline">Filters</span>
        {hasFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute -top-0.5 -right-0.5" />
        )}
      </button>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0F1A2E] border border-slate-100 dark:border-white/8 rounded-2xl shadow-xl p-5 space-y-4 z-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-white font-['DM_Sans',sans-serif]">
              Filters
            </span>
            <button onClick={() => setFiltersOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400">
              <X size={13} />
            </button>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1.5 font-['DM_Sans',sans-serif]">
              Sort by
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value as "latest" | "date")} className={selectClass}>
              <option value="latest">Latest</option>
              <option value="date">Date</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1.5 font-['DM_Sans',sans-serif]">
              Topic
            </label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass}>
              <option value="all">All Topics</option>
              {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1.5 font-['DM_Sans',sans-serif]">
              Status
            </label>
            <div className="flex gap-2">
              {["all", ...STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`
                    flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors font-['DM_Sans',sans-serif]
                    ${status === s
                      ? "bg-[#0A1931] text-white"
                      : "bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10"
                    }
                  `}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-white/6">
            <button
              onClick={reset}
              className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/8 text-sm font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/4 transition-colors font-['DM_Sans',sans-serif]"
            >
              Reset
            </button>
            <button
              onClick={() => setFiltersOpen(false)}
              className="flex-1 py-2 rounded-xl bg-[#0A1931] text-white text-sm font-semibold transition-colors font-['DM_Sans',sans-serif]"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};