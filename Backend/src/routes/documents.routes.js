const express = require("express");
const documentsController = require("../controllers/documents.controller");
const { authenticateJWT, requireAdmin } = require("../middlewares/auth.middleware");
const { parseDocumentUpload, uploadDocumentToCloudinary } = require("../middlewares/documents.middleware");

const router = express.Router();

// Public route: get all ministry documents
router.get("/", documentsController.getAllDocuments);

// Admin routes: upload document file & create/delete document record
router.post(
  "/upload",
  authenticateJWT,
  requireAdmin,
  parseDocumentUpload,
  uploadDocumentToCloudinary,
  documentsController.uploadFileOnly
);

router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  parseDocumentUpload,
  uploadDocumentToCloudinary,
  documentsController.createDocument
);

router.delete("/:id", authenticateJWT, requireAdmin, documentsController.deleteDocument);

module.exports = router;
