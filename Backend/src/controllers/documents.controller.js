const documentService = require("../services/documents.services");
const { cloudinary, isConfigured } = require("../configs/cloudinary");

const getAllDocuments = async (_req, res) => {
  try {
    const documents = await documentService.getAllDocuments();
    return res.status(200).json({ documents });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    let payload = { ...req.body };
    if (req.documentUploadResult) {
      payload.fileUrl = req.documentUploadResult.secure_url;
      payload.filePublicId = req.documentUploadResult.public_id;
      payload.fileName = payload.fileName || req.documentUploadResult.originalName;
      payload.fileSize = payload.fileSize || req.documentUploadResult.fileSizeFormatted;
    }
    const document = await documentService.createDocument(payload);
    return res.status(201).json({ message: "Document uploaded successfully.", document });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await documentService.deleteDocument(id);
    return res.status(200).json({ message: "Document deleted.", document: deleted });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const uploadFileOnly = async (req, res) => {
  if (!req.documentUploadResult) {
    return res.status(400).json({ error: "No document file uploaded." });
  }
  return res.status(200).json({
    fileUrl: req.documentUploadResult.secure_url,
    filePublicId: req.documentUploadResult.public_id,
    fileName: req.documentUploadResult.originalName,
    fileSize: req.documentUploadResult.fileSizeFormatted,
  });
};

const downloadDocument = async (req, res) => {
  try {
    const document = await documentService.getDocumentById(req.params.id);
    if (!document.filePublicId) {
      return res.status(400).json({ error: "This document does not have a Cloudinary file to download." });
    }
    if (!isConfigured()) {
      return res.status(503).json({ error: "Document downloads are temporarily unavailable." });
    }

    const fileUrl = new URL(document.fileUrl);
    if (fileUrl.hostname !== "res.cloudinary.com") {
      return res.status(400).json({ error: "The document is not stored in Cloudinary." });
    }

    const cloudinaryPath = fileUrl.pathname.match(/\/(image|raw|video)\/(upload|private|authenticated)\//);
    if (!cloudinaryPath) {
      return res.status(400).json({ error: "The document file URL is not a supported Cloudinary URL." });
    }

    const format =
      document.fileName?.match(/\.([a-z0-9]+)$/i)?.[1] ??
      fileUrl.pathname.match(/\.([a-z0-9]+)$/i)?.[1];
    if (!format) {
      return res.status(400).json({ error: "The document file type could not be determined." });
    }

    const downloadUrl = cloudinary.utils.private_download_url(document.filePublicId, format, {
      resource_type: cloudinaryPath[1],
      type: cloudinaryPath[2],
      expires_at: Math.floor(Date.now() / 1000) + 300,
      attachment: true,
      secure: true,
    });

    return res.redirect(302, downloadUrl);
  } catch (error) {
    if (error.message === "Document not found.") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Could not prepare the document download." });
  }
};

module.exports = {
  getAllDocuments,
  createDocument,
  deleteDocument,
  uploadFileOnly,
  downloadDocument,
};
