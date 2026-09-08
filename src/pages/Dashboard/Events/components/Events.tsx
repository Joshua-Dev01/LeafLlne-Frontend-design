import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Clock, Heart, Users,
  Share2, MessageCircle, MoreVertical, Pencil, Trash2, Check,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { useToggleInterested, useToggleGoing } from "../hooks/eventHooks";
import type { Event } from "../types/eventsTypes";
import DeleteEventModal from "./DeleteEventModal";

import { EventComments } from "./Eventcomments ";
import { ShareEventModal } from "./Shareeventmodal ";
import { EditEventModal } from "./EditEventModal";

interface Props {
  event: Event;
  currentUserId: string;
}

/* ── Status config ───────────────────────────────────────────────── */
const statusConfig = {
  upcoming: {
    label: "UPCOMING",
    bg: "bg-orange-500",
    cardBg: "bg-orange-500",
    dot: "bg-white",
  },
  ongoing: {
    label: "LIVE",
    bg: "bg-green-500",
    cardBg: "bg-green-600",
    dot: "bg-white animate-pulse",
  },
  ended: {
    label: "ENDED",
    bg: "bg-slate-600",
    cardBg: "bg-[#1a1a2e]",
    dot: "",
  },
};

/* ── Topic color map ─────────────────────────────────────────────── */
const topicColor: Record<string, string> = {
  Technology:    "text-blue-600",
  Business:      "text-purple-600",
  Design:        "text-pink-600",
  Science:       "text-teal-600",
  Arts:          "text-rose-600",
  Sports:        "text-orange-600",
  Health:        "text-green-600",
  Other:         "text-slate-500",
};

