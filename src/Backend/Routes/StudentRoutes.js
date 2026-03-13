// ========================================
// Import Required Modules
// ========================================
const express = require("express");
const router = express.Router();

// Import Student Controller
const StudentController = require("../Controllers/StudentController");

// Import Admin Middleware
const { Admin } = require("../Middlewares/AdminMiddleware");


// ========================================
// Student Routes
// ========================================

// Get All Students
router.get("/", StudentController.getAllStudent);

// Get Student by GR Number
router.get("/:gr", StudentController.getStudentByGrno);

// Add New Student (Admin Only)
router.post("/add", Admin, StudentController.addStudent);

// Update Student by ID (Admin Only)
router.put("/update/:id", Admin, StudentController.updateStudent);

// Delete Student by ID (Admin Only)
router.delete("/delete/:id", Admin, StudentController.deleteStudent);


// ========================================
// Export Router
// ========================================
module.exports = router;