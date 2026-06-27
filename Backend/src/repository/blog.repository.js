const prisma = require("../configs/db");

const AUTHOR_SELECT = { id: true, fullName: true };

function buildWhere(filters) {
  const where = {};

  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;

  if (filters.tag) {
    where.tags = { array_contains: [filters.tag] };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { excerpt: { contains: filters.search } },
      { focusKeyword: { contains: filters.search } },
      { category: { contains: filters.search } },
    ];
  }

  return where;
}

const findAll = async (filters = {}, pagination = {}) => {
  const where = buildWhere(filters);
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: { author: { select: AUTHOR_SELECT } },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip || 0,
      take: pagination.take || 10,
    }),
    prisma.blog.count({ where }),
  ]);
  return [blogs, total];
};

const findAllPublished = async (filters = {}, pagination = {}) => {
  const where = buildWhere({ ...filters, status: "PUBLISHED" });
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: { author: { select: AUTHOR_SELECT } },
      orderBy: { publishedAt: "desc" },
      skip: pagination.skip || 0,
      take: pagination.take || 10,
    }),
    prisma.blog.count({ where }),
  ]);
  return [blogs, total];
};

const findBySlug = async (slug) => {
  return prisma.blog.findUnique({
    where: { slug },
    include: { author: { select: AUTHOR_SELECT } },
  });
};

const findById = async (id) => {
  return prisma.blog.findUnique({
    where: { id },
    include: { author: { select: AUTHOR_SELECT } },
  });
};

const findDistinctCategories = async () => {
  const results = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return results.map((r) => r.category);
};

const create = async (data) => {
  return prisma.blog.create({
    data,
    include: { author: { select: AUTHOR_SELECT } },
  });
};

const update = async (id, data) => {
  return prisma.blog.update({
    where: { id },
    data,
    include: { author: { select: AUTHOR_SELECT } },
  });
};

const remove = async (id) => {
  return prisma.blog.delete({ where: { id } });
};

const incrementViews = async (id) => {
  return prisma.blog.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
};

module.exports = {
  findAll,
  findAllPublished,
  findBySlug,
  findById,
  findDistinctCategories,
  create,
  update,
  remove,
  incrementViews,
};
