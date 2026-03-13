// ========================================
// Import Required Modules
// ========================================
const jwt = require("jsonwebtoken");
const Student = require("../Models/Student");


// ========================================
// Admin Middleware
// ========================================
const Admin = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "No token, authorization denied"
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await Student.findById(decoded.id);

        // If user not found
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if user role is Admin
        if (user.Role !== "Admin") {
            return res.status(403).json({
                message: "Access denied: Admin can access only!"
            });
        }

        // If everything is valid, move to next middleware/controller
        next();

    } catch (err) {
        // Log error in console
        console.error("Admin Middleware Error:", err.message);

        // Token invalid or expired
        res.status(401).json({
            message: "Token is not valid"
        });
    }
};


// ========================================
// Export Middleware
// ========================================
module.exports = { Admin };