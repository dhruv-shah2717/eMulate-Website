// ========================================
// Import Required Modules
// ========================================
const express = require("express");
const router = express.Router();

// Import Registration Controller
const RegistrationController = require("../Controllers/RegistrationController");

// Import Admin and User Middleware
const { Admin } = require("../Middlewares/AdminMiddleware");
const { User } = require("../Middlewares/UserMiddleware");


// ========================================
// Registration Routes
// ========================================

// Get All Registrations
router.get("/", RegistrationController.getAllRegistration);

// Get Registration by Event ID
router.get("/:id", RegistrationController.getRegistrationByEventId);

// Get Registration by Student GR Number (User Only)
router.get("/student/grno", User, RegistrationController.getRegistrationByStudentGrno);

// Add New Registration (User Only)
router.post("/add", User, RegistrationController.addRegistration);

// Mark Attendance in Registration (Admin Only)
router.put("/attendance/:id", Admin, RegistrationController.addAttendanceInRegistration);

// Add Rank in Registration (Admin Only)
router.put("/rank/:id", Admin, RegistrationController.addRankInRegistration);

// Update Registration by ID (Admin Only)
router.put("/update/:id", Admin, RegistrationController.updateRegistration);

// Delete Registration by ID (Admin Only)
router.delete("/delete/:id", Admin, RegistrationController.deleteRegistration);


// ========================================
// Export Router
// ========================================
module.exports = router;