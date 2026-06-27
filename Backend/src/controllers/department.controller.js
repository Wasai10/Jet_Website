const departmentService = require("../services/department.service");

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    return res.status(200).json({ departments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    return res.status(200).json({ department });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body, req.cloudinary);
    return res.status(201).json({ message: "Department created successfully.", department });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body, req.cloudinary);
    return res.status(200).json({ message: "Department updated successfully.", department });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await departmentService.deleteDepartment(req.params.id);
    return res.status(200).json({ message: "Department deleted successfully.", department });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
