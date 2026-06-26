const VALID_CATEGORIES = ["Worship", "Community", "Events", "Youth", "Outreach", "General"];

const validatePhotoCreate = (req, res, next) => {
  const { title, alt, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "An image file is required." });
  }

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return res.status(400).json({ error: "Title is required and must be at least 2 characters." });
  }

  if (!alt || typeof alt !== "string" || alt.trim().length < 2) {
    return res.status(400).json({ error: "Alt text is required and must be at least 2 characters." });
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}.`,
    });
  }

  next();
};

const validatePhotoUpdate = (req, res, next) => {
  const { title, alt, category } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim().length < 2)) {
    return res.status(400).json({ error: "Title must be at least 2 characters." });
  }

  if (alt !== undefined && (typeof alt !== "string" || alt.trim().length < 2)) {
    return res.status(400).json({ error: "Alt text must be at least 2 characters." });
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}.`,
    });
  }

  next();
};

module.exports = { validatePhotoCreate, validatePhotoUpdate, VALID_CATEGORIES };
