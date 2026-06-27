import { request, tokenStore } from "./auth.service";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  imagePublicId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ── Multipart helper ──────────────────────────────────────────────────────────

async function fetchWithAuth(url: string, init: RequestInit): Promise<Response> {
  const access = tokenStore.getAccess();
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (access) headers["Authorization"] = `Bearer ${access}`;
  return fetch(url, { ...init, headers });
}

// ── Service ───────────────────────────────────────────────────────────────────

export const leadershipService = {
  async getAll(): Promise<Leader[]> {
    const data = await request<{ leaders: Leader[] }>("GET", "/leadership");
    return data.leaders;
  },

  async getById(id: string): Promise<Leader> {
    const data = await request<{ leader: Leader }>("GET", `/leadership/${id}`);
    return data.leader;
  },

  async create(form: FormData): Promise<Leader> {
    const res = await fetchWithAuth(`${BASE_URL}/leadership`, { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Create failed.");
    return (data as { leader: Leader }).leader;
  },

  async update(id: string, form: FormData): Promise<Leader> {
    const res = await fetchWithAuth(`${BASE_URL}/leadership/${id}`, { method: "PUT", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Update failed.");
    return (data as { leader: Leader }).leader;
  },

  async remove(id: string): Promise<Leader> {
    const data = await request<{ leader: Leader }>("DELETE", `/leadership/${id}`);
    return data.leader;
  },
};
