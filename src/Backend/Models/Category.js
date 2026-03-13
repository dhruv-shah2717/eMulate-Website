// ========================================
// Import Mongoose
// ========================================
const mongoose = require("mongoose");


// ========================================
// Category Schema Definition
// ========================================
const CategorySchema = new mongoose.Schema(
    {
        // Category Name
        Name: {
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
// Export Category Model
// ========================================
module.exports = mongoose.model("Category", CategorySchema);