const eventService = require("../services/Events.services");

/**
 * Get all events.
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get event by ID.
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    return res.status(200).json({ event });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

/**
 * Create a new event (Authenticated users only).
 */
const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    return res.status(201).json({
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Update an existing event (Authenticated users only).
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await eventService.updateEvent(id, req.body);
    return res.status(200).json({
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Delete an event (Authenticated users only).
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await eventService.deleteEvent(id);
    return res.status(200).json({
      message: "Event deleted successfully.",
      event: deletedEvent,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
