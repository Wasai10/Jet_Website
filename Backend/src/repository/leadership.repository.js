const prisma = require("../configs/db");

const findAll = async () => {
  return await prisma.leadership.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
};

const findById = async (id) => {
  return await prisma.leadership.findUnique({ where: { id } });
};

const create = async (data) => {
  return await prisma.leadership.create({ data });
};

const update = async (id, data) => {
  return await prisma.leadership.update({ where: { id }, data });
};

const remove = async (id) => {
  return await prisma.leadership.delete({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };
