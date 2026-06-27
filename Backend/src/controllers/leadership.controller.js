const leadershipService = require("../services/leadership.service");

const getAllLeaders = async (req, res) => {
  try {
    const leaders = await leadershipService.getAllLeaders();
    return res.status(200).json({ leaders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getLeaderById = async (req, res) => {
  try {
    const leader = await leadershipService.getLeaderById(req.params.id);
    return res.status(200).json({ leader });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const createLeader = async (req, res) => {
  try {
    const leader = await leadershipService.createLeader(req.body, req.cloudinary);
    return res.status(201).json({ message: "Leader created successfully.", leader });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateLeader = async (req, res) => {
  try {
    const leader = await leadershipService.updateLeader(req.params.id, req.body, req.cloudinary);
    return res.status(200).json({ message: "Leader updated successfully.", leader });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteLeader = async (req, res) => {
  try {
    const leader = await leadershipService.deleteLeader(req.params.id);
    return res.status(200).json({ message: "Leader deleted successfully.", leader });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllLeaders, getLeaderById, createLeader, updateLeader, deleteLeader };
