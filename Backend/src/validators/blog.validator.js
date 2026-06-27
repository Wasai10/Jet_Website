const VALID_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"];
const VALID_TWITTER_CARDS = ["summary", "summary_large_image", "app", "player"];

const validateBlogCreate = (req, res, next) => {
  const { title, content, excerpt, status, scheduledAt, twitterCard } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({ error: "Title is required (min 3 characters)." });
  }

  if (!content || typeof content !== "string" || content.trim().length < 50) {
    return res.status(400).json({ error: "Content is required (min 50 characters)." });
  }

  if (!excerpt || typeof excerpt !== "string" || excerpt.trim().length < 10) {
    return res.status(400).json({ error: "Excerpt is required (min 10 characters)." });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` });
  }

  if (status === "SCHEDULED" && !scheduledAt) {
    return res.status(400).json({ error: "scheduledAt is required when status is SCHEDULED." });
  }

  if (scheduledAt && isNaN(Date.parse(scheduledAt))) {
    return res.status(400).json({ error: "scheduledAt must be a valid ISO date string." });
  }

  if (twitterCard && !VALID_TWITTER_CARDS.includes(twitterCard)) {
    return res.status(400).json({ error: `twitterCard must be one of: ${VALID_TWITTER_CARDS.join(", ")}.` });
  }

  next();
};

const validateBlogUpdate = (req, res, next) => {
  const { title, content, excerpt, status, scheduledAt, twitterCard } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim().length < 3)) {
    return res.status(400).json({ error: "Title must be at least 3 characters." });
  }

  if (content !== undefined && (typeof content !== "string" || content.trim().length < 50)) {
    return res.status(400).json({ error: "Content must be at least 50 characters." });
  }

  if (excerpt !== undefined && (typeof excerpt !== "string" || excerpt.trim().length < 10)) {
    return res.status(400).json({ error: "Excerpt must be at least 10 characters." });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` });
  }

  if (status === "SCHEDULED" && !scheduledAt) {
    return res.status(400).json({ error: "scheduledAt is required when scheduling a post." });
  }

  if (scheduledAt && isNaN(Date.parse(scheduledAt))) {
    return res.status(400).json({ error: "scheduledAt must be a valid ISO date string." });
  }

  if (twitterCard !== undefined && !VALID_TWITTER_CARDS.includes(twitterCard)) {
    return res.status(400).json({ error: `twitterCard must be one of: ${VALID_TWITTER_CARDS.join(", ")}.` });
  }

  next();
};

const validateStatusChange = (req, res, next) => {
  const { status, scheduledAt } = req.body;

  if (!status) {
    return res.status(400).json({ error: "status is required." });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` });
  }

  if (status === "SCHEDULED" && !scheduledAt) {
    return res.status(400).json({ error: "scheduledAt is required when scheduling a post." });
  }

  if (scheduledAt && isNaN(Date.parse(scheduledAt))) {
    return res.status(400).json({ error: "scheduledAt must be a valid ISO date string." });
  }

  next();
};

const validateSeoAnalyze = (req, res, next) => {
  if (!req.body.content || typeof req.body.content !== "string") {
    return res.status(400).json({ error: "content is required for SEO analysis." });
  }
  next();
};

module.exports = { validateBlogCreate, validateBlogUpdate, validateStatusChange, validateSeoAnalyze };
