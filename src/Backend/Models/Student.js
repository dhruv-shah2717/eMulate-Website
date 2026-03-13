// ========================================
// Import Mongoose
// ========================================
const mongoose = require("mongoose");


// ========================================
// Student Schema Definition
// ========================================
const StudentSchema = new mongoose.Schema(
    {
        // Student GR Number (Unique)
        Grno: {
            type: Number,
            required: true,
            unique: true
        },

        // Student Password
        Password: {
            type: String,
            required: true
        },

        // Student Full Name
        Name: {
            type: String,
            required: true
        },

        // Student Email (Unique)
        Email: {
            type: String,
            required: true,
            unique: true
        },

        // Student Phone Number
        Phone: {
            type: Number,
            required: true
        },

        // Student Course
        Course: {
            type: String,
            required: true
        },

        // User Role (Default: Normal)
        Role: {
            type: String,
            required: true,
            default: "Normal"
        },

        // MU Fest Passes Status
        Mu_Fest_Pass: {
            type: String,
            required: true,
            default: "NO"
        }
    },
    {
        // Automatically adds createdAt & updatedAt
        timestamps: true
    }
);


// ========================================
// Export Student Model
// ========================================
module.exports = mongoose.model("Student", StudentSchema);