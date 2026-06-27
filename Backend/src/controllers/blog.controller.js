const blogService = require("../services/blog.services");

// ── Public ──────────────────────────────────────────────────────────────────

const getPublishedBlogs = async (req, res) => {
  try {
    const result = await blogService.getPublishedBlogs(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await blogService.getCategories();
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ── Admin ────────────────────────────────────────────────────────────────────

const adminGetAll = async (req, res) => {
  try {
    const result = await blogService.getAllBlogsAdmin(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const adminGetById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const result = await blogService.createBlog(req.user.id, req.body);
    return res.status(201).json({ message: "Blog post created successfully.", ...result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const result = await blogService.updateBlog(req.params.id, req.body);
    return res.status(200).json({ message: "Blog post updated successfully.", ...result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const changeBlogStatus = async (req, res) => {
  try {
    const { status, scheduledAt } = req.body;
    const blog = await blogService.changeBlogStatus(req.params.id, status, scheduledAt);
    return res.status(200).json({ message: `Blog post status changed to ${status}.`, blog });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await blogService.deleteBlog(req.params.id);
    return res.status(200).json({ message: "Blog post deleted successfully." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const seoAnalyze = async (req, res) => {
  try {
    const result = await blogService.performSeoAnalysis(req.body);
    return res.status(200).json({ message: "SEO analysis complete.", ...result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const uploadCoverImage = async (req, res) => {
  try {
    if (!req.coverImageResult) {
      return res.status(400).json({ error: "No image file provided." });
    }
    return res.status(200).json({
      message: "Cover image uploaded successfully.",
      url: req.coverImageResult.secure_url,
      publicId: req.coverImageResult.public_id,
      link: req.coverImageResult.secure_url, // Froala expects `link` for inline image insertion
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
