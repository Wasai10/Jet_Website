const prisma = require("../configs/db");

const findAll = async () => {
  return await prisma.department.findMany({
    include: { leader: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
};

const findById = async (id) => {
  return await prisma.department.findUnique({
    where: { id },
    include: { leader: true },
  });
};

const create = async (data) => {
  return await prisma.department.create({
    data,
    include: { leader: true },
  });
};

const update = async (id, data) => {
  return await prisma.department.update({
    where: { id },
    data,
    include: { leader: true },
  });
};

const remove = async (id) => {
  return await prisma.department.delete({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };
