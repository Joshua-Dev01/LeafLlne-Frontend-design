import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Check, MoreHorizontal } from "lucide-react";
import { BsCalendarEventFill } from "react-icons/bs";
import { PiUsersFill } from "react-icons/pi";

import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";

import { useToggleInterested } from "../hooks/eventHooks";
import type { Event } from "../types/eventsTypes";
import DeleteEventModal from "./DeleteEventModal";

interface Props {
  event: Event;
  currentUserId: string;
}

export const MyEventCard = ({ event, currentUserId }: Props) => {
  const toggleInterested = useToggleInterested();

  const [interestedUsers, setInterestedUsers] = useState<string[]>([]);
  const [isInterested, setIsInterested] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setInterestedUsers(event.interestedUsers || []);
    setIsInterested(event.interestedUsers?.includes(currentUserId) || false);
  }, [event.interestedUsers, currentUserId]);

  const handleToggleInterest = () => {
    const prevUsers = [...interestedUsers];
    const prevState = isInterested;

    const updatedUsers = isInterested
      ? prevUsers.filter((id) => id !== currentUserId)
      : [...prevUsers, currentUserId];

    setInterestedUsers(updatedUsers);
    setIsInterested(!isInterested);

    toggleInterested.mutate(event.id, {
      onError: () => {
        setInterestedUsers(prevUsers);
        setIsInterested(prevState);
      },
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        className="
          relative bg-white dark:bg-[#1f1f23]
          rounded-3xl shadow-lg border border-gray-100 dark:border-zinc-700
          overflow-hidden transition-all
        "
      >
        {/* TOP CONTROLS */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full bg-white dark:bg-[#2c2c30] shadow-sm hover:scale-105 transition-transform">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-red-500 focus:text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2c2c30] px-2 py-1 rounded-full shadow-sm">
            <PiUsersFill
              size={14}
              className="text-gray-500 dark:text-gray-300"
            />
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {interestedUsers.length}
            </span>
          </div>
        </div>

        {/* CATEGORY TAG */}
        {event.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-md">
            {event.category}
          </span>
        )}

        {/* MAIN CONTENT */}
        <div className="p-5 flex flex-col gap-3">
          {/* DATE */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BsCalendarEventFill size={16} className="text-purple-600" />
            <span>{new Date(event.date).toDateString()}</span>
          </div>

          {/* TITLE */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {event.description}
          </p>

          {/* LOCATION */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <MapPin size={16} className="text-red-500" />
            <span>{event.location}</span>
          </div>

          {/* ATTENDANCE */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Attendance
            </p>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Number(event.goingUsers?.length || 0) /
                      Number(event.capacity || 100)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* INTEREST BUTTON */}
          <Button
            onClick={handleToggleInterest}
            className={`
              w-full flex items-center justify-center gap-2 mt-3
              px-4 py-2 rounded-2xl text-sm font-medium
              transition-all shadow-md
              ${
                isInterested
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }
            `}
          >
            {isInterested ? <Bell size={16} /> : <Check size={16} />}
            {isInterested ? "Notified" : "Interested"}
          </Button>
        </div>
      </motion.div>

      {/* DELETE MODAL */}
      <DeleteEventModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        event={event}
      />
    </>
  );
};
