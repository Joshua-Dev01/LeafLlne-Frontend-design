import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Check, MoreHorizontal, Users, Calendar } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";

import { useToggleInterested, useToggleGoing } from "../hooks/eventHooks";
import type { Event } from "../types/eventsTypes";
import DeleteEventModal from "./DeleteEventModal";
import { Button } from "../../../../components/ui/button";

interface Props {
  event: Event;
  currentUserId: string;
}

export const EventCard = ({ event, currentUserId }: Props) => {
  const toggleInterested = useToggleInterested();
  const toggleGoing = useToggleGoing();

  const [interestedUsers, setInterestedUsers] = useState<string[]>([]);
  const [goingUsers, setGoingUsers] = useState<string[]>([]);
  const [isInterested, setIsInterested] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setInterestedUsers(event.interestedUsers || []);
    setGoingUsers(event.goingUsers || []);
    setIsInterested(event.interestedUsers?.includes(currentUserId) || false);
    setIsGoing(event.goingUsers?.includes(currentUserId) || false);
  }, [event, currentUserId]);

  /* =======================
      INTEREST HANDLER
     ======================= */
  const handleInterestedClick = () => {
    // Interest → Notified → Remove
    if (!isInterested) {
      setIsInterested(true);
      setIsNotified(false);
      setInterestedUsers((prev) => [...prev, currentUserId]);
      toggleInterested.mutate(event.id);
      return;
    }

    if (isInterested && !isNotified) {
      setIsNotified(true);
      return;
    }

    setIsInterested(false);
    setIsNotified(false);
    setInterestedUsers((prev) => prev.filter((id) => id !== currentUserId));
    toggleInterested.mutate(event.id);
  };

  /* =======================
      GOING HANDLER
     ======================= */
  const handleGoingClick = () => {
    const prevUsers = [...goingUsers];
    const prevState = isGoing;

    const updatedUsers = isGoing
      ? prevUsers.filter((id) => id !== currentUserId)
      : [...prevUsers, currentUserId];

    setGoingUsers(updatedUsers);
    setIsGoing(!isGoing);

    toggleGoing.mutate(event.id, {
      onError: () => {
        setGoingUsers(prevUsers);
        setIsGoing(prevState);
      },
    });
  };

  /* =======================
      ATTENDANCE %
     ======================= */
  const capacity =
    typeof event.capacity === "number" && event.capacity > 0
      ? event.capacity
      : 100;
  const attendancePercent = Math.min((goingUsers.length / capacity) * 100, 100);

  // Format date more elegantly
  const eventDate = new Date(event.date);
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const year = eventDate.getFullYear();
  const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/20 border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all duration-300"
      >
        {/* Gradient accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
        
        {/* Header with date badge and menu */}
        <div className="relative px-6 pt-5 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            {/* Date Badge */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 text-white">
                <span className="text-xs font-semibold uppercase">{monthDay.split(' ')[0]}</span>
                <span className="text-lg font-bold leading-none">{monthDay.split(' ')[1]}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Event Date</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{year}</span>
              </div>
            </div>

            {/* Stats and Menu */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <Bell size={14} className="flex-shrink-0" />
                <span className="text-sm font-semibold">{interestedUsers.length}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                <Users size={14} className="flex-shrink-0" />
                <span className="text-sm font-semibold">{goingUsers.length}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                    <MoreHorizontal size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-5">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Location and Time */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center w-8 h-8 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
                <MapPin size={16} className="text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-sm font-medium">{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">{time}</span>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Attendance
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {goingUsers.length} / {capacity}
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleInterestedClick}
              className={`h-11 rounded-xl font-semibold transition-all duration-200 ${
                isNotified
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30"
                  : isInterested
                  ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {isNotified ? (
                  <Bell size={16} className="fill-current" />
                ) : (
                  <Check size={16} />
                )}
                <span className="text-sm">
                  {isNotified ? "Notified" : isInterested ? "Interested" : "Interest"}
                </span>
              </div>
            </Button>

            <Button
              onClick={handleGoingClick}
              className={`h-11 rounded-xl font-semibold transition-all duration-200 ${
                isGoing
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm">{isGoing ? "Going" : "Attend"}</span>
              </div>
            </Button>
          </div>
        </div>
      </motion.div>

      <DeleteEventModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        event={event}
      />
    </>
  );
};