const prisma = require("../configs/db");

const findAll = async () => {
  return await prisma.ministryDocument.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const findById = async (id) => {
  return await prisma.ministryDocument.findUnique({
    where: { id },
  });
};

const create = async (data) => {
  return await prisma.ministryDocument.create({
    data: {
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      filePublicId: data.filePublicId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      category: data.category || "General",
    },
  });
};

const remove = async (id) => {
  return await prisma.ministryDocument.delete({
    where: { id },
  });
};

module.exports = {
  findAll,
  findById,
  create,
  remove,
};
