import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Bell, Check, Users, Calendar,
  Share2, MessageCircle, MoreVertical, Pencil, Trash2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { useToggleInterested, useToggleGoing } from "../hooks/eventHooks";
import type { Event } from "../types/eventsTypes";
import DeleteEventModal from "./DeleteEventModal";
import { ShareEventModal } from "./Shareeventmodal ";
import { EditEventModal } from "./EditEventModal";
import { EventComments } from "./Eventcomments ";


interface Props {
  event: Event;
  currentUserId: string;
}

/* ── Status badge config ─────────────────────────────────────────── */
const statusConfig = {
  upcoming: { label: "Upcoming",  bg: "bg-blue-50 dark:bg-blue-950/40",  text: "text-blue-600 dark:text-blue-400",  dot: "bg-blue-500" },
  ongoing:  { label: "Live Now",  bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  ended:    { label: "Ended",     bg: "bg-slate-100 dark:bg-white/6",     text: "text-slate-500 dark:text-white/40", dot: "bg-slate-400" },
};

export const EventCard = ({ event, currentUserId }: Props) => {
  const toggleInterested = useToggleInterested();
  const toggleGoing      = useToggleGoing();

  const [interestedUsers, setInterestedUsers] = useState<string[]>([]);
  const [goingUsers,      setGoingUsers]      = useState<string[]>([]);
  const [isInterested,    setIsInterested]    = useState(false);
  const [isNotified,      setIsNotified]      = useState(false);
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

  /* Interest: Interest → Notified → Remove */
  const handleInterested = () => {
    if (!isInterested) {
      setIsInterested(true); setIsNotified(false);
      setInterestedUsers((p) => [...p, currentUserId]);
      toggleInterested.mutate(event.id);
    } else if (!isNotified) {
      setIsNotified(true);
    } else {
      setIsInterested(false); setIsNotified(false);
      setInterestedUsers((p) => p.filter((id) => id !== currentUserId));
      toggleInterested.mutate(event.id);
    }
  };

  const handleGoing = () => {
    const prev = [...goingUsers];
    const prevState = isGoing;
    setGoingUsers(isGoing ? prev.filter((id) => id !== currentUserId) : [...prev, currentUserId]);
    setIsGoing(!isGoing);
    toggleGoing.mutate(event.id, {
      onError: () => { setGoingUsers(prev); setIsGoing(prevState); },
    });
  };

  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
  const day   = eventDate.getDate();
  const time  = eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const status = statusConfig[event.status ?? "upcoming"];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="
          group relative flex flex-col bg-white dark:bg-[#0F1A2E]
          rounded-2xl overflow-hidden
          border border-slate-100 dark:border-white/6
          shadow-sm hover:shadow-lg dark:hover:shadow-black/30
          transition-all duration-300
        "
      >
        {/* Banner image */}
        {event.image ? (
          <div className="relative h-40 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Status badge on image */}
            <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/90 dark:bg-black/60 ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${event.status === "ongoing" ? "animate-pulse" : ""}`} />
              {status.label}
            </div>

            {/* Date badge on image */}
            <div className="absolute bottom-3 left-3 flex flex-col items-center justify-center w-11 h-11 bg-[#0A1931] rounded-xl shadow-lg">
              <span className="text-[9px] font-bold uppercase text-blue-300 leading-none">{month}</span>
              <span className="text-base font-black text-white leading-none">{day}</span>
            </div>
          </div>
        ) : (
          /* No-image header */
          <div className="relative h-20 bg-gradient-to-br from-[#0A1931] to-[#1e3a8a] flex items-end px-4 pb-3">
            <div className={`absolute top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 ${status.text} text-white/90`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${event.status === "ongoing" ? "animate-pulse" : ""}`} />
              {status.label}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center w-10 h-10 bg-white/15 rounded-xl">
                <span className="text-[9px] font-bold uppercase text-blue-200 leading-none">{month}</span>
                <span className="text-sm font-black text-white leading-none">{day}</span>
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          {/* Topic tag */}
          {event.topic && (
            <span className="inline-block self-start text-[10px] font-bold uppercase tracking-widest text-[#0A1931] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md mb-2 font-['DM_Sans',sans-serif]">
              {event.topic}
            </span>
          )}

          {/* Title */}
          <h3 className="font-bold text-[15px] text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1 font-['DM_Sans',sans-serif]">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-white/40 line-clamp-2 mb-3 leading-relaxed font-['DM_Sans',sans-serif]">
            {event.description}
          </p>

          {/* Meta row */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-white/50">
              <Calendar size={12} className="flex-shrink-0" />
              <span className="text-xs font-medium font-['DM_Sans',sans-serif]">{time}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-white/50">
                <MapPin size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium font-['DM_Sans',sans-serif] truncate">{event.location}</span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
              <Bell size={12} />
              <span>{interestedUsers.length} interested</span>
            </div>
            <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
              <Users size={12} />
              <span>{goingUsers.length} going</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-auto">
            {/* Interested */}
            <button
              onClick={handleInterested}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 font-['DM_Sans',sans-serif] ${
                isNotified
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : isInterested
                  ? "bg-[#0A1931] text-white shadow-md shadow-[#0A1931]/20"
                  : "bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {isNotified ? <Bell size={12} className="fill-current" /> : <Check size={12} />}
              {isNotified ? "Notified" : isInterested ? "Interested" : "Interest"}
            </button>

            {/* Going */}
            <button
              onClick={handleGoing}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 font-['DM_Sans',sans-serif] ${
                isGoing
                  ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                  : "bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              <Users size={12} />
              {isGoing ? "Going ✓" : "Attend"}
            </button>
          </div>
        </div>

        {/* Footer — comment, share, more */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-50 dark:border-white/4">
          <div className="flex items-center gap-1">
            {/* Comments */}
            <button
              onClick={() => setCommentsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/6 hover:text-slate-700 dark:hover:text-white transition-colors font-['DM_Sans',sans-serif]"
            >
              <MessageCircle size={13} />
              Discuss
            </button>

            {/* Share */}
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/6 hover:text-slate-700 dark:hover:text-white transition-colors font-['DM_Sans',sans-serif]"
            >
              <Share2 size={13} />
              Share
            </button>
          </div>

          {/* More menu (owner only) */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/6 text-slate-400 dark:text-white/30 transition-colors">
                  <MoreVertical size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 dark:border-white/8 bg-white dark:bg-[#0F1A2E]">
                <DropdownMenuItem
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 text-sm font-['DM_Sans',sans-serif] cursor-pointer"
                >
                  <Pencil size={13} />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-2 text-sm text-red-500 font-['DM_Sans',sans-serif] cursor-pointer focus:text-red-500"
                >
                  <Trash2 size={13} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Creator */}
        <div className="px-4 pb-3">
          <p className="text-[10px] text-slate-400 dark:text-white/25 font-['DM_Sans',sans-serif]">
            by <span className="font-semibold">{event.creatorName}</span>
          </p>
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