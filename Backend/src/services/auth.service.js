const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/db");
const { JWT_SECRET } = require("../middlewares/auth.middleware");

/**
 * Service to register a new user. Self registration assigns role as USER.
 */
const createUser = async (userData) => {
  const { fullName, email, password } = userData;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Determine if it is the first user overall. If there are no users at all,
  // we could optionally assign ADMIN to bootstrap the system, but the user explicitly requested:
  // "Self registration automatically assigns role as a normal USER."
  // So we strictly use USER.
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: "USER",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Service to authenticate user and generate JWT token.
 */
const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Get all users (ADMIN only).
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Update user details.
 */
const updateUser = async (userId, updateData) => {
  const data = { ...updateData };

  // Hash password if updating password
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  // Check unique email if email is being updated
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id: userId },
      },
    });
    if (existing) {
      throw new Error("Email is already in use by another user.");
    }
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Delete a user from the system.
 */
const deleteUser = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
