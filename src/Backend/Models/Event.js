// ========================================
// Import Mongoose
// ========================================
const mongoose = require("mongoose");


// ========================================
// Event Schema Definition
// ========================================
const EventSchema = new mongoose.Schema(
    {
        // Event Name
        Name: {
            type: String,
            required: true
        },

        // Event Registration Price
        Price: {
            type: Number,
            required: true
        },

        // Group Type (Solo / Duo / Team etc.)
        Group: {
            type: String,
            required: true
        },

        // Total Available Seats
        Seats: {
            type: Number,
            required: true
        },

        // Event Location
        Location: {
            type: String,
            required: true
        },

        // Event Time
        Time: {
            type: String,
            required: true
        },

        // Event Day
        Day: {
            type: String,
            required: true
        },

        // Event Coordinator Name
        Evn_Cordinator: {
            type: String,
            required: true
        },

        // Event Coordinator Contact Number
        Evn_Co_Number: {
            type: String,
            required: true
        },

        // Student Coordinator Name
        Stu_Cordinator: {
            type: String,
            required: true
        },

        // Student Coordinator Contact Number
        Stu_Co_Number: {
            type: String,
            required: true
        },

        // Reference to Category (Foreign Key)
        Cat_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        // Event Description
        Description: {
            type: String,
            required: true
        }
    },
    {
        // Automatically adds createdAt & updatedAt
        timestamps: true
    }
);


// ========================================
// Export Event Model
// ========================================
module.exports = mongoose.model("Event", EventSchema);