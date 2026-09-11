const multer = require("multer");
const { cloudinary, isConfigured } = require("../configs/cloudinary");

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
  if (!isConfigured()) {
    return next(
      new Error(
        "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) to Backend/.env"
      )
    );
  }

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
