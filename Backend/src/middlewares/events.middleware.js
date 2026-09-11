const multer = require("multer");
const { cloudinary, isConfigured } = require("../configs/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

const uploadEventImageToCloudinary = async (req, _res, next) => {
  if (!req.file) return next();
  if (!isConfigured()) {
    return next(
      new Error(
        "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) to Backend/.env"
      )
    );
  }
  try {
    req.eventImageResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "jet_ministries/event_posters", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { parseEventImageUpload: upload.single("image"), uploadEventImageToCloudinary };
