const photoRepository = require("../repository/gallery.repository");
const { cloudinary } = require("../middlewares/gallery.middleware");

const getAllPhotos = async (category) => {
  return await photoRepository.findAll(category || null);
};

const getPhotoById = async (id) => {
  const photo = await photoRepository.findById(id);
  if (!photo) throw new Error("Photo not found.");
  return photo;
};

const createPhoto = async (cloudinaryResult, metadata) => {
  return await photoRepository.create({
    url: cloudinaryResult.secure_url,
    publicId: cloudinaryResult.public_id,
    title: metadata.title.trim(),
    alt: metadata.alt.trim(),
    category: metadata.category ?? "General",
    featured: metadata.featured === "true" || metadata.featured === true,
  });
};

const updatePhoto = async (id, data) => {
  await getPhotoById(id);
  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.alt !== undefined) updateData.alt = data.alt.trim();
  if (data.category !== undefined) updateData.category = data.category;
  if (data.featured !== undefined)
    updateData.featured = data.featured === "true" || data.featured === true;
  return await photoRepository.update(id, updateData);
};

const deletePhoto = async (id) => {
  const photo = await getPhotoById(id);
  await cloudinary.uploader.destroy(photo.publicId);
  return await photoRepository.remove(id);
};

module.exports = { getAllPhotos, getPhotoById, createPhoto, updatePhoto, deletePhoto };
