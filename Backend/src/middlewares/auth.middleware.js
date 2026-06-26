const jwt = require("jsonwebtoken");
const config = require("../configs");
const authRepository = require("../repository/auth.repository");

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await authRepository.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found or account deactivated." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }

  next();
};

module.exports = { authenticateJWT, requireAdmin };
