const { v2: cloudinary } = require("cloudinary");
const config = require("./index");

const isConfigured = () => {
  return Boolean(
    (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) ||
    process.env.CLOUDINARY_URL
  );
};

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
} else if (process.env.CLOUDINARY_URL) {
  // Cloudinary automatically parses CLOUDINARY_URL from process.env
}

module.exports = { cloudinary, isConfigured };

