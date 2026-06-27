import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, Loader2, Save, Send, Star } from "lucide-react";
import {
  blogsService,
  type Blog,
  type BlogStatus,
  type CreateBlogPayload,
  type SeoAnalysisResult,
  type TwitterCard,
} from "@/api/blogs.service";
import jetSwal from "@/lib/swal";
import RichEditor from "./RichEditor";
import CoverUpload from "./CoverUpload";
import SeoPanel from "./SeoPanel";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  coverImagePublicId: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  scheduledAt: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  additionalKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: TwitterCard;
  twitterTitle: string;
  twitterDescription: string;
  noIndex: boolean;
  noFollow: boolean;
}

interface Props {
  target: Blog | "new";
  onBack: () => void;
  onSaved: (blog: Blog) => void;
}

const BLOG_CATEGORIES = [
  "General", "Ministry", "Teaching", "Devotional", "Testimony",
  "Events", "Youth", "Outreach", "Prayer", "Worship",
];

const STATUS_OPTS: { value: BlogStatus; label: string; color: string }[] = [
  { value: "DRAFT",     label: "Draft",     color: "#9CA3AF" },
  { value: "PUBLISHED", label: "Published", color: "#22C55E" },
  { value: "SCHEDULED", label: "Scheduled", color: "#0096FF" },
  { value: "ARCHIVED",  label: "Archived",  color: "#F59E0B" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function initForm(target: Blog | "new"): BlogForm {
  if (target === "new") {
    return {
      title: "", slug: "", excerpt: "", content: "",
      coverImage: "", coverImageAlt: "", coverImagePublicId: "",
      category: "General", tags: [], status: "DRAFT", scheduledAt: "",
      featured: false, seoTitle: "", seoDescription: "", focusKeyword: "",
      additionalKeywords: [], canonicalUrl: "", ogTitle: "", ogDescription: "",
      ogImage: "", twitterCard: "summary_large_image", twitterTitle: "",
      twitterDescription: "", noIndex: false, noFollow: false,
    };
  }
  return {
    title: target.title,
    slug: target.slug,
    excerpt: target.excerpt,
    content: target.content,
    coverImage: target.coverImage ?? "",
    coverImageAlt: target.coverImageAlt ?? "",
    coverImagePublicId: target.coverImagePublicId ?? "",
    category: target.category,
    tags: Array.isArray(target.tags) ? (target.tags as string[]) : [],
    status: target.status,
    scheduledAt: target.scheduledAt ? target.scheduledAt.slice(0, 16) : "",
    featured: target.featured,
    seoTitle: target.seoTitle ?? "",
    seoDescription: target.seoDescription ?? "",
    focusKeyword: target.focusKeyword ?? "",
    additionalKeywords: Array.isArray(target.additionalKeywords)
      ? (target.additionalKeywords as string[]) : [],
    canonicalUrl: target.canonicalUrl ?? "",
    ogTitle: target.ogTitle ?? "",
    ogDescription: target.ogDescription ?? "",
    ogImage: target.ogImage ?? "",
    twitterCard: (target.twitterCard as TwitterCard) ?? "summary_large_image",
    twitterTitle: target.twitterTitle ?? "",
    twitterDescription: target.twitterDescription ?? "",
    noIndex: target.noIndex,
    noFollow: target.noFollow,
  };
}

// ── TagInput ─────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
  };

  const remove = (t: string) => onChange(tags.filter((x) => x !== t));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      remove(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center min-h-[40px] bg-input border border-border rounded-xl px-3 py-2 focus-within:border-primary/50 transition-colors cursor-text"
      onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/15 text-primary text-xs font-medium"
        >
          {tag}
          <button type="button" onClick={() => remove(tag)} className="hover:text-foreground transition-colors leading-none cursor-pointer">×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => { if (input.trim()) { add(input); setInput(""); } }}
        placeholder={tags.length === 0 ? "Add tags — press Enter or comma…" : ""}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-foreground placeholder-muted-foreground/40 outline-none"
      />
    </div>
  );
}

// ── BlogEditor ────────────────────────────────────────────────────────────────

