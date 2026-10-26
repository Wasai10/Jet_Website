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
  const headers = new Headers(init.headers ?? {});
  if (access) headers.set("Authorization", `Bearer ${access}`);

  let res = await fetch(url, { ...init, headers });

  if (res.status !== 401) return res;

  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) {
    tokenStore.clearAll();
    throw new Error("Session expired. Please log in again.");
  }

  const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) {
    tokenStore.clearAll();
    throw new Error("Session expired. Please log in again.");
  }

  const refreshed = await refreshRes.json().catch(() => ({}));
  if (!refreshed || !refreshed.accessToken) {
    tokenStore.clearAll();
    throw new Error("Session expired. Please log in again.");
  }

  tokenStore.setTokens(refreshed);
  const retryHeaders = new Headers(init.headers ?? {});
  retryHeaders.set("Authorization", `Bearer ${refreshed.accessToken}`);

  return fetch(url, { ...init, headers: retryHeaders });
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
