const express = require("express");
const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const { authenticateJWT, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public
router.post("/signup", authValidator.validateSignup, authController.signup);
router.post("/signin", authValidator.validateSignin, authController.signin);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Authenticated
router.post("/logout-all", authenticateJWT, authController.logoutAll);
router.get("/me", authenticateJWT, authController.getCurrentUser);
router.patch("/users/:id", authenticateJWT, authValidator.validateUserUpdate, authController.updateUser);
router.delete("/users/:id", authenticateJWT, authController.deleteUser);

// Admin only
router.get("/users", authenticateJWT, requireAdmin, authController.getAllUsers);
router.post("/admin/users", authenticateJWT, requireAdmin, authController.adminCreateUser);

module.exports = router;
