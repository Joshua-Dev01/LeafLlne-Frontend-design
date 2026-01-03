import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Check, MoreHorizontal, Users } from "lucide-react";
import { BsCalendarEventFill } from "react-icons/bs";
import { PiUsersFill } from "react-icons/pi";

import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";

import { useToggleInterested, useToggleGoing } from "../hooks/eventHooks";
import type { Event } from "../types/eventsTypes";
import DeleteEventModal from "./DeleteEventModal";

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
  const capacity = typeof event.capacity === "number" && event.capacity > 0 ? event.capacity : 100;
  const attendancePercent = Math.min((goingUsers.length / capacity) * 100, 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white dark:bg-[#1f1f23] rounded-3xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden"
      >
        {/* TOP COUNTERS */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2c2c30] px-2 py-1 rounded-full">
            <Bell size={14} />
            <span className="text-sm font-medium">
              {interestedUsers.length}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2c2c30] px-2 py-1 rounded-full">
            <PiUsersFill size={14} />
            <span className="text-sm font-medium">{goingUsers.length}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full bg-white dark:bg-[#2c2c30]">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BsCalendarEventFill size={16} className="text-purple-600" />
            <span>{new Date(event.date).toDateString()}</span>
          </div>

          <h2 className="text-lg font-bold line-clamp-2">{event.title}</h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {event.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-red-500" />
            <span>{event.location}</span>
          </div>

          {/* ATTENDANCE BAR */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full">
              <div
                className="bg-indigo-600 h-2 transition-all"
                style={{ width: `${attendancePercent}%` }}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              onClick={handleInterestedClick}
              className={`rounded-xl ${
                isNotified
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : isInterested
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-slate-800 hover:bg-slate-900"
              }`}
            >
              {isNotified ? <Bell size={16} /> : <Check size={16} />}
              {isNotified
                ? "Notified"
                : isInterested
                ? "Interested"
                : "Interest"}
            </Button>

            <Button
              onClick={handleGoingClick}
              className={`rounded-xl ${
                isGoing
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-800 hover:bg-slate-900"
              }`}
            >
              <Users size={16} />
              {isGoing ? "Going" : "Attend"}
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
