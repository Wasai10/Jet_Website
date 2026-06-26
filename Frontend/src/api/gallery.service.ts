import { request, tokenStore, authService } from "./auth.service";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// ── Types ────────────────────────────────────────────────────────────────────

export type PhotoCategory =
  | "Worship"
  | "Community"
  | "Events"
  | "Youth"
  | "Outreach"
  | "General";

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  "Worship",
  "Community",
  "Events",
  "Youth",
  "Outreach",
  "General",
];

export interface Photo {
  id: string;
  url: string;
  publicId: string;
  title: string;
  alt: string;
  category: PhotoCategory;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadPhotoMetadata {
  title: string;
  alt: string;
  category?: PhotoCategory;
  featured?: boolean;
}

export interface UpdatePhotoPayload {
  title?: string;
  alt?: string;
  category?: PhotoCategory;
  featured?: boolean;
}

// ── Multipart upload helper ───────────────────────────────────────────────────
// The shared `request` client only speaks JSON. File uploads need FormData,
// so we handle auth + one auto-refresh retry manually here.

async function fetchWithAuth(url: string, init: RequestInit, retry = true): Promise<Response> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  const access = tokenStore.getAccess();
  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && retry) {
    try {
      await authService.refresh();
    } catch {
      throw new Error("Session expired. Please log in again.");
    }
    return fetchWithAuth(url, init, false);
  }

  return res;
}

// ── Gallery API ───────────────────────────────────────────────────────────────

export const galleryService = {
  async getAll(category?: string): Promise<Photo[]> {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    const data = await request<{ photos: Photo[] }>("GET", `/gallery${qs}`);
    return data.photos;
  },

  async getById(id: string): Promise<Photo> {
    const data = await request<{ photo: Photo }>("GET", `/gallery/${id}`);
    return data.photo;
  },

  async upload(file: File, metadata: UploadPhotoMetadata): Promise<Photo> {
    const form = new FormData();
    form.append("image", file);
    form.append("title", metadata.title);
    form.append("alt", metadata.alt);
    if (metadata.category) form.append("category", metadata.category);
    if (metadata.featured !== undefined) form.append("featured", String(metadata.featured));

    const res = await fetchWithAuth(`${BASE_URL}/gallery`, { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? `Upload failed: ${res.status}`);
    return (data as { photo: Photo }).photo;
  },

  async update(id: string, payload: UpdatePhotoPayload): Promise<Photo> {
    const data = await request<{ message: string; photo: Photo }>("PUT", `/gallery/${id}`, payload);
    return data.photo;
  },

  async remove(id: string): Promise<Photo> {
    const data = await request<{ message: string; photo: Photo }>("DELETE", `/gallery/${id}`);
    return data.photo;
  },
};
