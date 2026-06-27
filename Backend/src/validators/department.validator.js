const validateDepartmentCreate = (req, res, next) => {
  const { name, description, leaderId } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Name is required and must be at least 2 characters." });
  }

  if (!description || typeof description !== "string" || description.trim().length < 10) {
    return res.status(400).json({ error: "Description is required and must be at least 10 characters." });
  }

  if (!leaderId || typeof leaderId !== "string" || leaderId.trim().length === 0) {
    return res.status(400).json({ error: "A leader is required for every department." });
  }

  next();
};

const validateDepartmentUpdate = (req, res, next) => {
  const { name, description, leaderId, order } = req.body;

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  }

  if (description !== undefined && (typeof description !== "string" || description.trim().length < 10)) {
    return res.status(400).json({ error: "Description must be at least 10 characters." });
  }

  if (leaderId !== undefined && (!leaderId || typeof leaderId !== "string" || leaderId.trim().length === 0)) {
    return res.status(400).json({ error: "A leader is required for every department." });
  }

  if (order !== undefined && (typeof order !== "number" || !Number.isInteger(order) || order < 0)) {
    return res.status(400).json({ error: "Order must be a non-negative integer." });
  }

  next();
};

module.exports = { validateDepartmentCreate, validateDepartmentUpdate };
