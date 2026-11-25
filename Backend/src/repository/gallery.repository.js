const prisma = require("../configs/db");

const findAll = async (category, subcategory) => {
  const where = {};
  if (category) where.category = category;
  if (subcategory) where.subcategory = subcategory;
  return await prisma.photo.findMany({
    where: Object.keys(where).length ? where : undefined,
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
