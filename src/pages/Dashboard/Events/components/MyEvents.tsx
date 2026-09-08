import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Users, Bell, Share2, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "../types/eventsTypes";
import { getMyEventsApi } from "../apis/eventsApi";
import { EmptyState } from "../../../../components/Empty/EmptyState";
import DeleteEventModal from "./DeleteEventModal";
import { EditEventModal } from "./EditEventModal";
import { ShareEventModal } from "./Shareeventmodal ";

const statusConfig = {
  upcoming: { label: "Upcoming", bg: "bg-blue-50 dark:bg-blue-950/40",   text: "text-blue-600 dark:text-blue-400",  dot: "bg-blue-500" },
  ongoing:  { label: "Live",     bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  ended:    { label: "Ended",    bg: "bg-slate-100 dark:bg-white/6",     text: "text-slate-500 dark:text-white/40", dot: "bg-slate-400" },
};

const MyEvents = () => {
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const [editEvent,   setEditEvent]   = useState<Event | null>(null);
  const [shareEvent,  setShareEvent]  = useState<Event | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<Event[]>({
    queryKey: ["my-events"],
    queryFn: getMyEventsApi,
    retry: 2,
    staleTime: 60_000,
  });

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 dark:border-white/6 p-5 animate-pulse space-y-3 bg-white dark:bg-[#0F1A2E]">
            <div className="h-4 bg-slate-100 dark:bg-white/6 rounded-lg w-2/3" />
            <div className="h-3 bg-slate-100 dark:bg-white/6 rounded-lg w-full" />
            <div className="h-3 bg-slate-100 dark:bg-white/6 rounded-lg w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-slate-100 dark:bg-white/6 rounded-xl flex-1" />
              <div className="h-8 bg-slate-100 dark:bg-white/6 rounded-xl flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Error ── */
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-red-500 font-['DM_Sans',sans-serif]">Failed to load your events</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-[#0A1931] text-white text-sm font-semibold font-['DM_Sans',sans-serif]"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ── Empty ── */
  if (!data?.length) return <div className="py-10"><EmptyState /></div>;

  /* ── List ── */
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((event, i) => {
          const status = statusConfig[event.status ?? "upcoming"];
          const date   = new Date(event.date);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-[#0F1A2E] rounded-2xl border border-slate-100 dark:border-white/6 overflow-hidden hover:shadow-md dark:hover:shadow-black/20 transition-all duration-300"
            >
              {/* Color top bar based on status */}
              <div className={`h-1 ${event.status === "upcoming" ? "bg-blue-500" : event.status === "ongoing" ? "bg-green-500" : "bg-slate-300 dark:bg-white/10"}`} />

              <div className="p-5">
                {/* Top row: status + actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${event.status === "ongoing" ? "animate-pulse" : ""}`} />
                    {status.label}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShareEvent(event)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/6 text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      <Share2 size={13} />
                    </button>
                    <button
                      onClick={() => setEditEvent(event)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-400 dark:text-white/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteEvent(event)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 dark:text-white/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-[15px] text-slate-900 dark:text-white leading-snug mb-1.5 font-['DM_Sans',sans-serif] line-clamp-1">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-white/40 line-clamp-2 mb-4 leading-relaxed font-['DM_Sans',sans-serif]">
                  {event.description}
                </p>

                {/* Meta */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-white/40">
                    <CalendarDays size={12} />
                    <span className="text-xs font-medium font-['DM_Sans',sans-serif]">
                      {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {" · "}
                      {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-white/40">
                      <MapPin size={12} />
                      <span className="text-xs font-medium font-['DM_Sans',sans-serif] truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-50 dark:border-white/4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
                    <Bell size={11} />
                    <span>{event.interestedUsers.length} interested</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
                    <Users size={11} />
                    <span>{event.goingUsers.length} going</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modals */}
      <DeleteEventModal open={!!deleteEvent} onClose={() => setDeleteEvent(null)} event={deleteEvent} />
      {editEvent  && <EditEventModal  open={!!editEvent}  onClose={() => setEditEvent(null)}  event={editEvent} />}
      {shareEvent && <ShareEventModal open={!!shareEvent} onClose={() => setShareEvent(null)} event={shareEvent} />}
    </>
  );
};

export default MyEvents;