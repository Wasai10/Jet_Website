const galleryService = require("../services/gallery.service");

const getAllPhotos = async (req, res) => {
  try {
    const photos = await galleryService.getAllPhotos(req.query.category);
    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPhotoById = async (req, res) => {
  try {
    const photo = await galleryService.getPhotoById(req.params.id);
    return res.status(200).json({ photo });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    const photo = await galleryService.createPhoto(req.cloudinary, req.body);
    return res.status(201).json({ message: "Photo uploaded successfully.", photo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const photo = await galleryService.updatePhoto(req.params.id, req.body);
    return res.status(200).json({ message: "Photo updated successfully.", photo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await galleryService.deletePhoto(req.params.id);
    return res.status(200).json({ message: "Photo deleted successfully.", photo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllPhotos, getPhotoById, uploadPhoto, updatePhoto, deletePhoto };
