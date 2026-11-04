import { request, tokenStore } from "./auth.service";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

// ── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "UPCOMING" | "PAST" | "HOME_FELLOWSHIP"
  | "WORSHIP" | "CONFERENCE" | "OUTREACH" | "YOUTH" | "PRAYER" | "SPECIAL";

export type EventOwnership = "JET" | "PARTNERSHIP";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  endDate?: string | null;
  time?: string | null;
  tag?: string | null;
  color?: string | null;
  featured: boolean;
  coverImage?: string | null;
  images?: string[] | null;
  type: EventType;
  ownership?: EventOwnership | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  date: string;
  endDate?: string | null;
  time?: string;
  tag?: string;
  color?: string;
  featured?: boolean;
  coverImage?: string;
  images?: string[];
  type?: EventType;
  ownership?: EventOwnership;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  endDate?: string | null;
  time?: string;
  tag?: string;
  color?: string;
  featured?: boolean;
  coverImage?: string;
  images?: string[];
  type?: EventType;
  ownership?: EventOwnership;
}

export interface EventRsvpPayload {
  fullName: string;
  email: string;
  phone?: string;
  guests: number;
  notes?: string;
}

export interface EventRsvp extends EventRsvpPayload {
  id: string;
  eventId: string;
  createdAt: string;
  event?: {
    id: string;
    title: string;
    date: string;
    location: string;
    type: string;
  };
}

// ── Events API ───────────────────────────────────────────────────────────────


// ── Canonical Event Categories ───────────────────────────────────────────────

export const EVENT_CATEGORIES = [
  {
    name: "Ossen Girls Mission",
    label: "Ossen Girls Mission",
    status: "PAST" as const,
    tag: "Mission",
    color: "#22C55E",
  },
  {
    name: "Impact Conference",
    label: "Impact Conference",
    status: "PAST" as const,
    tag: "Conference",
    color: "#EC4899",
  },
  {
    name: "Vision Summit",
    label: "Vision Summit",
    status: "PAST" as const,
    tag: "Summit",
    color: "#6366F1",
  },
  {
    name: "International Women's Day",
    label: "International Women's Day",
    status: "UPCOMING" as const,
    tag: "Celebration",
    color: "#F59E0B",
  },
  {
    name: "Abacy Feed a Widow Initiative",
    label: "Abacy Feed a Widow Initiative",
    status: "UPCOMING" as const,
    tag: "Outreach",
    color: "#14B8A6",
  },
] as const;

export const CANONICAL_DEFAULT_EVENTS: Event[] = [
  {
    id: "evt-ossen-girls-mission",
    title: "Ossen Girls Mission",
    description: "A mission dedicated to empowering young girls through the love of Christ and community outreach.",
    location: "Ossen, Baringo County",
    date: "2024-06-15T09:00:00.000Z",
    type: "PAST",
    tag: "Mission",
    color: "#22C55E",
    featured: false,
    ownership: "JET",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-impact-conference",
    title: "Impact Conference",
    description: "An annual conference focused on creating lasting impact in society through faith and action.",
    location: "JET Main Auditorium",
    date: "2024-08-20T09:00:00.000Z",
    type: "PAST",
    tag: "Conference",
    color: "#EC4899",
    featured: false,
    ownership: "JET",
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-vision-summit",
    title: "Vision Summit",
    description: "A summit gathering leaders and members to align on the vision and direction of JET Ministries.",
    location: "JET Main Auditorium",
    date: "2024-10-10T09:00:00.000Z",
    type: "PAST",
    tag: "Summit",
    color: "#6366F1",
    featured: false,
    ownership: "JET",
    coverImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-international-womens-day",
    title: "International Women's Day",
    description: "A special celebration honouring women in the ministry and the community, highlighting their strength and contributions.",
    location: "JET Main Auditorium",
    date: "2025-03-08T09:00:00.000Z",
    type: "UPCOMING",
    tag: "Celebration",
    color: "#F59E0B",
    featured: true,
    ownership: "JET",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-abacy-feed-widow",
    title: "Abacy Feed a Widow Initiative",
    description: "An outreach initiative dedicated to feeding and caring for widows in the community, showing the love of Christ in action.",
    location: "Abacy Community Center",
    date: "2025-04-20T09:00:00.000Z",
    type: "UPCOMING",
    tag: "Outreach",
    color: "#14B8A6",
    featured: false,
    ownership: "JET",
    coverImage: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const eventsService = {
  async getAll(): Promise<Event[]> {
    try {
      const data = await request<{ events: Event[] }>("GET", "/events");
      if (data?.events && data.events.length > 0) {
        return data.events;
      }
      return CANONICAL_DEFAULT_EVENTS;
    } catch {
      return CANONICAL_DEFAULT_EVENTS;
    }
  },

  async getById(id: string): Promise<Event> {
    const data = await request<{ event: Event }>("GET", `/events/${id}`);
    return data.event;
  },

  async create(payload: CreateEventPayload): Promise<Event> {
    const data = await request<{ message: string; event: Event }>("POST", "/events", payload);
    return data.event;
  },

  async update(id: string, payload: UpdateEventPayload): Promise<Event> {
    const data = await request<{ message: string; event: Event }>("PUT", `/events/${id}`, payload);
    return data.event;
  },

  async remove(id: string): Promise<Event> {
    const data = await request<{ message: string; event: Event }>("DELETE", `/events/${id}`);
    return data.event;
  },

  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${API_URL}/events/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenStore.getAccess() ?? ""}` },
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "Upload failed.");
    }
    const data = await res.json() as { url: string; publicId: string };
    return data;
  },

  async rsvp(id: string, payload: EventRsvpPayload): Promise<void> {
    await request("POST", `/events/${id}/rsvp`, payload);
  },

  async getRsvps(id: string): Promise<EventRsvp[]> {
    const data = await request<{ rsvps: EventRsvp[] }>("GET", `/events/${id}/rsvps`);
    return data.rsvps;
  },

  async getAllRsvps(): Promise<EventRsvp[]> {
    const data = await request<{ rsvps: EventRsvp[] }>("GET", "/events/rsvps/all");
    return data.rsvps;
  },
};
