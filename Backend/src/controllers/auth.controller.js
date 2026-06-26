const authService = require("../services/auth.service");

const signup = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    return res.status(201).json({ message: "User registered successfully.", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.status(200).json({ message: "Login successful.", ...result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    return res.status(200).json({ message: "Token refreshed.", ...tokens });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutUser(refreshToken);
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const logoutAll = async (req, res) => {
  try {
    await authService.logoutAllDevices(req.user.id);
    return res.status(200).json({ message: "Logged out from all devices." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

const adminCreateUser = async (req, res) => {
  try {
    const user = await authService.createUserAsAdmin(req.body);
    return res.status(201).json({ message: "User created successfully.", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      return res.status(403).json({ error: "Access denied. You can only update your own profile." });
    }
    if (currentUser.role !== "ADMIN" && req.body.role) {
      return res.status(403).json({ error: "Access denied. Only admins can update user roles." });
    }

    const updatedUser = await authService.updateUser(id, req.body);
    return res.status(200).json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      return res.status(403).json({ error: "Access denied. You can only delete your own account." });
    }

    const deletedUser = await authService.deleteUser(id);
    return res.status(200).json({ message: "User deleted successfully.", user: deletedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  signin,
  adminCreateUser,
  refresh,
  logout,
  logoutAll,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
