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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

const uploadEventImageToCloudinary = async (req, _res, next) => {
  if (!req.file) return next();
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
