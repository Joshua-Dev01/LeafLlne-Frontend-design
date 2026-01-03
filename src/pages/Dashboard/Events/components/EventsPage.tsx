import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "../../../../components/ui/button";
import { useEvents } from "../hooks/eventHooks";
import { EventCard } from "./Events";
import { EventCardSkeleton } from "./EventCardSkeleton";
import { EventSearchBar } from "./SearchEvents";

import type { Event } from "../types/eventsTypes";
import { EmptyState } from "../../../../components/Empty/EmptyState";
import LoadingError from "../../../../components/errors/LoadingError";
import EventsTabs from "./EventsTabs";
import { MyEventCard } from "./MyEvents";

const emptyEvent = {} as Event;

export const EventsPage = () => {
  const {
    data,
    isLoading: initialLoading,
    isError,
    refetch,
  } = useEvents("page=1&limit=10");

  const [events, setEvents] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const isLoading = initialLoading || isSearching;



  return (
    <div className="font-sans">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-10">
        <p className="font-bold text-[20px]">List of Events</p>

        <Link to="create-event">
          <Button className="bg-blue-950 text-white cursor-pointer dark:bg-transparent dark:border dark:border-gray-500">
            Create Event
          </Button>
        </Link>
      </div>

      {/* ================= SEARCH ================= */}
      <EventSearchBar
        onResults={(data) => {
          setEvents(data.events);
          setPagination({
            total: data.total,
            page: data.page,
            pages: data.pages,
          });
        }}
        onLoading={setIsSearching}
      />

      <EventsTabs
        allEvents={<EventCard event={emptyEvent} currentUserId="yourUserId" />}
        myEvents={<MyEventCard event={emptyEvent} currentUserId="yourUserId" />}
      />

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
