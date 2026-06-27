const express = require("express");
const { authenticateJWT, requireAdmin } = require("../middlewares/auth.middleware");
const { parseCoverUpload, uploadCoverToCloudinary } = require("../middlewares/blog.middleware");
const {
  validateBlogCreate,
  validateBlogUpdate,
  validateStatusChange,
  validateSeoAnalyze,
} = require("../validators/blog.validator");
const {
  getPublishedBlogs,
  getBlogBySlug,
  getCategories,
  adminGetAll,
  adminGetById,
  createBlog,
  updateBlog,
  changeBlogStatus,
  deleteBlog,
  seoAnalyze,
  uploadCoverImage,
} = require("../controllers/blog.controller");

const router = express.Router();

// ── Admin routes ─────────────────────────────────────────────────────────────
// These must be defined BEFORE /:slug to avoid route parameter conflicts.

router.get("/admin/all", authenticateJWT, requireAdmin, adminGetAll);

router.get("/admin/editor-key", authenticateJWT, requireAdmin, (req, res) => {
  res.json({ key: process.env.FROALA_KEY ?? "" });
});

router.post(
  "/admin/seo-analyze",
  authenticateJWT,
  requireAdmin,
  validateSeoAnalyze,
  seoAnalyze
);

router.post(
  "/admin/cover",
  authenticateJWT,
  requireAdmin,
  parseCoverUpload,
  uploadCoverToCloudinary,
  uploadCoverImage
);

router.post("/admin", authenticateJWT, requireAdmin, validateBlogCreate, createBlog);

router.get("/admin/:id", authenticateJWT, requireAdmin, adminGetById);

router.put("/admin/:id", authenticateJWT, requireAdmin, validateBlogUpdate, updateBlog);

router.patch(
  "/admin/:id/status",
  authenticateJWT,
  requireAdmin,
  validateStatusChange,
  changeBlogStatus
);

router.delete("/admin/:id", authenticateJWT, requireAdmin, deleteBlog);

// ── Public routes ─────────────────────────────────────────────────────────────

router.get("/categories", getCategories);

router.get("/", getPublishedBlogs);

router.get("/:slug", getBlogBySlug);

module.exports = router;
