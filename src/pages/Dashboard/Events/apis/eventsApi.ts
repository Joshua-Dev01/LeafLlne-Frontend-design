import { apiDelete, apiGet, apiPost } from "../../../../services/apiCall";
import type { CreateEventPayload, PaginatedEvents } from "../types/eventsTypes";


// GET all events (with pagination + search + sort)
export const getAllEventsApi = async (query: string): Promise<PaginatedEvents> => {
    return await apiGet(`/events?${query}`);
};

// GET my events
export const getMyEventsApi = async (): Promise<Event[]> => {
    return await apiGet("/events/mine");
};

// CREATE event (with image)
export const createEventApi = async (data: CreateEventPayload): Promise<Event> => {
    const form = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        // Files or blobs can be appended directly
        if (val instanceof File || val instanceof Blob) {
            form.append(key, val);
            return;
        }

        // Arrays: append each entry; files handled above, primitives/stringify others
        if (Array.isArray(val)) {
            val.forEach((item) => {
                if (item === undefined || item === null) return;
                if (item instanceof File || item instanceof Blob) {
                    form.append(key, item);
                } else {
                    form.append(`${key}[]`, String(item));
                }
            });
            return;
        }

        // Objects: serialize to JSON
        if (typeof val === "object") {
            form.append(key, JSON.stringify(val));
            return;
        }

        // Primitives: convert to string
        form.append(key, String(val));
    });

    return await apiPost<Event, FormData>("/events/create-event", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Toggle interested
export const toggleInterestedApi = async (id: string): Promise<Event> => {
    return await apiPost(`/events/${id}/interested`, {});
};

// Toggle going
export const toggleGoingApi = async (id: string): Promise<Event> => {
    return await apiPost(`/events/${id}/going`, {});
};

// Delete event
export const deleteEventApi = async (id: string): Promise<{ message: string }> => {
    return await apiDelete(`/events/${id}`);
};
