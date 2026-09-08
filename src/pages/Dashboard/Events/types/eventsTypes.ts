export type EventStatus   = "upcoming" | "live" | "ended";
export type EventCategory =
  | "Academic" | "Campus Life" | "Career" | "Competition"
  | "Social"   | "Cultural"   | "Sports" | "Other";
export type EventMode = "physical" | "online" | "hybrid";

export interface Event {
  id:          string;
  title:       string;
  description: string;
  category:    EventCategory;
  mode:        EventMode;
  image?:      string;
  createdBy:   string;
  creatorName: string;
  date:        string;
  startTime:   string;
  endTime?:    string;
  location?:   string;
  onlineLink?: string;
  capacity?:   number;
  spotsLeft?:  number | null;
  isFull?:     boolean;
  interestedUsers: string[];
  goingUsers:      string[];
  status:          EventStatus;
  createdAt:   string;
  updatedAt:   string;
}

export interface PaginatedEvents {
  total: number; page: number; pages: number; events: Event[];
}

export interface CreateEventPayload {
  title:       string;
  description: string;
  category:    EventCategory | "";
  mode:        EventMode;
  startTime:   string;
  endTime:     string;
  location:    string;
  onlineLink:  string;
  capacity:    string;
  image:       File | null;
}

export interface Comment {
  id: string; eventId: string; userId: string; userName: string;
  userAvatar?: string; text: string; likes: string[];
  parentId?: string | null; replyCount?: number;
  createdAt: string; updatedAt: string;
}

export interface PaginatedComments {
  total: number; page: number; pages: number;
  comments?: Comment[]; replies?: Comment[];
}

export interface ShareLinkResponse {
  shareLink: string;
  shareUrls: { whatsapp: string; twitter: string; telegram: string; copy: string };
  og: { title: string; description: string; image: string; url: string };
}