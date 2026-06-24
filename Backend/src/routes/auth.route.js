const express = require("express");
const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const { authenticateJWT, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public Auth routes
router.post("/signup", authValidator.validateSignup, authController.signup);
router.post("/signin", authValidator.validateSignin, authController.signin);

// Authenticated user routes (JWT required)
router.get("/me", authenticateJWT, authController.getCurrentUser);
router.patch("/users/:id", authenticateJWT, authValidator.validateUserUpdate, authController.updateUser);
router.delete("/users/:id", authenticateJWT, authController.deleteUser);

// Admin-only user management routes
router.get("/users", authenticateJWT, requireAdmin, authController.getAllUsers);

module.exports = router;
