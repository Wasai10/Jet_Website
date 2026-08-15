const documentService = require("../services/documents.services");

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

module.exports = {
  getAllDocuments,
  createDocument,
  deleteDocument,
  uploadFileOnly,
};
