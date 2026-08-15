const eventRepository = require("../repository/events.repository");

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

const rsvpToEvent = async (eventId, data) => {
  const event = await getEventById(eventId);
  if (event.type === "PAST") throw new Error("RSVPs are closed for past events.");
  try {
    return await eventRepository.createRsvp(eventId, data);
  } catch (error) {
    if (error.code === "P2002") throw new Error("You have already RSVP'd for this event with this email address.");
    throw error;
  }
};

const getEventRsvps = async (eventId) => {
  await getEventById(eventId);
  return eventRepository.findRsvpsByEventId(eventId);
};

const getAllRsvps = async () => {
  return eventRepository.findAllRsvps();
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  getEventRsvps,
  getAllRsvps,
};
