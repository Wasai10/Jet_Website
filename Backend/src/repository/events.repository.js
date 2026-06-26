const prisma = require("../configs/db");

/**
 * Find all events.
 */
const findAll = async () => {
  return await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });
};

/**
 * Find event by ID.
 */
const findById = async (id) => {
  return await prisma.event.findUnique({
    where: { id },
  });
};

/**
 * Create a new event.
 */
const create = async (eventData) => {
  return await prisma.event.create({
    data: {
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      date: new Date(eventData.date),
      time: eventData.time,
      tag: eventData.tag,
      color: eventData.color,
      featured: eventData.featured ?? false,
      images: eventData.images,
      type: eventData.type ?? "UPCOMING",
    },
  });
};

/**
 * Update an existing event.
 */
const update = async (id, eventData) => {
  const updateData = { ...eventData };
  if (updateData.date) {
    updateData.date = new Date(updateData.date);
  }
  return await prisma.event.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Delete an event.
 */
const remove = async (id) => {
  return await prisma.event.delete({
    where: { id },
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
