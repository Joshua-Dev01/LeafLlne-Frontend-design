import { EventCardSkeleton } from "./EventCardSkeleton";
import { EmptyState } from "../../../../components/Empty/EmptyState";
import LoadingError from "../../../../components/errors/LoadingError";

import type { Event } from "../types/eventsTypes";
import { EventCard } from "./Events";

interface Props {
  events: Event[];
  currentUserId: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const EventCardList = ({
  events,
  currentUserId,
  isLoading,
  isError,
  onRetry,
}: Props) => {
  if (isError) {
    return (
      <div className="mt-10">
        <LoadingError onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 mt-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="mt-10">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 mt-10">
      {events.map((event) => (
        <EventCard key={event.id} event={event} currentUserId={currentUserId} />
      ))}
    </div>
  );
};
