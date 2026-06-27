const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const config = require("../configs");

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed for blog covers."));
    }
    cb(null, true);
  },
});

const uploadCoverToCloudinary = async (req, _res, next) => {
  if (!req.file) return next();

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "jet_ministries/blog_covers", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    req.coverImageResult = result;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { parseCoverUpload: upload.single("cover"), uploadCoverToCloudinary, cloudinary };
