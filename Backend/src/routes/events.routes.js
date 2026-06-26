const express = require("express");
const eventsController = require("../controllers/events.controller");
const eventsValidator = require("../validators/events.validator");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes — anyone can read events
router.get("/", eventsController.getAllEvents);
router.get("/:id", eventsController.getEventById);

// Authenticated routes — only logged-in users can create, update, delete
router.post("/", authenticateJWT, eventsValidator.validateEventCreate, eventsController.createEvent);
router.put("/:id", authenticateJWT, eventsValidator.validateEventUpdate, eventsController.updateEvent);
router.delete("/:id", authenticateJWT, eventsController.deleteEvent);

module.exports = router;
