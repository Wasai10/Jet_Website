const blogRepository = require("../repository/blog.repository");

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title);
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await blogRepository.findBySlug(candidate);
    if (!existing || existing.id === excludeId) break;
    candidate = `${base}-${counter++}`;
  }

  return candidate;
}

function calculateReadingTime(content) {
  const text = stripHtml(content || "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// ──────────────────────────────────────────────────────────────
// SEO Analysis — Rank Math style scoring (0–100)
//
// Breakdown:
//   Keyword analysis  40 pts  (keyword in title/url/meta/intro + density)
//   Content quality   35 pts  (length, headings, images+alt, links, lists)
//   Meta & technical  25 pts  (title length, meta description, OG image, canonical)
// ──────────────────────────────────────────────────────────────

function analyzeSeo(data) {
  const {
    title = "",
    slug = "",
    content = "",
    excerpt = "",
    focusKeyword = "",
    seoTitle = "",
    seoDescription = "",
    ogImage = "",
    canonicalUrl = "",
  } = data;

  const text = stripHtml(content);
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const keyword = (focusKeyword || "").toLowerCase().trim();
  const checks = [];
  let score = 0;

  // ── Keyword checks (40 pts) ──────────────────────────────────
  if (keyword) {
    const metaTitle = (seoTitle || title).toLowerCase();
    const inTitle = metaTitle.includes(keyword);
    if (inTitle) {
      score += 10;
      checks.push({ id: "keyword_in_title", pass: true, points: 10, message: "Focus keyword used in SEO title." });
    } else {
      checks.push({ id: "keyword_in_title", pass: false, points: 0, message: "Add focus keyword to the SEO title." });
    }

    const slugNormalized = slug.replace(/-/g, " ").toLowerCase();
    const inSlug = slugNormalized.includes(keyword);
    if (inSlug) {
      score += 10;
      checks.push({ id: "keyword_in_url", pass: true, points: 10, message: "Focus keyword found in the URL slug." });
    } else {
      checks.push({ id: "keyword_in_url", pass: false, points: 0, message: "Add focus keyword to the URL slug." });
    }

    const metaDesc = (seoDescription || excerpt).toLowerCase();
    const inDesc = metaDesc.includes(keyword);
    if (inDesc) {
      score += 10;
      checks.push({ id: "keyword_in_meta", pass: true, points: 10, message: "Focus keyword used in meta description." });
    } else {
      checks.push({ id: "keyword_in_meta", pass: false, points: 0, message: "Add focus keyword to the meta description." });
    }

    const introWindow = text.slice(0, Math.max(200, Math.floor(text.length * 0.1))).toLowerCase();
    const inIntro = introWindow.includes(keyword);
    if (inIntro) {
      score += 5;
      checks.push({ id: "keyword_in_intro", pass: true, points: 5, message: "Focus keyword appears in the opening paragraph." });
    } else {
      checks.push({ id: "keyword_in_intro", pass: false, points: 0, message: "Use focus keyword within the first paragraph." });
    }

    const escapedKw = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const occurrences = (text.match(new RegExp(escapedKw, "gi")) || []).length;
    const density = wordCount > 0 ? (occurrences / wordCount) * 100 : 0;

    if (density >= 0.5 && density <= 2.5) {
      score += 5;
      checks.push({ id: "keyword_density", pass: true, points: 5, message: `Keyword density is ideal (${density.toFixed(1)}%).` });
    } else if (density < 0.5) {
      checks.push({ id: "keyword_density", pass: false, points: 0, message: `Keyword density is too low (${density.toFixed(1)}%). Aim for 0.5–2.5%.` });
    } else {
      checks.push({ id: "keyword_density", pass: false, points: 0, message: `Keyword density is too high (${density.toFixed(1)}%). Reduce to 0.5–2.5%.` });
    }
  } else {
    checks.push({ id: "focus_keyword", pass: false, points: 0, message: "No focus keyword set — add one to unlock keyword analysis." });
  }

  // ── Content quality (35 pts) ──────────────────────────────────
  if (wordCount >= 600) {
    score += 10;
    checks.push({ id: "content_length", pass: true, points: 10, message: `Content length is good (${wordCount} words).` });
  } else {
    checks.push({ id: "content_length", pass: false, points: 0, message: `Content is too short (${wordCount} words). Aim for at least 600 words.` });
  }

  const hasHeadings = /<h[2-6][\s>]/i.test(content);
  if (hasHeadings) {
    score += 5;
    checks.push({ id: "headings", pass: true, points: 5, message: "Content uses H2–H6 subheadings." });
  } else {
    checks.push({ id: "headings", pass: false, points: 0, message: "Add H2–H6 subheadings to structure the content." });
  }

  const hasImages = /<img[\s>]/i.test(content);
  if (hasImages) {
    score += 5;
    checks.push({ id: "has_images", pass: true, points: 5, message: "Content includes images." });

    const missingAlt = /<img(?![^>]*\balt\s*=\s*["'][^"']+["'])[^>]*>/i.test(content);
    if (!missingAlt) {
      score += 5;
      checks.push({ id: "image_alt", pass: true, points: 5, message: "All images have descriptive alt text." });
    } else {
      checks.push({ id: "image_alt", pass: false, points: 0, message: "Some images are missing alt text. Add alt attributes for SEO and accessibility." });
    }
  } else {
    checks.push({ id: "has_images", pass: false, points: 0, message: "Add at least one image to enrich the content." });
    checks.push({ id: "image_alt", pass: false, points: 0, message: "No images found — alt text check skipped." });
  }

  const hasLinks = /<a[\s>][^>]*href/i.test(content);
  if (hasLinks) {
    score += 5;
    checks.push({ id: "links", pass: true, points: 5, message: "Content contains links." });
  } else {
    checks.push({ id: "links", pass: false, points: 0, message: "Add internal or external links to improve authority." });
  }

  const hasLists = /<[uo]l[\s>]/i.test(content);
  if (hasLists) {
    score += 5;
    checks.push({ id: "lists", pass: true, points: 5, message: "Content uses ordered or unordered lists." });
  } else {
    checks.push({ id: "lists", pass: false, points: 0, message: "Consider adding lists to improve scannability." });
  }

  // ── Meta & technical (25 pts) ──────────────────────────────────
  const effectiveTitle = seoTitle || title;
  const titleLen = effectiveTitle.length;
  if (titleLen >= 40 && titleLen <= 70) {
    score += 5;
    checks.push({ id: "title_length", pass: true, points: 5, message: `SEO title length is ideal (${titleLen} chars).` });
  } else {
    checks.push({ id: "title_length", pass: false, points: 0, message: `SEO title should be 40–70 characters (currently ${titleLen}).` });
  }

  const effectiveDesc = seoDescription || excerpt;
  const descLen = effectiveDesc.length;
  if (descLen >= 120 && descLen <= 165) {
    score += 10;
    checks.push({ id: "meta_desc", pass: true, points: 10, message: `Meta description length is ideal (${descLen} chars).` });
  } else if (!effectiveDesc) {
    checks.push({ id: "meta_desc", pass: false, points: 0, message: "Add a meta description (120–165 characters recommended)." });
  } else {
    checks.push({ id: "meta_desc", pass: false, points: 0, message: `Meta description should be 120–165 characters (currently ${descLen}).` });
  }

  if (ogImage) {
    score += 5;
    checks.push({ id: "og_image", pass: true, points: 5, message: "Open Graph image is configured." });
  } else {
    checks.push({ id: "og_image", pass: false, points: 0, message: "Set an Open Graph image for better social media previews." });
  }

  if (canonicalUrl) {
    score += 5;
    checks.push({ id: "canonical", pass: true, points: 5, message: "Canonical URL is set." });
  } else {
    checks.push({ id: "canonical", pass: false, points: 0, message: "Consider adding a canonical URL to prevent duplicate content issues." });
  }

  const finalScore = Math.min(100, score);
  return {
    score: finalScore,
    grade: finalScore >= 80 ? "A" : finalScore >= 60 ? "B" : finalScore >= 40 ? "C" : "D",
    label: finalScore >= 80 ? "Good" : finalScore >= 60 ? "Needs Improvement" : finalScore >= 40 ? "Poor" : "Very Poor",
    passed: checks.filter((c) => c.pass).length,
    total: checks.length,
    checks,
  };
}

// ──────────────────────────────────────────────────────────────
// Readability Analysis (0–100)
//
// Checks: sentence length, paragraph length, subheading
// distribution, passive voice usage.
// ──────────────────────────────────────────────────────────────

function analyzeReadability(content) {
  const text = stripHtml(content || "");
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 3);
  const paragraphs = (content || "").split(/<\/p>/i).filter((p) => stripHtml(p).trim().length > 0);
  const headingCount = (content.match(/<h[2-6][\s>]/gi) || []).length;

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const avgParaWords = paragraphCount > 0 ? wordCount / paragraphCount : 0;
  const expectedHeadings = Math.max(1, Math.floor(wordCount / 300));

  const checks = [];
  let score = 0;

  if (avgSentenceLength <= 20) {
    score += 25;
    checks.push({ id: "sentence_length", pass: true, message: `Good average sentence length (${Math.round(avgSentenceLength)} words).` });
  } else {
    checks.push({ id: "sentence_length", pass: false, message: `Sentences are too long (avg ${Math.round(avgSentenceLength)} words). Aim for ≤20 words.` });
  }

  if (avgParaWords <= 150) {
    score += 25;
    checks.push({ id: "paragraph_length", pass: true, message: `Good paragraph length (avg ${Math.round(avgParaWords)} words).` });
  } else {
    checks.push({ id: "paragraph_length", pass: false, message: `Paragraphs are too long (avg ${Math.round(avgParaWords)} words). Keep under 150 words.` });
  }

  if (headingCount >= expectedHeadings) {
    score += 25;
    checks.push({ id: "subheading_distribution", pass: true, message: "Subheadings are well distributed." });
  } else {
    checks.push({ id: "subheading_distribution", pass: false, message: `Add more subheadings — at least ${expectedHeadings} for ${wordCount} words.` });
  }

  const passiveMatches = (text.match(/\b(?:is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
  const passivePct = sentenceCount > 0 ? (passiveMatches / sentenceCount) * 100 : 0;
  if (passivePct <= 10) {
    score += 25;
    checks.push({ id: "passive_voice", pass: true, message: `Passive voice usage is low (${Math.round(passivePct)}%).` });
  } else {
    checks.push({ id: "passive_voice", pass: false, message: `Too much passive voice (${Math.round(passivePct)}%). Aim for ≤10% of sentences.` });
  }

  return {
    score: Math.min(100, score),
    grade: score >= 75 ? "A" : score >= 50 ? "B" : score >= 25 ? "C" : "D",
    label: score >= 75 ? "Good" : score >= 50 ? "Needs Improvement" : score >= 25 ? "Poor" : "Very Poor",
    checks,
    stats: {
      wordCount,
      sentenceCount,
      paragraphCount,
      headingCount,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      avgParagraphWords: Math.round(avgParaWords),
      passiveVoicePercent: Math.round(passivePct),
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Service Functions
// ──────────────────────────────────────────────────────────────

const getPublishedBlogs = async (query = {}) => {
  const { page = 1, limit = 10, category, tag, search } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filters = { status: "PUBLISHED" };
  if (category) filters.category = category;
  if (tag) filters.tag = tag;
  if (search) filters.search = search;

  const [blogs, total] = await blogRepository.findAllPublished(filters, { skip, take: Number(limit) });
  return {
    blogs,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  };
};

const getAllBlogsAdmin = async (query = {}) => {
  const { page = 1, limit = 10, status, category, search } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filters = {};
  if (status) filters.status = status;
  if (category) filters.category = category;
  if (search) filters.search = search;

  const [blogs, total] = await blogRepository.findAll(filters, { skip, take: Number(limit) });
  return {
    blogs,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  };
};

const getBlogBySlug = async (slug) => {
  const blog = await blogRepository.findBySlug(slug);
  if (!blog || blog.status !== "PUBLISHED") throw new Error("Blog post not found.");
  await blogRepository.incrementViews(blog.id);
  return { ...blog, viewCount: blog.viewCount + 1 };
};

const getBlogById = async (id) => {
  const blog = await blogRepository.findById(id);
  if (!blog) throw new Error("Blog post not found.");
  return blog;
};

const getCategories = async () => {
  return blogRepository.findDistinctCategories();
};

const createBlog = async (authorId, data) => {
  let slug = data.slug ? slugify(data.slug) : await generateUniqueSlug(data.title);

  const existing = await blogRepository.findBySlug(slug);
  if (existing) throw new Error(`Slug "${slug}" is already taken. Provide a custom slug or adjust the title.`);

  const readingTime = calculateReadingTime(data.content);
  const seoResult = analyzeSeo({ ...data, slug });
  const readabilityResult = analyzeReadability(data.content);

  const blogData = {
    title: data.title.trim(),
    slug,
    excerpt: data.excerpt.trim(),
    content: data.content,
    coverImage: data.coverImage || null,
    coverImageAlt: data.coverImageAlt || null,
    coverImagePublicId: data.coverImagePublicId || null,
    authorId,
    category: data.category || "General",
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || "DRAFT",
    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    scheduledAt: data.status === "SCHEDULED" && data.scheduledAt ? new Date(data.scheduledAt) : null,
    featured: data.featured === true || data.featured === "true",
    // SEO
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    focusKeyword: data.focusKeyword || null,
    additionalKeywords: Array.isArray(data.additionalKeywords) ? data.additionalKeywords : [],
    canonicalUrl: data.canonicalUrl || null,
    ogTitle: data.ogTitle || null,
    ogDescription: data.ogDescription || null,
    ogImage: data.ogImage || null,
    twitterCard: data.twitterCard || "summary_large_image",
    twitterTitle: data.twitterTitle || null,
    twitterDescription: data.twitterDescription || null,
    noIndex: data.noIndex === true || data.noIndex === "true",
    noFollow: data.noFollow === true || data.noFollow === "true",
    structuredData: data.structuredData || null,
    // Computed
    readingTime,
    seoScore: seoResult.score,
    readabilityScore: readabilityResult.score,
  };

  const blog = await blogRepository.create(blogData);
  return { blog, seoAnalysis: seoResult, readabilityAnalysis: readabilityResult };
};

const updateBlog = async (id, data) => {
  const existing = await getBlogById(id);

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = slugify(data.slug);
    const taken = await blogRepository.findBySlug(slug);
    if (taken && taken.id !== id) throw new Error(`Slug "${slug}" is already taken.`);
  }

  const content = data.content !== undefined ? data.content : existing.content;
  const readingTime = data.content !== undefined ? calculateReadingTime(content) : existing.readingTime;

  const seoFieldsTouched = [
    "title", "seoTitle", "seoDescription", "focusKeyword",
    "ogImage", "canonicalUrl", "excerpt", "content", "slug",
  ].some((f) => data[f] !== undefined);

  let seoResult = null;
  let readabilityResult = null;

  if (seoFieldsTouched) {
    const merged = { ...existing, ...data, slug, content };
    seoResult = analyzeSeo(merged);
    readabilityResult = analyzeReadability(content);
  }

  const updateData = { slug, readingTime };

  const copyFields = [
    "title", "excerpt", "content", "coverImage", "coverImageAlt", "coverImagePublicId",
    "category", "tags", "featured",
    "seoTitle", "seoDescription", "focusKeyword", "additionalKeywords", "canonicalUrl",
    "ogTitle", "ogDescription", "ogImage",
    "twitterCard", "twitterTitle", "twitterDescription",
    "noIndex", "noFollow", "structuredData",
  ];

  for (const field of copyFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.status && data.status !== existing.status) {
    updateData.status = data.status;
    if (data.status === "PUBLISHED" && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
    if (data.status === "SCHEDULED" && data.scheduledAt) {
      updateData.scheduledAt = new Date(data.scheduledAt);
    }
    if (data.status === "DRAFT" || data.status === "ARCHIVED") {
      updateData.scheduledAt = null;
    }
  }

  if (seoResult) {
    updateData.seoScore = seoResult.score;
    updateData.readabilityScore = readabilityResult.score;
  }

  const blog = await blogRepository.update(id, updateData);
  return { blog, seoAnalysis: seoResult, readabilityAnalysis: readabilityResult };
};

const changeBlogStatus = async (id, status, scheduledAt = null) => {
  const existing = await getBlogById(id);

  const updateData = { status };

  if (status === "PUBLISHED" && !existing.publishedAt) {
    updateData.publishedAt = new Date();
  }
  if (status === "SCHEDULED") {
    if (!scheduledAt) throw new Error("scheduledAt is required when scheduling a blog post.");
    updateData.scheduledAt = new Date(scheduledAt);
  }
  if (status === "DRAFT" || status === "ARCHIVED") {
    updateData.scheduledAt = null;
  }

  return blogRepository.update(id, updateData);
};

const deleteBlog = async (id) => {
  await getBlogById(id);
  return blogRepository.remove(id);
};

const performSeoAnalysis = (data) => {
  const seo = analyzeSeo(data);
  const readability = analyzeReadability(data.content || "");
  return {
    seo,
    readability,
    readingTime: calculateReadingTime(data.content || ""),
  };
};

module.exports = {
  getPublishedBlogs,
  getAllBlogsAdmin,
  getBlogBySlug,
  getBlogById,
  getCategories,
  createBlog,
  updateBlog,
  changeBlogStatus,
  deleteBlog,
  performSeoAnalysis,
};
