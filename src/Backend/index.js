// ========================================
// Load Environment Variables
// ========================================
require("dotenv").config();

// ========================================
// Import Required Packages
// ========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// ========================================
// Initialize App
// ========================================
const app = express();

// ========================================
// Middlewares
// ========================================
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL (Vite default)
    credentials: true               // Allow cookies
}));

// ========================================
// MongoDB Connection
// ========================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err.message));


// ========================================
// Routes
// ========================================

// Authentication Routes
app.use('/api/authentication', require("./Routes/AuthenticationRoutes"));

// Student Routes
app.use('/api/student', require("./Routes/StudentRoutes"));

// Category Routes
app.use('/api/category', require("./Routes/CategoryRoutes"));

// Event Routes
app.use('/api/event', require("./Routes/EventRoutes"));

// Registration Routes
app.use('/api/registration', require("./Routes/RegistrationRoutes"));

// ========================================
// Server Start
// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);