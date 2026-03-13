// ========================================
// Import Mongoose
// ========================================
const mongoose = require("mongoose");


// ========================================
// Registration Schema Definition
// ========================================
const RegistrationSchema = new mongoose.Schema(
    {
        // Array of Student References (Foreign Key)
        Students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true
            }
        ],

        // Reference to Event (Foreign Key)
        Evn_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        // Payment Status (Success / Failed)
        Payment: {
            type: String,
            required: true,
            default: "Failed"
        },

        // Attendance Status
        Attend: {
            type: Boolean,
            required: true,
            default: false
        },

        // Rank in Event
        Rank: {
            type: String,
            required: true,
            default: "0"
        },
    },
    {
        // Automatically adds createdAt & updatedAt
        timestamps: true
    }
);


// ========================================
// Export Registration Model
// ========================================
module.exports = mongoose.model("Registration", RegistrationSchema);