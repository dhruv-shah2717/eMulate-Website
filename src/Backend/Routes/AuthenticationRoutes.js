// ========================================
// Import Required Modules
// ========================================
const express = require("express");
const router = express.Router();

// Import Authentication Controller
const AuthenticationController = require("../Controllers/AuthenticationController");


// ========================================
// Authentication Routes
// ========================================

// Check user role
router.get("/checkrole", AuthenticationController.checkrole);

// Login route
router.post("/login", AuthenticationController.login);

// Logout route
router.post("/logout", AuthenticationController.logout);

// Genrate Mu Fest Passes
router.post("/genrate/mufestpass", AuthenticationController.generateMuFestPass);

// ========================================
// Export Router
// ========================================
module.exports = router;