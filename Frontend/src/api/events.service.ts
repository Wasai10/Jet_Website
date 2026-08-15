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

export const eventsService = {
  async getAll(): Promise<Event[]> {
    const data = await request<{ events: Event[] }>("GET", "/events");
    return data.events;
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
