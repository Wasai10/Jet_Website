/**
 * Validator module for event endpoints.
 */

const VALID_TYPES = [
  "UPCOMING", "PAST", "HOME_FELLOWSHIP",
  "WORSHIP", "CONFERENCE", "OUTREACH", "YOUTH", "PRAYER", "SPECIAL",
];

const validateEventCreate = (req, res, next) => {
  const { title, description, location, date, type } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      error: "Title is required and must be at least 3 characters long.",
    });
  }

  if (!description || typeof description !== "string" || description.trim().length < 10) {
    return res.status(400).json({
      error: "Description is required and must be at least 10 characters long.",
    });
  }

  if (!location || typeof location !== "string" || location.trim().length < 3) {
    return res.status(400).json({
      error: "Location is required and must be at least 3 characters long.",
    });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: "A valid date is required (e.g. YYYY-MM-DD or ISO string).",
    });
  }

  if (type !== undefined && !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}.`,
    });
  }

  next();
};

const validateEventUpdate = (req, res, next) => {
  const { title, description, location, date, type } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim().length < 3)) {
    return res.status(400).json({
      error: "Title must be at least 3 characters long.",
    });
  }

  if (description !== undefined && (typeof description !== "string" || description.trim().length < 10)) {
    return res.status(400).json({
      error: "Description must be at least 10 characters long.",
    });
  }

  if (location !== undefined && (typeof location !== "string" || location.trim().length < 3)) {
    return res.status(400).json({
      error: "Location must be at least 3 characters long.",
    });
  }

  if (date !== undefined && isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: "Please provide a valid date.",
    });
  }

  if (type !== undefined && !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}.`,
    });
  }

  next();
};

module.exports = {
  validateEventCreate,
  validateEventUpdate,
};
