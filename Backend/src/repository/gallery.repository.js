const prisma = require("../configs/db");

const findAll = async (category) => {
  return await prisma.photo.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
};

const findById = async (id) => {
  return await prisma.photo.findUnique({ where: { id } });
};

const create = async (data) => {
  return await prisma.photo.create({ data });
};

const update = async (id, data) => {
  return await prisma.photo.update({ where: { id }, data });
};

const remove = async (id) => {
  return await prisma.photo.delete({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };
