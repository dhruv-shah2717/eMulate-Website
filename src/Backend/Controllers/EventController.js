// ========================================
// Import Event Model
// ========================================
const Event = require("../Models/Event");


// ========================================
// Get All Events
// ========================================
exports.getallEvent = async (req, res) => {
    try {
        // Fetch all events and populate Category Name
        const events = await Event.find().populate('Cat_Id', 'Name');

        // If no events found
        if (events.length === 0) {
            return res.status(404).json({
                message: "Event not found!"
            });
        }

        // Send events list
        res.status(200).json(events);

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Get Event by ID
// ========================================
exports.getEventById = async (req, res) => {
    try {
        // Find event by ID and populate Category Name
        const event = await Event
            .findById(req.params.id)
            .populate('Cat_Id', 'Name');

        // If event not found
        if (!event) {
            return res.status(404).json({
                message: "Event not found!"
            });
        }

        // Send event data
        res.status(200).json(event);

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Add New Event
// ========================================
exports.addEvent = async (req, res) => {
    try {
        const { Name } = req.body;

        // Check if event already exists
        const existing = await Event.findOne({ Name });
        if (existing) {
            return res.status(400).json({
                message: "Event already exists!"
            });
        }

        // Create new event
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();

        // Send success response
        res.status(201).json({
            message: "Event added successfully!",
            data: savedEvent
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Update Event
// ========================================
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Update event by ID
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // If event not found
        if (!updatedEvent) {
            return res.status(404).json({
                message: "Event not found!"
            });
        }

        // Send updated event
        res.status(200).json({
            message: "Event updated successfully!",
            data: updatedEvent
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Delete Event
// ========================================
exports.deleteEvent = async (req, res) => {
    try {
        // Delete event by ID
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        // If event not found
        if (!deletedEvent) {
            return res.status(404).json({
                message: "Event not found!"
            });
        }

        // Success response
        res.status(200).json({
            message: "Event deleted successfully!"
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};