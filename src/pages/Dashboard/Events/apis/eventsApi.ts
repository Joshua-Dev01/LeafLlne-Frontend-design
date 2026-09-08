import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "../../../../services/apiCall";
import type {
  CreateEventPayload,
  PaginatedComments,
  PaginatedEvents,
  ShareLinkResponse,
} from "../types/eventsTypes";

const toForm = (data: Partial<CreateEventPayload>): FormData => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") return;
    if (v instanceof File) {
      form.append(k, v);
      return;
    }
    form.append(k, String(v));
  });
  return form;
};

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export const getAllEventsApi = (q = ""): Promise<PaginatedEvents> =>
  apiGet(`/events?${q}`);
export const getMyEventsApi = (): Promise<Event[]> => apiGet("/events/mine");
export const getGoingEventsApi = (): Promise<Event[]> =>
  apiGet("/events/going");
export const getShareLinkApi = (id: string): Promise<ShareLinkResponse> =>
  apiGet(`/events/${id}/share`);

export const createEventApi = (data: CreateEventPayload) =>
  apiPost<{ event: Event }, FormData>("/events", toForm(data), MULTIPART);

export const updateEventApi = (id: string, data: Partial<CreateEventPayload>) =>
  apiPatch<{ event: Event }, FormData>(
    `/events/${id}`,
    toForm(data),
    MULTIPART,
  );

export const deleteEventApi = (id: string) =>
  apiDelete<{ message: string }>(`/events/${id}`);
export const toggleInterestApi = (id: string) =>
  apiPost<Event, object>(`/events/${id}/interest`, {});
export const toggleGoingApi = (id: string) =>
  apiPost<Event, object>(`/events/${id}/going`, {});

export const getCommentsApi = (
  id: string,
  page = 1,
): Promise<PaginatedComments> =>
  apiGet(`/events/${id}/comments?page=${page}&limit=20`);
export const getRepliesApi = (
  id: string,
  cid: string,
  page = 1,
): Promise<PaginatedComments> =>
  apiGet(`/events/${id}/comments/${cid}/replies?page=${page}`);
export const addCommentApi = (
  id: string,
  p: { text: string; parentId?: string },
): Promise<Comment> => apiPost(`/events/${id}/comments`, p);
export const deleteCommentApi = (id: string, cid: string) =>
  apiDelete<{ message: string }>(`/events/${id}/comments/${cid}`);
export const toggleLikeApi = (id: string, cid: string): Promise<Comment> =>
  apiPost(`/events/${id}/comments/${cid}/like`, {});
