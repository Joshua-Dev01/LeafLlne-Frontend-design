import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventApi, deleteEventApi, getAllEventsApi, getMyEventsApi, toggleGoingApi, toggleInterestedApi } from "../apis/eventsApi";
import { handleResponse } from "../../../../utils/handleErrors";


// GET all events
export const useEvents = (query: string) =>
    useQuery({
        queryKey: ["events", query],
        queryFn: () => getAllEventsApi(query),
    });

// GET created events
export const useMyEvents = () =>
    useQuery({
        queryKey: ["myEvents"],
        queryFn: getMyEventsApi,
    });

// CREATE event
export const useCreateEvent = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: createEventApi,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => handleResponse({ error }),
    });
};

// Toggle interested
export const useToggleInterested = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: toggleInterestedApi,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => handleResponse({ error }),
    });
};

// Toggle going
export const useToggleGoing = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: toggleGoingApi,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => handleResponse({ error }),
    });
};

// Delete
export const useDeleteEvent = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: deleteEventApi,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => handleResponse({ error }),
    });
};
