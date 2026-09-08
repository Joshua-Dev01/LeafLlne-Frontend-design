import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCommentApi,
  createEventApi,
  deleteCommentApi,
  deleteEventApi,
  getAllEventsApi,
  getCommentsApi,
  getGoingEventsApi,
  getMyEventsApi,
  toggleGoingApi,
  toggleInterestApi,
  toggleLikeApi,
  updateEventApi,
} from "../apis/eventsApi";
import type { CreateEventPayload } from "../types/eventsTypes";

export const useAllEvents = (q = "") =>
  useQuery({
    queryKey: ["events", q],
    queryFn: () => getAllEventsApi(q),
    staleTime: 30_000,
  });
export const useMyEvents = () =>
  useQuery({
    queryKey: ["my-events"],
    queryFn: getMyEventsApi,
    staleTime: 30_000,
  });
export const useGoingEvents = () =>
  useQuery({
    queryKey: ["going-events"],
    queryFn: getGoingEventsApi,
    staleTime: 30_000,
  });
export const useComments = (id: string, enabled = false) =>
  useQuery({
    queryKey: ["comments", id],
    queryFn: () => getCommentsApi(id),
    enabled,
    staleTime: 30_000,
  });

export const useCreateEvent = (onSuccess?: () => void) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      toast.success("Event created!");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["my-events"] });
      onSuccess?.();
    },
    onError: () => toast.error("Failed to create event"),
  });
};

export const useUpdateEvent = (onSuccess?: () => void) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEventPayload>;
    }) => updateEventApi(id, data),
    onSuccess: () => {
      toast.success("Event updated!");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["my-events"] });
      onSuccess?.();
    },
    onError: () => toast.error("Failed to update event"),
  });
};

export const useDeleteEvent = (onSuccess?: () => void) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["my-events"] });
      onSuccess?.();
    },
    onError: () => toast.error("Failed to delete event"),
  });
};

export const useToggleInterest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleInterestApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
};

export const useToggleGoing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleGoingApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["going-events"] });
    },
    onError: (e: Error) => {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const error = e as ErrorResponse;
      if (error?.response?.data?.message === "Event is full")
        toast.error("This event is full!");
    },
  });
};

export const useAddComment = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { text: string; parentId?: string }) =>
      addCommentApi(eventId, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", eventId] }),
    onError: () => toast.error("Failed to post comment"),
  });
};

export const useDeleteComment = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cid: string) => deleteCommentApi(eventId, cid),
    onSuccess: () => {
      toast.success("Comment deleted");
      qc.invalidateQueries({ queryKey: ["comments", eventId] });
    },
  });
};

export const useToggleLike = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cid: string) => toggleLikeApi(eventId, cid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", eventId] }),
  });
};
