const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const config = require("../configs");

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit for documents
});

const uploadDocumentToCloudinary = async (req, _res, next) => {
  if (!req.file) return next();
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
