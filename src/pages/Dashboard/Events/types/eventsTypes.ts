// src/services/events/types/Event.ts

export interface Event {
    id: string;
    title: string;
    description: string;
    topic: string;
    image?: string;
    createdBy: string;
    creatorName: string;
    date: string;
    location: string;
    interestedUsers: string[];
    goingUsers: string[];
    status: string;
    reminderSent: boolean;
    createdAt: string;
    updatedAt: string;
    category?: string;
    creatorPic?: string;
    capacity?: boolean;
    isLoading?: boolean;
   
}

export interface CreateEventPayload {
    title: string;
    description: string;
    topic: string;
    date: string;
    location: string;
    image?: File | null;
}

export interface PaginatedEvents {
    total: number;
    page: number;
    pages: number;
    events: Event[];
}
