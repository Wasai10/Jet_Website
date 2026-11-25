import { request, tokenStore, authService } from "./auth.service";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const TARGET_UPLOAD_BYTES = 9 * 1024 * 1024;

async function optimizeGalleryImage(file: File): Promise<File> {
  if (file.size <= TARGET_UPLOAD_BYTES) return file;

  if (["image/gif", "image/svg+xml"].includes(file.type)) {
    throw new Error("This image is too large to upload as-is. Please convert it to JPG, PNG, or WebP first.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This image could not be optimized. Please use a JPG, PNG, or WebP image.");
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare this image for upload.");

    const initialScale = Math.min(1, 2560 / Math.max(bitmap.width, bitmap.height));
    let width = Math.max(1, Math.round(bitmap.width * initialScale));
    let height = Math.max(1, Math.round(bitmap.height * initialScale));

    for (let resizeAttempt = 0; resizeAttempt < 8; resizeAttempt += 1) {
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);

      for (const quality of [0.88, 0.8, 0.72]) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp", quality)
        );
        if (blob && blob.size <= TARGET_UPLOAD_BYTES) {
          const optimized = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
            type: "image/webp",
            lastModified: file.lastModified,
          });
          if (optimized.size <= MAX_UPLOAD_BYTES) return optimized;
        }
      }

      width = Math.max(1, Math.round(width * 0.82));
      height = Math.max(1, Math.round(height * 0.82));
    }
  } finally {
    bitmap.close();
  }

  throw new Error("This image could not be reduced enough to upload. Please resize it and try again.");
}

// ── Gallery Categories Structure ─────────────────────────────────────────────

export interface GalleryCategoryConfig {
  id: string;
  name: string;
  subcategories: string[];
}

export const GALLERY_STRUCTURE: GalleryCategoryConfig[] = [
  {
    id: "outreach",
    name: "Outreach Ministry",
    subcategories: ["Outreach and Missions"],
  },
  {
    id: "womens",
    name: "Women's Ministry",
    subcategories: ["JET Ladies", "International Women's Day"],
  },
  {
    id: "fellowships",
    name: "House Fellowships",
    subcategories: ["House Fellowships"],
  },
];

export const MAIN_CATEGORIES = [
  "Outreach Ministry",
  "Women's Ministry",
  "House Fellowships",
];

export const ALL_SUBCATEGORIES = [
  "Outreach and Missions",
  "JET Ladies",
  "International Women's Day",
  "House Fellowships",
];

// Backwards-compatible category list for dropdowns
export const PHOTO_CATEGORIES = [
  "Outreach Ministry",
  "Women's Ministry",
  "House Fellowships",
];

// ── Types ────────────────────────────────────────────────────────────────────

export type PhotoCategory = string;

export interface Photo {
  id: string;
  url: string;
  publicId: string;
  title: string;
  alt: string;
  category: PhotoCategory;
  subcategory?: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadPhotoMetadata {
  title: string;
  alt: string;
  category?: PhotoCategory;
  subcategory?: string;
  featured?: boolean;
}

export interface UpdatePhotoPayload {
  title?: string;
  alt?: string;
  category?: PhotoCategory;
  subcategory?: string | null;
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
  async getAll(category?: string, subcategory?: string): Promise<Photo[]> {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const data = await request<{ photos: Photo[] }>("GET", `/gallery${qs}`);
    return data.photos;
  },

  async getById(id: string): Promise<Photo> {
    const data = await request<{ photo: Photo }>("GET", `/gallery/${id}`);
    return data.photo;
  },

  async upload(file: File, metadata: UploadPhotoMetadata): Promise<Photo> {
    const uploadFile = await optimizeGalleryImage(file);
    const form = new FormData();
    form.append("image", uploadFile);
    form.append("title", metadata.title);
    form.append("alt", metadata.alt);
    if (metadata.category) form.append("category", metadata.category);
    if (metadata.subcategory) form.append("subcategory", metadata.subcategory);
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
