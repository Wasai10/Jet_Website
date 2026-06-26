import { request } from "./auth.service";

// ── Types ────────────────────────────────────────────────────────────────────

export type EventType = "UPCOMING" | "PAST" | "HOME_FELLOWSHIP";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time?: string | null;
  tag?: string | null;
  color?: string | null;
  featured: boolean;
  images?: string[] | null;
  type: EventType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  date: string;
  time?: string;
  tag?: string;
  color?: string;
  featured?: boolean;
  images?: string[];
  type?: EventType;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  tag?: string;
  color?: string;
  featured?: boolean;
  images?: string[];
  type?: EventType;
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
};
