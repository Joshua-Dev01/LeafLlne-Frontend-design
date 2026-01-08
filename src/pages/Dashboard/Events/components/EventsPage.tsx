import { useEffect, useState } from "react";

import { useEvents } from "../hooks/eventHooks";
import { EventCard } from "./Events";
import { EventCardSkeleton } from "./EventCardSkeleton";

import type { Event } from "../types/eventsTypes";
import { EmptyState } from "../../../../components/Empty/EmptyState";
import LoadingError from "../../../../components/errors/LoadingError";

export const EventsPage = () => {
  const {
    data,
    isLoading: initialLoading,
    isError,
    refetch,
  } = useEvents("page=1&limit=10");

  const [events, setEvents] = useState<Event[]>([]);

  const [, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  /* ---------------------------------------------
   * Sync initial API data
   * -------------------------------------------- */
  useEffect(() => {
    if (!data) return;

    setEvents(data.events ?? []);
    setPagination({
      total: data.total ?? 0,
      page: data.page ?? 1,
      pages: data.pages ?? 1,
    });
  }, [data]);

  const isLoading = initialLoading;

  return (
    <div className="font-sans">
      {/* ================= ERROR ================= */}
      {isError && (
        <div className="mt-10">
          <LoadingError onRetry={refetch} />
        </div>
      )}

      {/* ================= EVENTS GRID ================= */}
      {!isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 mt-10">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))
            : events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId="yourUserId"
                />
              ))}
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}
      {!isLoading && !isError && events.length === 0 && (
        <div className="mt-10">
          <EmptyState />
        </div>
      )}
    </div>
  );
};
