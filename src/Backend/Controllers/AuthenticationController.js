// ========================================
// Environment & Model Imports
// ========================================
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Student = require("../Models/Student");
const Registration = require("../Models/Registration");


// ========================================
// Check User Role From Token
// ========================================
exports.checkrole = async (req, res) => {
    try {
        const token = req.cookies.token;

        // If no token, treat as Normal user
        if (!token) {
            return res.status(200).json({
                Role: "Normal"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Student.findById(decoded.id).select("Role");

        if (!user) {
            return res.status(404).json({
                Role: "Normal",
                message: "User not found"
            });
        }

        res.status(200).json({
            Role: user.Role
        });

    } catch (err) {
        res.status(401).json({
            Role: "Normal",
            error: err.message
        });
    }
};


// ========================================
// Login Controller
// ========================================
exports.login = async (req, res) => {
    try {
        const { Grno, Password } = req.body;

        // Find user by GR Number
        const user = await Student.findOne({
            Grno: Number(Grno)
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid GR Number!"
            });
        }

        // Check Password
        if (user.Password !== Password) {
            return res.status(401).json({
                message: "Invalid Password!"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                grNo: user.Grno,
                role: user.Role
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Store token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,              // Prevent JavaScript access (security)
            secure: true,               // Set true in production with HTTPS
            sameSite: "None",             // Required for cross-origin
            maxAge: 24 * 60 * 60 * 1000  // 24 hours
        });

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                name: user.Name,
                role: user.Role,
                grNo: user.Grno
            }
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Logout Controller
// ========================================
exports.logout = (req, res) => {

    // Clear authentication cookie
    res.clearCookie("token");

    res.status(200).json({
        message: "Logged out successfully!"
    });
};


// ========================================
// Helper Mail Function, Genrated Mu Fest Passes
// ========================================
const sendFestEmail = async (studentEmail, studentName, token) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services or SMTP
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your app password
        },
    });

    const mailOptions = {
        from: '"MU Fest Team" <no-reply@marwadiuniversity.ac.in>',
        to: studentEmail,
        subject: 'Congratulations! Your MU Fest Pass is Here',
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: #0d6efd;">Congratulations ${studentName}!</h2>
                <p>You have been invited to the <b>MU Fest</b> based on your event participation.</p>
                <div style="background: #f8f9fa; padding: 15px; border-left: 5px solid #0d6efd; margin: 20px 0;">
                    <p style="margin: 0; font-size: 18px;">Your Unique Token Number:</p>
                    <h1 style="margin: 5px 0; letter-spacing: 5px; color: #333;">${token}</h1>
                </div>
                <p>Please keep this token safe. You will need it for entry.</p>
                <p>See you at the Fest!</p>
                <hr>
                <small>Marwadi University - Fest Committee</small>
                <p>Mr Dhruv Shah<p/>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

exports.generateMuFestPass = async (req, res) => {
    try {
        // Fetch all registrations
        const attendingRegistrations = await Registration.find({ Attend: true })
            .populate("Students", "Grno Email Name"); // Added Email and Name to populate

        // If no student found
        if (!attendingRegistrations.length) {
            return res.status(404).json({ message: "No attending registrations found!" });
        }

        // Using Map to store student details by GRNO
        const uniqueStudents = new Map();
        attendingRegistrations.forEach(reg => {
            reg.Students.forEach(student => {
                if (student.Grno) {
                    uniqueStudents.set(student.Grno, {
                        Grno: student.Grno,
                        Email: student.Email,
                        Name: student.Name
                    });
                }
            });
        });

        const updatedCount = [];

        // Loop through unique students
        for (let [grno, details] of uniqueStudents) {
            const muPassToken = Math.floor(1000000000 + Math.random() * 9000000000).toString();

            const studentUpdate = await Student.findOneAndUpdate(
                { Grno: grno },
                { $set: { Mu_Fest_Pass: muPassToken } },
                { new: true }
            );

            if (studentUpdate) {
                // Send Email
                try {
                    await sendFestEmail(details.Email, details.Name, muPassToken);
                } catch (mailErr) {
                    // We continue even if mail fails for one student
                    console.error(`Mail failed for ${details.Email}:`, mailErr);
                }
                updatedCount.push(grno);
            }
        }

        // Success response
        res.status(200).json({
            message: `MU Passes generated and emails sent to ${updatedCount.length} students!`,
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
