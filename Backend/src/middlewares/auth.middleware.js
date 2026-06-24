const jwt = require("jsonwebtoken");
const prisma = require("../configs/db");

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-jwt-secret-key";

/**
 * Middleware to verify JWT token and attach user to request object.
 */
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found or account deactivated." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

/**
 * Middleware to verify that the authenticated user is an ADMIN.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }

  next();
};

module.exports = {
  authenticateJWT,
  requireAdmin,
  JWT_SECRET,
};
