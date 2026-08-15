const express = require("express");
const eventsController = require("../controllers/events.controller");
const eventsValidator = require("../validators/events.validator");
const { authenticateJWT, requireAdmin } = require("../middlewares/auth.middleware");
const { parseEventImageUpload, uploadEventImageToCloudinary } = require("../middlewares/events.middleware");

const router = express.Router();

const router = express.Router();

// Public routes — anyone can read events
router.get("/", eventsController.getAllEvents);
router.get("/:id", eventsController.getEventById);
router.post("/:id/rsvp", eventsValidator.validateEventRsvp, eventsController.createRsvp);

// Authenticated routes — only logged-in users can create, update, delete
router.get("/rsvps/all", authenticateJWT, requireAdmin, eventsController.getAllRsvps);
router.post("/", authenticateJWT, eventsValidator.validateEventCreate, eventsController.createEvent);
router.post("/upload", authenticateJWT, parseEventImageUpload, uploadEventImageToCloudinary, eventsController.uploadEventImage);
router.get("/:id/rsvps", authenticateJWT, requireAdmin, eventsController.getEventRsvps);
router.put("/:id", authenticateJWT, eventsValidator.validateEventUpdate, eventsController.updateEvent);
router.delete("/:id", authenticateJWT, eventsController.deleteEvent);

module.exports = router;
