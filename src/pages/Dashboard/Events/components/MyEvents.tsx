import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "../types/eventsTypes";
import { getMyEventsApi } from "../apis/eventsApi";
import { Button } from "../../../../components/ui/button";
import { EmptyState } from "../../../../components/Empty/EmptyState";
import DeleteEventModal from "./DeleteEventModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const MyEvents = () => {
      const [deleteOpen, setDeleteOpen] = useState(false);
    
  /** =========================
   * Fetch My Events
   ========================= */
  const { data, isLoading, isError, refetch } = useQuery<Event[]>({
    queryKey: ["my-events"],
    queryFn: getMyEventsApi,
    retry: 2,
    staleTime: 1000 * 60,
  });

  /** =========================
   * Delete Event
   ========================= */

  /** =========================
   * Skeleton
   ========================= */
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 animate-pulse space-y-3"
          >
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-3/4" />
            <div className="flex justify-between items-center pt-3">
              <div className="h-3 bg-gray-300 rounded w-24" />
              <div className="h-8 bg-gray-300 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /** =========================
   * Error state
   ========================= */
  if (isError) {
    return (
      <div className="text-center space-y-3">
        <p className="text-red-500">Failed to load your events</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  /** =========================
   * Empty state
   ========================= */
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <EmptyState />
      </div>
    );
  }

  /** =========================
   * Events list
   ========================= */
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((event: Event) => (
        <div
          key={event.id}
          className="rounded-xl border p-4 space-y-3 hover:shadow transition"
        >
          <h3 className="font-semibold text-lg">{event.title}</h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {new Date(event.date).toLocaleDateString()}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {event.location}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3">
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
              {event.status}
            </span>

            <DeleteEventModal
              open={deleteOpen}
              onClose={() => setDeleteOpen(false)}
              event={event}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyEvents;
