import { Clock } from "lucide-react";
import { Link }  from "react-router-dom";
import type { Event } from "../types/events.types";

const CATEGORY_COLORS: Record<string, string> = {
  Academic:     "from-blue-600 to-blue-800",
  "Campus Life":"from-purple-600 to-purple-800",
  Career:       "from-green-600 to-green-800",
  Competition:  "from-orange-500 to-orange-700",
  Social:       "from-pink-500 to-pink-700",
  Cultural:     "from-yellow-500 to-yellow-700",
  Sports:       "from-red-500 to-red-700",
  Other:        "from-slate-500 to-slate-700",
};

interface Props {
  event: Event;
  faded?: boolean;
  grid?:  boolean;
}

export const OngoingCard = ({ event, faded, grid }: Props) => {
  const date     = new Date(event.startTime);
  const dateStr  = date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr  = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const gradient = CATEGORY_COLORS[event.category] ?? "from-slate-500 to-slate-700";

  return (
    <Link
      to={`/dashboard/events/${event.id}`}
      className={`block flex-shrink-0 font-['DM_Sans',sans-serif] ${grid ? "w-full" : "w-[170px]"} ${faded ? "opacity-60" : ""}`}
    >
      <div className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-slate-100 dark:border-white/6 shadow-sm hover:shadow-md transition-shadow duration-200 group">

        {/* Image / gradient banner */}
        <div className={`relative ${grid ? "h-44" : "h-[110px]"} overflow-hidden`}>
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
          )}

          {/* Live badge */}
          {event.status === "live" && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] font-bold">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}

          {/* Ended badge */}
          {event.status === "ended" && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[9px] font-bold">
              ENDED
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-3 py-2.5">
          <h3 className={`font-bold text-slate-900 dark:text-white leading-snug mb-1.5 line-clamp-1 ${grid ? "text-[15px]" : "text-[13px]"}`}>
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-white/40">
            <Clock size={11} className="flex-shrink-0" />
            <span className="text-[11px] font-medium truncate">{dateStr}, {timeStr}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};