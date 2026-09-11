const multer = require("multer");
const { cloudinary, isConfigured } = require("../configs/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit for documents
});

const uploadDocumentToCloudinary = async (req, _res, next) => {
  if (!req.file) return next();
  if (!isConfigured()) {
    return next(
      new Error(
        "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) to Backend/.env"
      )
    );
  }
  try {
    const origName = req.file.originalname || "document";
    req.documentUploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "jet_ministries/documents",
          resource_type: "auto",
          public_id: `${Date.now()}_${origName.replace(/[^a-zA-Z0-9]/g, "_")}`,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    req.documentUploadResult.originalName = origName;
    req.documentUploadResult.fileSizeFormatted = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  parseDocumentUpload: upload.single("file"),
  uploadDocumentToCloudinary,
};
