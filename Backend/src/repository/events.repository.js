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
      endDate: eventData.endDate ? new Date(eventData.endDate) : null,
      time: eventData.time,
      tag: eventData.tag,
      color: eventData.color,
      featured: eventData.featured ?? false,
      coverImage: eventData.coverImage,
      images: eventData.images,
      type: eventData.type ?? "UPCOMING",
      ownership: eventData.ownership ?? "PARTNERSHIP",
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
  if (updateData.endDate !== undefined) {
    updateData.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
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

const createRsvp = async (eventId, data) => {
  return prisma.eventRsvp.create({ data: { eventId, ...data } });
};

const findRsvpsByEventId = async (eventId) => {
  return prisma.eventRsvp.findMany({ where: { eventId }, orderBy: { createdAt: "desc" } });
};

const findAllRsvps = async () => {
  return prisma.eventRsvp.findMany({
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          location: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  createRsvp,
  findRsvpsByEventId,
  findAllRsvps,
};
