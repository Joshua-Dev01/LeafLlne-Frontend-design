import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAllEvents, useGoingEvents, useMyEvents } from "../hooks/eventHooks";
import { OngoingCard } from "./Ongoingcard";
import { UpcomingCard } from "./Upcomingcard";

/* ── Tab ─────────────────────────────────────────────────────────── */
type Tab = "all" | "mine" | "going";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Events" },
  { id: "mine", label: "My Events" },
  { id: "going", label: "Going" },
];

/* ── Avatar stack (used in UpcomingCard) ─────────────────────────── */
export const AvatarStack = ({
  users,
  max = 4,
}: {
  users: string[];
  max?: number;
}) => {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  const colors = [
    "bg-blue-400",
    "bg-purple-400",
    "bg-green-400",
    "bg-orange-400",
    "bg-pink-400",
  ];
  return (
    <div className="flex items-center">
      {shown.map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 border-white dark:border-[#111827] ${colors[i % colors.length]} -ml-1.5 first:ml-0 flex items-center justify-center`}
        />
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#111827] bg-slate-300 dark:bg-slate-600 -ml-1.5 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-white">
          +{extra}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EVENTS PAGE
═══════════════════════════════════════════════════════════════════ */
export const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const q = search
    ? `search=${encodeURIComponent(search)}&limit=30`
    : "limit=30";

  const { data: allData, isLoading: allLoad } = useAllEvents(q);
  const { data: myEvents, isLoading: myLoad } = useMyEvents();
  const { data: goingEvents, isLoading: goingLoad } = useGoingEvents();

  const all = allData?.events ?? [];
  const live = all.filter((e) => e.status === "live");
  const upcoming = all.filter((e) => e.status === "upcoming");
  const ended = all.filter((e) => e.status === "ended");

  /* Stats cards — matching the 3-badge row in the screenshot */
  const statCards = [
    {
      abbr: "UE",
      label: "Upcoming Events",
      sub: `${upcoming.length} events`,
      abbBg: "bg-blue-100",
      abbText: "text-blue-600",
    },
    {
      abbr: "GE",
      label: "Going",
      sub: `${goingEvents?.length ?? 0} RSVP`,
      abbBg: "bg-yellow-100",
      abbText: "text-yellow-600",
    },
    {
      abbr: "ME",
      label: "My Events",
      sub: `${myEvents?.length ?? 0} created`,
      abbBg: "bg-green-100",
      abbText: "text-green-600",
    },
  ];

  /* What to show per tab */
  const tabContent =
    activeTab === "mine"
      ? (myEvents ?? [])
      : activeTab === "going"
        ? (goingEvents ?? [])
        : all;

  const tabLoading =
    activeTab === "mine" ? myLoad : activeTab === "going" ? goingLoad : allLoad;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1A] font-['DM_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
        {/* ── Page header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-[22px] font-black text-slate-900 dark:text-white">
              Events
            </h1>
            <p className="text-sm text-slate-400 dark:text-white/40 mt-0.5">
              Discover &amp; join campus events
            </p>
          </div>
          <Link to="create">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-500/25">
              <Plus size={15} />
              Create Event
            </button>
          </Link>
        </div>

        {/* ── Stats row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-7">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/6 px-4 py-3.5 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-xl ${s.abbBg} ${s.abbText} flex items-center justify-center font-black text-[11px] flex-shrink-0`}
              >
                {s.abbr}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-white/40 font-medium">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Tabs ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111827] text-sm text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex gap-1 p-1 bg-white dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-white/6 shadow-sm ml-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            ALL EVENTS VIEW  — matches the screenshot layout
        ════════════════════════════════════════════════════════ */}
        {activeTab === "all" && (
          <>
            {/* ── Ongoing / Live section ─────────────────────────── */}
            {(live.length > 0 || allLoad) && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="text-[16px] font-black text-slate-900 dark:text-white">
                      Ongoing Event
                    </h2>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                  {allLoad
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <OngoingCardSkeleton key={i} />
                      ))
                    : live.map((e, i) => (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <OngoingCard event={e} />
                        </motion.div>
                      ))}
                </div>
              </section>
            )}

            {/* ── Upcoming section ───────────────────────────────── */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-black text-slate-900 dark:text-white">
                  Upcoming Event
                </h2>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {allLoad ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <UpcomingCardSkeleton key={i} />
                  ))
                ) : upcoming.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-white/30 py-6 px-2">
                    No upcoming events right now
                  </p>
                ) : (
                  upcoming.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <UpcomingCard event={e} />
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* ── Past events ────────────────────────────────────── */}
            {ended.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-black text-slate-900 dark:text-white">
                    Past Events
                  </h2>
                  <button className="text-slate-400">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                  {ended.map((e) => (
                    <OngoingCard key={e.id} event={e} faded />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            MINE / GOING — grid layout
        ════════════════════════════════════════════════════════ */}
        {activeTab !== "all" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tabLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <OngoingCardSkeleton key={i} grid />
              ))
            ) : tabContent.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <p className="text-slate-400 dark:text-white/30 text-sm">
                  No events here yet
                </p>
              </div>
            ) : (
              tabContent.map((e, i) => <OngoingCard key={i} event={e} grid />)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Skeleton components ─────────────────────────────────────────── */
const OngoingCardSkeleton = ({ grid }: { grid?: boolean }) => (
  <div
    className={`flex-shrink-0 bg-white dark:bg-[#111827] rounded-2xl overflow-hidden animate-pulse border border-slate-100 dark:border-white/6 ${grid ? "w-full" : "w-44"}`}
  >
    <div
      className={`bg-slate-200 dark:bg-white/8 ${grid ? "h-40" : "h-28"} w-full`}
    />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-white/8 rounded w-3/4" />
      <div className="h-2.5 bg-slate-200 dark:bg-white/8 rounded w-1/2" />
    </div>
  </div>
);

const UpcomingCardSkeleton = () => (
  <div className="flex-shrink-0 w-44 bg-white dark:bg-[#111827] rounded-2xl p-4 animate-pulse border border-slate-100 dark:border-white/6 space-y-3">
    <div className="h-6 w-24 bg-slate-200 dark:bg-white/8 rounded-full" />
    <div className="h-3 bg-slate-200 dark:bg-white/8 rounded w-full" />
    <div className="h-2.5 bg-slate-200 dark:bg-white/8 rounded w-3/4" />
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/8 -ml-1 first:ml-0"
        />
      ))}
    </div>
  </div>
);
