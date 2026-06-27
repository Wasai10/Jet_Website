const departmentRepository = require("../repository/department.repository");
const leadershipRepository = require("../repository/leadership.repository");
const { cloudinary } = require("../middlewares/department.middleware");

const getAllDepartments = async () => {
  return await departmentRepository.findAll();
};

const getDepartmentById = async (id) => {
  const dept = await departmentRepository.findById(id);
  if (!dept) throw new Error("Department not found.");
  return dept;
};

const createDepartment = async ({ name, description, leaderId, order }, cloudinaryResult) => {
  const leader = await leadershipRepository.findById(leaderId);
  if (!leader) throw new Error("The specified leader does not exist.");

  return await departmentRepository.create({
    name: name.trim(),
    description: description.trim(),
    leaderId,
    backgroundImage: cloudinaryResult ? cloudinaryResult.secure_url : null,
    bgImagePublicId: cloudinaryResult ? cloudinaryResult.public_id : null,
    order: order !== undefined ? Number(order) : 0,
  });
};

const updateDepartment = async (id, { name, description, leaderId, order }, cloudinaryResult) => {
  const existing = await getDepartmentById(id);

  if (leaderId) {
    const leader = await leadershipRepository.findById(leaderId);
    if (!leader) throw new Error("The specified leader does not exist.");
  }

  const data = {};
  if (name !== undefined) data.name = name.trim();
  if (description !== undefined) data.description = description.trim();
  if (leaderId !== undefined) data.leaderId = leaderId;
  if (order !== undefined) data.order = Number(order);

  if (cloudinaryResult) {
    if (existing.bgImagePublicId) {
      await cloudinary.uploader.destroy(existing.bgImagePublicId).catch(() => {});
    }
    data.backgroundImage = cloudinaryResult.secure_url;
    data.bgImagePublicId = cloudinaryResult.public_id;
  }

  return await departmentRepository.update(id, data);
};

const deleteDepartment = async (id) => {
  const dept = await getDepartmentById(id);
  if (dept.bgImagePublicId) {
    await cloudinary.uploader.destroy(dept.bgImagePublicId).catch(() => {});
  }
  return await departmentRepository.remove(id);
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
