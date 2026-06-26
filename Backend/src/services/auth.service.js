const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs");
const authRepository = require("../repository/auth.repository");

const hashToken = (raw) => crypto.createHash("sha256").update(raw).digest("hex");

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const rawRefreshToken = crypto.randomBytes(64).toString("hex");
  const hashedRefreshToken = hashToken(rawRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await authRepository.createRefreshToken(user.id, hashedRefreshToken, expiresAt);

  return { accessToken, refreshToken: rawRefreshToken };
};

// ── Public auth ──────────────────────────────────────────────────────────────

const createUser = async (userData) => {
  const { fullName, email, password } = userData;

  const existing = await authRepository.findUserByEmail(email);
  if (existing) throw new Error("Email is already registered.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return authRepository.createUser({ fullName, email, password: hashedPassword, role: "USER" });
};

const createUserAsAdmin = async (userData) => {
  const { fullName, email, password, role = "USER" } = userData;

  if (!["ADMIN", "USER"].includes(role)) throw new Error("Invalid role.");

  const existing = await authRepository.findUserByEmail(email);
  if (existing) throw new Error("Email is already registered.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return authRepository.createUser({ fullName, email, password: hashedPassword, role });
};

const loginUser = async (email, password) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) throw new Error("Refresh token is required.");

  const hashedToken = hashToken(rawRefreshToken);
  const stored = await authRepository.findRefreshToken(hashedToken);

  if (!stored) throw new Error("Invalid refresh token.");
  if (stored.expiresAt < new Date()) {
    await authRepository.deleteRefreshToken(hashedToken);
    throw new Error("Refresh token has expired. Please log in again.");
  }

  const user = await authRepository.findUserById(stored.userId);
  if (!user) throw new Error("User not found.");

  // Rotate: delete old token and issue a fresh pair
  await authRepository.deleteRefreshToken(hashedToken);
  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

  return { accessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (rawRefreshToken) => {
  if (!rawRefreshToken) throw new Error("Refresh token is required.");
  await authRepository.deleteRefreshToken(hashToken(rawRefreshToken));
};

const logoutAllDevices = async (userId) => {
  await authRepository.deleteAllUserRefreshTokens(userId);
};

// ── User management ──────────────────────────────────────────────────────────

const getAllUsers = async () => authRepository.findAllUsers();

const updateUser = async (userId, updateData) => {
  const data = { ...updateData };

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  if (data.email) {
    const conflict = await authRepository.findUserByEmailExcludingId(data.email, userId);
    if (conflict) throw new Error("Email is already in use by another user.");
  }

  return authRepository.updateUser(userId, data);
};

const deleteUser = async (userId) => authRepository.deleteUser(userId);

module.exports = {
  createUser,
  createUserAsAdmin,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getAllUsers,
  updateUser,
  deleteUser,
};
