const express = require("express");
const leadershipController = require("../controllers/leadership.controller");
const leadershipValidator = require("../validators/leadership.validator");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const { parseUpload, uploadToCloudinary } = require("../middlewares/leadership.middleware");

const router = express.Router();

// Public
router.get("/", leadershipController.getAllLeaders);
router.get("/:id", leadershipController.getLeaderById);

// Admin only
router.post(
  "/",
  authenticateJWT,
  parseUpload,
  uploadToCloudinary,
  leadershipValidator.validateLeaderCreate,
  leadershipController.createLeader
);

router.put(
  "/:id",
  authenticateJWT,
  parseUpload,
  uploadToCloudinary,
  leadershipValidator.validateLeaderUpdate,
  leadershipController.updateLeader
);

router.delete("/:id", authenticateJWT, leadershipController.deleteLeader);

module.exports = router;
