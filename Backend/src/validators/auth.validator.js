/**
 * Validator module for auth and user endpoints.
 */

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validateSignup = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return res.status(400).json({
      error: "Full name is required and must be at least 2 characters long.",
    });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      error: "A valid email address is required.",
    });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      error: "Password is required and must be at least 6 characters long.",
    });
  }

  next();
};

const validateSignin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      error: "A valid email address is required.",
    });
  }

  if (!password || typeof password !== "string" || !password) {
    return res.status(400).json({
      error: "Password is required.",
    });
  }

  next();
};

const validateUserUpdate = (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  if (fullName !== undefined && (typeof fullName !== "string" || fullName.trim().length < 2)) {
    return res.status(400).json({
      error: "Full name must be at least 2 characters long.",
    });
  }

  if (email !== undefined && !validateEmail(email)) {
    return res.status(400).json({
      error: "Please provide a valid email address.",
    });
  }

  if (password !== undefined && (typeof password !== "string" || password.length < 6)) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long.",
    });
  }

  if (role !== undefined && !["ADMIN", "USER"].includes(role)) {
    return res.status(400).json({
      error: "Invalid role. Role must be either ADMIN or USER.",
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateSignin,
  validateUserUpdate,
};
