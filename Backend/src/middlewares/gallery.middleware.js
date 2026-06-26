const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const config = require("../configs");

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Store file in memory so we can stream it to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

/**
 * Streams req.file.buffer to Cloudinary and attaches the result to req.cloudinary.
 * Must run AFTER multer has parsed the request.
 */
const uploadToCloudinary = async (req, _res, next) => {
  if (!req.file) return next();

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "jet_gallery", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    req.cloudinary = result;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  parseUpload: upload.single("image"),
  uploadToCloudinary,
  cloudinary,
};
