import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "../types/eventsTypes";

/* ── Avatar stack ────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-purple-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-teal-400",
];

const AvatarStack = ({ count }: { count: number }) => {
  const show = Math.min(count, 4);
  const extra = count - show;
  return (
    <div className="flex items-center mt-3">
      {Array.from({ length: show }).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-[2px] border-white dark:border-[#111827] ${AVATAR_COLORS[i % AVATAR_COLORS.length]} -ml-1.5 first:ml-0`}
        />
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full border-[2px] border-white dark:border-[#111827] bg-slate-200 dark:bg-slate-600 -ml-1.5 flex items-center justify-center text-[8px] font-bold text-slate-500 dark:text-white">
          +{extra}
        </div>
      )}
      {count === 0 && (
        <span className="text-[11px] text-slate-400 dark:text-white/30 font-medium">
          No attendees yet
        </span>
      )}
    </div>
  );
};

/* ── Date badge color per category ──────────────────────────────── */
const DATE_BADGE: Record<string, string> = {
  Academic: "bg-blue-100   text-blue-700",
  "Campus Life": "bg-purple-100 text-purple-700",
  Career: "bg-green-100  text-green-700",
  Competition: "bg-orange-100 text-orange-700",
  Social: "bg-pink-100   text-pink-700",
  Cultural: "bg-yellow-100 text-yellow-700",
  Sports: "bg-red-100    text-red-700",
  Other: "bg-slate-100  text-slate-600",
};

interface Props {
  event: Event;
}

export const UpcomingCard = ({ event }: Props) => {
  const start = new Date(event.startTime);
  const end = event.endTime ? new Date(event.endTime) : null;
  const badgeDate = start.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = end?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const badgeClass = DATE_BADGE[event.category] ?? DATE_BADGE.Other;
  const totalAttendees = event.goingUsers.length + event.interestedUsers.length;

  return (
    <Link
      to={`/dashboard/events/${event.id}`}
      className="block flex-shrink-0 w-[178px] font-['DM_Sans',sans-serif]"
    >
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
        {/* Date badge — matches the blue pill in the screenshot */}
        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 ${badgeClass}`}
        >
          {badgeDate}
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-white/40">
          <Clock size={11} className="flex-shrink-0" />
          <span className="text-[11px] font-medium">
            {startTime}
            {endTime ? ` - ${endTime}` : ""}
          </span>
        </div>

        {/* Avatar stack */}
        <AvatarStack count={totalAttendees} />
      </div>
    </Link>
  );
};
