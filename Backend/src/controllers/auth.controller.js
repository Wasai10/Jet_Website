const authService = require("../services/auth.service");

/**
 * Controller to handle user registration (Sign Up).
 */
const signup = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    return res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to handle user login (Sign In).
 */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.status(200).json({
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to get currently authenticated user.
 */
const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

/**
 * Controller to list all users (ADMIN only).
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to update a user's details.
 * - Normal users can only update themselves.
 * - ADMIN can update any user, including changing their roles.
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Authorization checks
    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      return res.status(403).json({ error: "Access denied. You can only update your own profile." });
    }

    // Prevent non-admins from changing their role
    if (currentUser.role !== "ADMIN" && req.body.role) {
      return res.status(403).json({ error: "Access denied. Only admins can update user roles." });
    }

    const updatedUser = await authService.updateUser(id, req.body);
    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to delete a user.
 * - Normal users can only delete themselves.
 * - ADMIN can delete any user.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Authorization checks
    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      return res.status(403).json({ error: "Access denied. You can only delete your own account." });
    }

    const deletedUser = await authService.deleteUser(id);
    return res.status(200).json({
      message: "User deleted successfully.",
      user: deletedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  signin,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
