// ========================================
// Import Required Modules
// ========================================
const express = require("express");
const router = express.Router();

// Import Event Controller
const EventController = require("../Controllers/EventController");

// Import Admin Middleware
const { Admin } = require("../Middlewares/AdminMiddleware");


// ========================================
// Event Routes
// ========================================

// Get All Events
router.get("/", EventController.getallEvent);

// Get Event by ID
router.get("/:id", EventController.getEventById);

// Add New Event (Admin Only)
router.post("/add", Admin, EventController.addEvent);

// Update Event by ID (Admin Only)
router.put("/update/:id", Admin, EventController.updateEvent);

// Delete Event by ID (Admin Only)
router.delete("/delete/:id", Admin, EventController.deleteEvent);


// ========================================
// Export Router
// ========================================
module.exports = router;