export default function BlogEditor({ target, onBack, onSaved }: Props) {
  const isEdit = target !== "new";
  const editBlog = isEdit ? (target as Blog) : null;

  const [form, setForm] = useState<BlogForm>(() => initForm(target));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [canonicalManual, setCanonicalManual] = useState(
    () => isEdit && !!(target as Blog).canonicalUrl
  );
  const [analysis, setAnalysis] = useState<SeoAnalysisResult | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(true);

  const wordCount = useMemo(() => {
    const text = stripHtml(form.content);
    return text.split(/\s+/).filter(Boolean).length;
  }, [form.content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!slugManual) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  // Auto-generate canonical URL from slug unless manually overridden
  useEffect(() => {
    if (!canonicalManual) {
      const base = (import.meta.env.VITE_SITE_URL as string | undefined) ?? window.location.origin;
      setForm((f) => ({
        ...f,
        canonicalUrl: f.slug ? `${base}/blog/${f.slug}` : "",
      }));
    }
  }, [form.slug, canonicalManual]);

  const set = useCallback(<K extends keyof BlogForm>(key: K, value: BlogForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const setSeoField = useCallback((field: string, value: string | boolean) => {
    if (field === "canonicalUrl") setCanonicalManual(true);
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  const handleContent = useCallback((html: string) => {
    setForm((f) => ({ ...f, content: html }));
  }, []);

  const handleSave = async (statusOverride?: BlogStatus) => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.excerpt.trim()) { setError("Excerpt is required."); return; }
    if (stripHtml(form.content).length < 50) { setError("Content is too short (min 50 characters)."); return; }

    setError("");
    setSaving(true);

    const payload: CreateBlogPayload = {
      title: form.title.trim(),
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content,
      coverImage: form.coverImage || undefined,
      coverImageAlt: form.coverImageAlt || undefined,
      coverImagePublicId: form.coverImagePublicId || undefined,
      category: form.category || "General",
      tags: form.tags,
      status: statusOverride ?? form.status,
      scheduledAt: form.status === "SCHEDULED" ? form.scheduledAt : undefined,
      featured: form.featured,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      focusKeyword: form.focusKeyword || undefined,
      additionalKeywords: form.additionalKeywords.length ? form.additionalKeywords : undefined,
      canonicalUrl: form.canonicalUrl || undefined,
      ogTitle: form.ogTitle || undefined,
      ogDescription: form.ogDescription || undefined,
      ogImage: form.ogImage || undefined,
      twitterCard: form.twitterCard,
      twitterTitle: form.twitterTitle || undefined,
      twitterDescription: form.twitterDescription || undefined,
      noIndex: form.noIndex,
      noFollow: form.noFollow,
    };

    try {
      let result;
      if (isEdit && editBlog) {
        result = await blogsService.update(editBlog.id, payload);
      } else {
        result = await blogsService.create(payload);
      }
      onSaved(result.blog);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (!form.title.trim() || !form.excerpt.trim() || stripHtml(form.content).length < 50) {
      handleSave("PUBLISHED");
      return;
    }
    jetSwal.fire({
      title: isEdit ? "Update & Publish?" : "Publish Post?",
      text: "This will make the post visible to the public.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isEdit ? "Update & Publish" : "Publish",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "jet-swal-popup", title: "jet-swal-title", htmlContainer: "jet-swal-content",
        confirmButton: "jet-swal-confirm", cancelButton: "jet-swal-cancel",
      },
    }).then((r) => {
      if (r.isConfirmed) handleSave("PUBLISHED");
    });
  };

  const handleAnalyze = async () => {
    setAnalyzeLoading(true);
    try {
      const result = await blogsService.analyzeSeo({
        content: form.content,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        focusKeyword: form.focusKeyword,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        ogImage: form.ogImage,
        canonicalUrl: form.canonicalUrl,
      });
      setAnalysis(result);
      setSeoOpen(true);
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Analysis failed",
        text: err instanceof Error ? err.message : "Could not analyze SEO.",
      });
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const inputCls = "w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 outline-none focus:border-primary/50 transition-colors text-sm";
  const labelCls = "block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wide";

  const sidebarSectionCls = "bg-card border border-border rounded-2xl p-4 space-y-4";

  const currentStatus = STATUS_OPTS.find((s) => s.value === form.status) ?? STATUS_OPTS[0];
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">

      {/* ── Sticky header bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Posts
        </button>

        <div className="flex items-center gap-3">
          {error && (
            <p className="text-[#EF4444] text-xs max-w-xs truncate">{error}</p>
          )}

          {/* Save draft */}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm font-medium hover:bg-muted/80 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Update" : "Save Draft"}
          </button>

          {/* Publish */}
          {form.status !== "PUBLISHED" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish
            </button>
          )}
          {form.status === "PUBLISHED" && (
            <button
              type="button"
              onClick={() => handleSave("PUBLISHED")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(34,197,94,0.20)] disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Post
            </button>
          )}
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="flex gap-6 flex-1 min-h-0">

        {/* Main content column */}
        <div className="flex-1 space-y-5 overflow-y-auto pb-12 pr-1 min-w-0">

          {/* Title */}
          <input
            ref={titleRef}
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Post title…"
            className="w-full bg-transparent border-b border-border text-foreground text-3xl font-bold placeholder-muted-foreground/30 outline-none pb-3 focus:border-primary/40 transition-colors"
          />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60 text-xs shrink-0">Slug:</span>
            <div className="flex-1 flex items-center bg-muted/30 border border-border rounded-lg px-3 py-1.5">
              <span className="text-muted-foreground/60 text-xs shrink-0">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^\w-]/g, "-"));
                }}
                placeholder="post-slug"
                className="flex-1 bg-transparent text-muted-foreground text-xs outline-none min-w-0"
              />
            </div>
            {slugManual && !isEdit && (
              <button
                type="button"
                onClick={() => { setSlugManual(false); set("slug", slugify(form.title)); }}
                className="text-primary text-xs hover:underline cursor-pointer whitespace-nowrap"
              >
                Auto-generate
              </button>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelCls}>Excerpt <span className="text-[#EF4444]">*</span></label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="A short summary of this post that will appear in blog listings and meta descriptions…"
              rows={3}
              className={inputCls + " resize-none"}
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${form.excerpt.length > 165 ? "text-[#EF4444]" : "text-muted-foreground/50"}`}>
                {form.excerpt.length} chars
              </span>
            </div>
          </div>

          {/* Froala editor */}
          <div>
            <label className={labelCls}>Content <span className="text-[#EF4444]">*</span></label>
            <RichEditor value={form.content} onChange={handleContent} />
            <div className="flex items-center gap-4 mt-2 text-muted-foreground/50 text-xs">
              <span>{wordCount.toLocaleString()} words</span>
              <span>~{readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 space-y-4 overflow-y-auto pb-12">

          {/* Status */}
          <div className={sidebarSectionCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Status</h3>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium"
                style={{ background: `${currentStatus.color}20`, color: currentStatus.color }}
              >
                {currentStatus.label}
              </span>
            </div>

            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as BlogStatus)}
                className="w-full appearance-none bg-input border border-border rounded-xl px-3 py-2.5 text-foreground text-xs outline-none cursor-pointer pr-8 focus:border-primary/50 transition-colors [&_option]:bg-background"
              >
                {STATUS_OPTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {form.status === "SCHEDULED" && (
              <div>
                <label className="block text-muted-foreground text-xs mb-1">Schedule date &amp; time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => set("scheduledAt", e.target.value)}
                  className="w-full bg-input border border-border rounded-xl px-3 py-2 text-foreground text-xs outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Cover image */}
          <div className={sidebarSectionCls}>
            <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Cover Image</h3>
            <CoverUpload
              url={form.coverImage}
              publicId={form.coverImagePublicId}
              alt={form.coverImageAlt}
              onChangeImage={(url, publicId) => {
                set("coverImage", url);
                set("coverImagePublicId", publicId);
                if (!form.ogImage) set("ogImage", url);
              }}
              onChangeAlt={(alt) => set("coverImageAlt", alt)}
              onRemove={() => {
                set("coverImage", "");
                set("coverImageAlt", "");
                set("coverImagePublicId", "");
              }}
            />
          </div>

          {/* Post details */}
          <div className={sidebarSectionCls}>
            <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Details</h3>

            {/* Category */}
            <div>
              <label className="block text-muted-foreground text-xs mb-1">Category</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full appearance-none bg-input border border-border rounded-xl px-3 py-2.5 text-foreground text-xs outline-none cursor-pointer pr-8 focus:border-primary/50 transition-colors [&_option]:bg-background"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-muted-foreground text-xs mb-1">Tags</label>
              <TagInput tags={form.tags} onChange={(tags) => set("tags", tags)} />
            </div>

            {/* Featured */}
            <button
              type="button"
              onClick={() => set("featured", !form.featured)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer
                ${form.featured
                  ? "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]"
                  : "bg-card border-border text-muted-foreground hover:border-border/60"
                }`}
            >
              <Star className={`w-4 h-4 ${form.featured ? "fill-[#F59E0B]" : ""}`} />
              <span className="text-xs font-medium">{form.featured ? "Featured post" : "Mark as featured"}</span>
            </button>
          </div>

          {/* SEO Panel */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">S</span>
                </div>
                <h3 className="text-foreground text-xs font-semibold uppercase tracking-wide">SEO &amp; Meta</h3>
              </div>
              <div className="flex items-center gap-2">
                {analysis && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: `${analysis.seo.grade === "A" ? "#22C55E" : analysis.seo.grade === "B" ? "#0096FF" : analysis.seo.grade === "C" ? "#F59E0B" : "#EF4444"}25`,
                      color: analysis.seo.grade === "A" ? "#22C55E" : analysis.seo.grade === "B" ? "#0096FF" : analysis.seo.grade === "C" ? "#F59E0B" : "#EF4444",
                    }}
                  >
                    {analysis.seo.score}
                  </span>
                )}
                {seoOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 -rotate-90" />}
              </div>
            </button>

            {seoOpen && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="pt-4">
                  <SeoPanel
                    focusKeyword={form.focusKeyword}
                    seoTitle={form.seoTitle}
                    seoDescription={form.seoDescription}
                    ogImage={form.ogImage}
                    ogTitle={form.ogTitle}
                    ogDescription={form.ogDescription}
                    canonicalUrl={form.canonicalUrl}
                    canonicalIsManual={canonicalManual}
                    onCanonicalReset={() => setCanonicalManual(false)}
                    noIndex={form.noIndex}
                    noFollow={form.noFollow}
                    analysis={analysis}
                    analyzeLoading={analyzeLoading}
                    titleFallback={form.title}
                    onChange={setSeoField}
                    onAnalyze={handleAnalyze}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
