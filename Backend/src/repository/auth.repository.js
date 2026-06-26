const prisma = require("../configs/db");

const USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

// ── User queries ────────────────────────────────────────────────────────────

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const findUserById = async (id) => {
  return prisma.user.findUnique({ where: { id }, select: USER_SELECT });
};

const findUserByEmailExcludingId = async (email, excludeId) => {
  return prisma.user.findFirst({ where: { email, NOT: { id: excludeId } } });
};

const createUser = async (data) => {
  return prisma.user.create({ data, select: USER_SELECT });
};

const findAllUsers = async () => {
  return prisma.user.findMany({ select: USER_SELECT, orderBy: { createdAt: "desc" } });
};

const updateUser = async (id, data) => {
  return prisma.user.update({ where: { id }, data, select: USER_SELECT });
};

const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
    select: { id: true, fullName: true, email: true },
  });
};

// ── Refresh token queries ────────────────────────────────────────────────────

const createRefreshToken = async (userId, hashedToken, expiresAt) => {
  return prisma.refreshToken.create({
    data: { userId, token: hashedToken, expiresAt },
  });
};

const findRefreshToken = async (hashedToken) => {
  return prisma.refreshToken.findUnique({ where: { token: hashedToken } });
};

const deleteRefreshToken = async (hashedToken) => {
  return prisma.refreshToken.deleteMany({ where: { token: hashedToken } });
};

const deleteAllUserRefreshTokens = async (userId) => {
  return prisma.refreshToken.deleteMany({ where: { userId } });
};

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByEmailExcludingId,
  createUser,
  findAllUsers,
  updateUser,
  deleteUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllUserRefreshTokens,
};
