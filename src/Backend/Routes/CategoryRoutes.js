// ========================================
// Import Required Modules
// ========================================
const express = require("express");
const router = express.Router();

// Import Category Controller
const CategoryController = require("../Controllers/CategoryController");

// Import Admin Middleware
const { Admin } = require("../Middlewares/AdminMiddleware");


// ========================================
// Category Routes
// ========================================

// Get All Categories
router.get("/", CategoryController.getAllCategory);

// Add New Category (Admin Only)
router.post("/add", Admin, CategoryController.addCategory);

// Update Category by ID (Admin Only)
router.put("/update/:id", Admin, CategoryController.updateCategory);

// Delete Category by ID (Admin Only)
router.delete("/delete/:id", Admin, CategoryController.deleteCategory);


// ========================================
// Export Router
// ========================================
module.exports = router;