import { request, tokenStore, authService } from "./auth.service";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// ── Types ────────────────────────────────────────────────────────────────────

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";
export type TwitterCard = "summary" | "summary_large_image" | "app" | "player";

export interface BlogAuthor {
  id: string;
  fullName: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  coverImagePublicId: string | null;
  author: BlogAuthor;
  authorId: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  featured: boolean;
  viewCount: number;
  readingTime: number;
  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword: string | null;
  additionalKeywords: string[];
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: TwitterCard;
  twitterTitle: string | null;
  twitterDescription: string | null;
  noIndex: boolean;
  noFollow: boolean;
  structuredData: Record<string, unknown> | null;
  seoScore: number | null;
  readabilityScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  excerpt: string;
  slug?: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImagePublicId?: string;
  category?: string;
  tags?: string[];
  status?: BlogStatus;
  scheduledAt?: string;
  featured?: boolean;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  additionalKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: TwitterCard;
  twitterTitle?: string;
  twitterDescription?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export interface ChangeStatusPayload {
  status: BlogStatus;
  scheduledAt?: string;
}

export interface BlogListQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: BlogStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BlogListResponse {
  blogs: Blog[];
  pagination: Pagination;
}

// ── SEO Analysis Types ────────────────────────────────────────────────────────

export interface SeoCheck {
  id: string;
  pass: boolean;
  points: number;
  message: string;
}

export interface SeoScore {
  score: number;
  grade: "A" | "B" | "C" | "D";
  label: string;
  passed: number;
  total: number;
  checks: SeoCheck[];
}

export interface ReadabilityCheck {
  id: string;
  pass: boolean;
  message: string;
}

export interface ReadabilityStats {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  headingCount: number;
  avgSentenceLength: number;
  avgParagraphWords: number;
  passiveVoicePercent: number;
}

export interface ReadabilityScore {
  score: number;
  grade: "A" | "B" | "C" | "D";
  label: string;
  checks: ReadabilityCheck[];
  stats: ReadabilityStats;
}

export interface SeoAnalysisResult {
  seo: SeoScore;
  readability: ReadabilityScore;
  readingTime: number;
}

export interface SeoAnalyzePayload {
  content: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  focusKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface CoverUploadResult {
  message: string;
  url: string;
  publicId: string;
}

export interface BlogMutationResult {
  message: string;
  blog: Blog;
  seoAnalysis: SeoScore | null;
  readabilityAnalysis: ReadabilityScore | null;
}

// ── Multipart helper (mirrors gallery.service.ts) ────────────────────────────
// `request` speaks JSON only — cover image upload uses FormData, so we handle
// auth + one auto-refresh retry manually here.

async function fetchWithAuth(url: string, init: RequestInit, retry = true): Promise<Response> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
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

// ── Query-string helper ───────────────────────────────────────────────────────

function buildQs(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}

// ── Blog Service ──────────────────────────────────────────────────────────────

export const blogsService = {
  // ── Public endpoints ───────────────────────────────────────────────────────

  /** List published blogs with optional pagination / filter / search. */
  async getAll(query?: BlogListQuery): Promise<BlogListResponse> {
    return request<BlogListResponse>("GET", `/blog${buildQs(query as Record<string, unknown>)}`);
  },

  /** Fetch a single published blog by its slug. Increments the view counter. */
  async getBySlug(slug: string): Promise<Blog> {
    const data = await request<{ blog: Blog }>("GET", `/blog/${encodeURIComponent(slug)}`);
    return data.blog;
  },

  /** All unique categories from published blogs. */
  async getCategories(): Promise<string[]> {
    const data = await request<{ categories: string[] }>("GET", "/blog/categories");
    return data.categories;
  },

  // ── Admin endpoints ────────────────────────────────────────────────────────

  /** List ALL blogs regardless of status (admin). */
  async adminGetAll(query?: BlogListQuery): Promise<BlogListResponse> {
    return request<BlogListResponse>("GET", `/blog/admin/all${buildQs(query as Record<string, unknown>)}`);
  },

  /** Fetch any blog by ID (admin — works for DRAFT / ARCHIVED too). */
  async adminGetById(id: string): Promise<Blog> {
    const data = await request<{ blog: Blog }>("GET", `/blog/admin/${id}`);
    return data.blog;
  },

  /** Create a new blog post. Returns the saved blog + SEO / readability scores. */
  async create(payload: CreateBlogPayload): Promise<BlogMutationResult> {
    return request<BlogMutationResult>("POST", "/blog/admin", payload);
  },

  /** Update an existing blog post. Returns the saved blog + recalculated scores (if SEO fields changed). */
  async update(id: string, payload: UpdateBlogPayload): Promise<BlogMutationResult> {
    return request<BlogMutationResult>("PUT", `/blog/admin/${id}`, payload);
  },

  /** Change blog status (DRAFT → PUBLISHED, etc.). */
  async changeStatus(id: string, payload: ChangeStatusPayload): Promise<Blog> {
    const data = await request<{ message: string; blog: Blog }>(
      "PATCH",
      `/blog/admin/${id}/status`,
      payload
    );
    return data.blog;
  },

  /** Delete a blog post permanently. */
  async remove(id: string): Promise<void> {
    await request("DELETE", `/blog/admin/${id}`);
  },

  /**
   * Upload a cover image and get back its Cloudinary URL + publicId.
   * Use the returned `url` as `coverImage` when creating / updating a blog.
   */
  async uploadCover(file: File): Promise<CoverUploadResult> {
    const form = new FormData();
    form.append("cover", file);

    const res = await fetchWithAuth(`${BASE_URL}/blog/admin/cover`, {
      method: "POST",
      body: form,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((data as { error?: string }).error ?? `Cover upload failed: ${res.status}`);
    }
    return data as CoverUploadResult;
  },

  /**
   * Analyse SEO + readability for the given content without saving anything.
   * Call this while the admin is editing to provide live feedback.
   */
  async analyzeSeo(payload: SeoAnalyzePayload): Promise<SeoAnalysisResult> {
    const data = await request<{ message: string } & SeoAnalysisResult>(
      "POST",
      "/blog/admin/seo-analyze",
      payload
    );
    return { seo: data.seo, readability: data.readability, readingTime: data.readingTime };
  },
};
