const validateGalleryCategory = (category) => {
  return typeof category === "string" && category.trim().length >= 1;
};

const validateGallerySubcategory = (subcategory) => {
  return typeof subcategory === "string" && subcategory.trim().length >= 1;
};

const validatePhotoCreate = (req, res, next) => {
  const { title, alt, category, subcategory } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "An image file is required." });
  }

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return res.status(400).json({ error: "Title is required and must be at least 2 characters." });
  }

  if (!alt || typeof alt !== "string" || alt.trim().length < 2) {
    return res.status(400).json({ error: "Alt text is required and must be at least 2 characters." });
  }

  if (category !== undefined && !validateGalleryCategory(category)) {
    return res.status(400).json({
      error: "Category must be a non-empty string.",
    });
  }

  if (subcategory !== undefined && subcategory !== null && subcategory !== "" && !validateGallerySubcategory(subcategory)) {
    return res.status(400).json({
      error: "Subcategory must be a string.",
    });
  }

  next();
};

const validatePhotoUpdate = (req, res, next) => {
  const { title, alt, category, subcategory } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim().length < 2)) {
    return res.status(400).json({ error: "Title must be at least 2 characters." });
  }

  if (alt !== undefined && (typeof alt !== "string" || alt.trim().length < 2)) {
    return res.status(400).json({ error: "Alt text must be at least 2 characters." });
  }

  if (category !== undefined && !validateGalleryCategory(category)) {
    return res.status(400).json({
      error: "Category must be a non-empty string.",
    });
  }

  if (subcategory !== undefined && subcategory !== null && subcategory !== "" && !validateGallerySubcategory(subcategory)) {
    return res.status(400).json({
      error: "Subcategory must be a string.",
    });
  }

  next();
};

module.exports = { validatePhotoCreate, validatePhotoUpdate };
