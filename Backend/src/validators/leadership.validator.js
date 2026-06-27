const validateLeaderCreate = (req, res, next) => {
  const { name, role } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Name is required and must be at least 2 characters." });
  }

  if (!role || typeof role !== "string" || role.trim().length < 2) {
    return res.status(400).json({ error: "Role is required and must be at least 2 characters." });
  }

  // Image is required on create — enforced via multer (req.file) in the controller
  next();
};

const validateLeaderUpdate = (req, res, next) => {
  const { name, role, order } = req.body;

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  }

  if (role !== undefined && (typeof role !== "string" || role.trim().length < 2)) {
    return res.status(400).json({ error: "Role must be at least 2 characters." });
  }

  if (order !== undefined && (typeof order !== "number" || !Number.isInteger(order) || order < 0)) {
    return res.status(400).json({ error: "Order must be a non-negative integer." });
  }

  next();
};

module.exports = { validateLeaderCreate, validateLeaderUpdate };
