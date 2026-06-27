const express = require("express");
const departmentController = require("../controllers/department.controller");
const departmentValidator = require("../validators/department.validator");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const { parseUpload, uploadToCloudinary } = require("../middlewares/department.middleware");

const router = express.Router();

// Public
router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);

// Admin only
router.post(
  "/",
  authenticateJWT,
  parseUpload,
  uploadToCloudinary,
  departmentValidator.validateDepartmentCreate,
  departmentController.createDepartment
);

router.put(
  "/:id",
  authenticateJWT,
  parseUpload,
  uploadToCloudinary,
  departmentValidator.validateDepartmentUpdate,
  departmentController.updateDepartment
);

router.delete("/:id", authenticateJWT, departmentController.deleteDepartment);

module.exports = router;