export const EventCard = ({ event, currentUserId }: Props) => {
  const toggleInterested = useToggleInterested();
  const toggleGoing      = useToggleGoing();

  const [interestedUsers, setInterestedUsers] = useState<string[]>([]);
  const [goingUsers,      setGoingUsers]      = useState<string[]>([]);
  const [isInterested,    setIsInterested]    = useState(false);
  const [isGoing,         setIsGoing]         = useState(false);

  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [shareOpen,    setShareOpen]    = useState(false);
  const [editOpen,     setEditOpen]     = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    setInterestedUsers(event.interestedUsers ?? []);
    setGoingUsers(event.goingUsers ?? []);
    setIsInterested(event.interestedUsers?.includes(currentUserId) ?? false);
    setIsGoing(event.goingUsers?.includes(currentUserId) ?? false);
  }, [event, currentUserId]);

  const isOwner = event.createdBy === currentUserId;

  const handleInterested = () => {
    const next = !isInterested;
    setIsInterested(next);
    setInterestedUsers((p) =>
      next ? [...p, currentUserId] : p.filter((id) => id !== currentUserId)
    );
    toggleInterested.mutate(event.id);
  };

  const handleGoing = () => {
    const prev = [...goingUsers];
    const prevState = isGoing;
    setGoingUsers(isGoing
      ? prev.filter((id) => id !== currentUserId)
      : [...prev, currentUserId]
    );
    setIsGoing(!isGoing);
    toggleGoing.mutate(event.id, {
      onError: () => { setGoingUsers(prev); setIsGoing(prevState); },
    });
  };

  const status   = statusConfig[event.status ?? "upcoming"];
  const eventDate = new Date(event.date);
  const month    = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day      = eventDate.getDate();
  const time     = eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const topicClr = event.topic ? (topicColor[event.topic] ?? "text-slate-500") : "text-slate-500";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="
          flex flex-col bg-white dark:bg-[#111827]
          rounded-xl overflow-hidden
          border border-slate-200 dark:border-white/8
          shadow-sm hover:shadow-md dark:hover:shadow-black/20
          transition-all duration-200
        "
      >

        {/* ── Banner ───────────────────────────────────────────── */}
        <div className={`relative h-[130px] ${event.image ? "" : status.cardBg}`}>
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay for image cards */}
          {event.image && (
            <div className="absolute inset-0 bg-black/30" />
          )}

          {/* Status pill — top left */}
          <div className={`
            absolute top-3 left-3
            flex items-center gap-1.5 px-2 py-0.5
            rounded-full text-[10px] font-bold text-white tracking-wider
            ${status.bg}
          `}>
            {event.status === "ongoing" && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            {status.label}
          </div>

          {/* Date badge — top right */}
          <div className="
            absolute top-3 right-3
            flex flex-col items-center justify-center
            w-10 h-10 rounded-lg
            bg-black/30 backdrop-blur-sm
            text-white
          ">
            <span className="text-[8px] font-bold uppercase leading-none">{month}</span>
            <span className="text-base font-black leading-tight">{day}</span>
          </div>

          {/* Owner menu — bottom right of banner */}
          {isOwner && (
            <div className="absolute bottom-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="
                    w-7 h-7 flex items-center justify-center rounded-lg
                    bg-black/30 backdrop-blur-sm text-white
                    hover:bg-black/50 transition-colors
                  ">
                    <MoreVertical size={13} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 rounded-xl border-slate-100 dark:border-white/8 bg-white dark:bg-[#1a2235]"
                >
                  <DropdownMenuItem
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-2 text-sm cursor-pointer font-['DM_Sans',sans-serif]"
                  >
                    <Pencil size={12} /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center gap-2 text-sm text-red-500 cursor-pointer focus:text-red-500 font-['DM_Sans',sans-serif]"
                  >
                    <Trash2 size={12} /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-0">

          {/* Topic */}
          {event.topic && (
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 font-['DM_Sans',sans-serif] ${topicClr}`}>
              {event.topic}
            </span>
          )}

          {/* Title */}
          <h3 className="
            font-bold text-[17px] text-slate-900 dark:text-white
            leading-snug mb-1 line-clamp-1
            font-['DM_Sans',sans-serif]
          ">
            {event.title}
          </h3>

          {/* Description */}
          <p className="
            text-[12.5px] text-slate-500 dark:text-white/40
            line-clamp-2 mb-3 leading-relaxed
            font-['DM_Sans',sans-serif]
          ">
            {event.description}
          </p>

          {/* Time */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-white/40 mb-1.5">
            <Clock size={13} className="flex-shrink-0" />
            <span className="text-[12px] font-medium font-['DM_Sans',sans-serif]">{time}</span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-white/40 mb-3">
              <MapPin size={13} className="flex-shrink-0" />
              <span className="text-[12px] font-medium font-['DM_Sans',sans-serif] truncate">
                {event.location}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
              <Heart size={12} />
              <span>{interestedUsers.length} interested</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
              <Users size={12} />
              <span>{goingUsers.length} going</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Interest */}
            <button
              onClick={handleInterested}
              className={`
                flex items-center justify-center gap-1.5
                py-2 rounded-lg border text-[12.5px] font-semibold
                transition-all duration-150 font-['DM_Sans',sans-serif]
                ${isInterested
                  ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900"
                  : "bg-white dark:bg-transparent border-slate-200 dark:border-white/15 text-slate-700 dark:text-white/70 hover:border-slate-300 dark:hover:border-white/30"
                }
              `}
            >
              <Heart size={13} className={isInterested ? "fill-current" : ""} />
              Interest
            </button>

            {/* Attend */}
            <button
              onClick={handleGoing}
              className={`
                flex items-center justify-center gap-1.5
                py-2 rounded-lg border text-[12.5px] font-semibold
                transition-all duration-150 font-['DM_Sans',sans-serif]
                ${isGoing
                  ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900"
                  : "bg-white dark:bg-transparent border-slate-200 dark:border-white/15 text-slate-700 dark:text-white/70 hover:border-slate-300 dark:hover:border-white/30"
                }
              `}
            >
              {isGoing && <Check size={13} />}
              <Users size={13} />
              Attend
            </button>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div className="
          flex items-center justify-between
          px-4 py-2.5
          border-t border-slate-100 dark:border-white/6
          text-slate-400 dark:text-white/30
        ">
          <div className="flex items-center gap-0">
            <button
              onClick={() => setCommentsOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/6 text-[11.5px] font-medium transition-colors font-['DM_Sans',sans-serif]"
            >
              <MessageCircle size={12} />
              Discuss
            </button>

            <span className="text-slate-200 dark:text-white/10 mx-0.5">|</span>

            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/6 text-[11.5px] font-medium transition-colors font-['DM_Sans',sans-serif]"
            >
              <Share2 size={12} />
              Share
            </button>
          </div>

          <span className="text-[11px] font-medium font-['DM_Sans',sans-serif] truncate max-w-[100px]">
            by <span className="text-slate-500 dark:text-white/40 font-semibold">{event.creatorName}</span>
          </span>
        </div>
      </motion.div>

      {/* Modals */}
      <DeleteEventModal open={deleteOpen} onClose={() => setDeleteOpen(false)} event={event} />
      <ShareEventModal  open={shareOpen}  onClose={() => setShareOpen(false)}  event={event} />
      <EditEventModal   open={editOpen}   onClose={() => setEditOpen(false)}   event={event} />
      <EventComments
        eventId={event.id}
        currentUserId={currentUserId}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </>
  );
};