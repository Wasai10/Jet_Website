const eventRepository = require("../repository/Events.repository");

/**
 * Get all events.
 */
const getAllEvents = async () => {
  return await eventRepository.findAll();
};

/**
 * Get a specific event by ID.
 */
const getEventById = async (id) => {
  const event = await eventRepository.findById(id);
  if (!event) {
    throw new Error("Event not found.");
  }
  return event;
};

/**
 * Create a new event.
 */
const createEvent = async (eventData) => {
  return await eventRepository.create(eventData);
};

/**
 * Update an existing event.
 */
const updateEvent = async (id, eventData) => {
  // Check if event exists first
  await getEventById(id);
  return await eventRepository.update(id, eventData);
};

/**
 * Delete an event.
 */
const deleteEvent = async (id) => {
  // Check if event exists first
  await getEventById(id);
  return await eventRepository.remove(id);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
