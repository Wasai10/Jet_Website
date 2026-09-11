const multer = require("multer");
const { cloudinary, isConfigured } = require("../configs/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

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
        { folder: "jet_ministries/leadership", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    req.cloudinary = result;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { parseUpload: upload.single("image"), uploadToCloudinary, cloudinary };
