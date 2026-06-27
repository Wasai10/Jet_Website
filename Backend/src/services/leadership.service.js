const leadershipRepository = require("../repository/leadership.repository");
const { cloudinary } = require("../middlewares/leadership.middleware");

const getAllLeaders = async () => {
  return await leadershipRepository.findAll();
};

const getLeaderById = async (id) => {
  const leader = await leadershipRepository.findById(id);
  if (!leader) throw new Error("Leader not found.");
  return leader;
};

const createLeader = async ({ name, role, order }, cloudinaryResult) => {
  if (!cloudinaryResult) throw new Error("A photo is required for a leader.");
  return await leadershipRepository.create({
    name: name.trim(),
    role: role.trim(),
    image: cloudinaryResult.secure_url,
    imagePublicId: cloudinaryResult.public_id,
    order: order !== undefined ? Number(order) : 0,
  });
};

const updateLeader = async (id, { name, role, order }, cloudinaryResult) => {
  const existing = await getLeaderById(id);

  const data = {};
  if (name !== undefined) data.name = name.trim();
  if (role !== undefined) data.role = role.trim();
  if (order !== undefined) data.order = Number(order);

  if (cloudinaryResult) {
    // Delete the old image from Cloudinary before replacing
    if (existing.imagePublicId) {
      await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
    }
    data.image = cloudinaryResult.secure_url;
    data.imagePublicId = cloudinaryResult.public_id;
  }

  return await leadershipRepository.update(id, data);
};

const deleteLeader = async (id) => {
  const leader = await getLeaderById(id);
  if (leader.imagePublicId) {
    await cloudinary.uploader.destroy(leader.imagePublicId).catch(() => {});
  }
  return await leadershipRepository.remove(id);
};

module.exports = { getAllLeaders, getLeaderById, createLeader, updateLeader, deleteLeader };
