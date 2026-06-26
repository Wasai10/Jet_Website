const express = require("express");
const galleryController = require("../controllers/gallery.controller");
const galleryValidator = require("../validators/gallery.validator");
const { parseUpload, uploadToCloudinary } = require("../middlewares/gallery.middleware");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public — read
router.get("/", galleryController.getAllPhotos);
router.get("/:id", galleryController.getPhotoById);

// Authenticated — write
// Order matters: multer parses the file → validate metadata → upload to Cloudinary → save to DB
router.post(
  "/",
  authenticateJWT,
  parseUpload,
  galleryValidator.validatePhotoCreate,
  uploadToCloudinary,
  galleryController.uploadPhoto
);
router.put("/:id", authenticateJWT, galleryValidator.validatePhotoUpdate, galleryController.updatePhoto);
router.delete("/:id", authenticateJWT, galleryController.deletePhoto);

module.exports = router;
