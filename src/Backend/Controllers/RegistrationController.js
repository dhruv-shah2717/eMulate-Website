// ========================================
// Environment & Model Imports
// ========================================
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Registration = require("../Models/Registration");
const Student = require("../Models/Student");
const Event = require("../Models/Event");
const mongoose = require("mongoose");


// ========================================
// Get All Registrations
// ========================================
exports.getAllRegistration = async (req, res) => {
    try {
        const registrations = await Registration.find({})
            .populate("Evn_Id", "Name Day Location Time Price")
            .populate("Students", "Grno Name");

        if (registrations.length === 0) {
            return res.status(404).json({
                message: "Registration not found!"
            });
        }

        res.status(200).json(registrations);

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Get Registration by Event ID
// ========================================
exports.getRegistrationByEventId = async (req, res) => {
    try {
        const registrations = await Registration.find({
            Evn_Id: req.params.id
        }).populate("Students");

        if (!registrations) {
            return res.status(404).json({
                message: "Registration not found!"
            });
        }

        res.status(200).json(registrations);

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Get Registration by Logged-in Student
// ========================================
exports.getRegistrationByStudentGrno = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "No token found!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.id;

        if (!studentId) {
            return res.status(400).json({
                message: "Token does not contain a valid ID"
            });
        }

        const registrations = await Registration.find({
            Students: {
                $in: [new mongoose.Types.ObjectId(studentId)]
            }
        })
            .populate("Evn_Id", "Name Day Location Time Price")
            .populate("Students", "Grno Name");

        if (registrations.length === 0) {
            return res.status(200).json({
                message: "No registrations found!"
            });
        }

        res.status(200).json(registrations);

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Add New Registration
// ========================================
exports.addRegistration = async (req, res) => {
    try {
        const { eventId, grNumbers, paymentStatus } = req.body;

        // Fetch students by GR numbers
        const studentDocs = await Student.find({
            Grno: { $in: grNumbers }
        });

        const studentIds = studentDocs.map(doc => doc._id);

        if (studentIds.length !== grNumbers.length) {
            return res.status(400).json({
                message: "One or more students not found in database"
            });
        }

        const newRegistration = new Registration({
            Evn_Id: eventId,
            Students: studentIds,
            Payment: paymentStatus
        });

        await newRegistration.save();

        // Decrease seat if payment success
        if (paymentStatus === "Success") {
            await Event.findByIdAndUpdate(eventId, {
                $inc: { Seats: -1 }
            });
        }

        res.status(201).json({
            message:
                paymentStatus === "Success"
                    ? "Registered successfully and seat reserved!"
                    : "Record saved with Failed payment.",
            data: newRegistration
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Mark Attendance
// ========================================
exports.addAttendanceInRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { Attend } = req.body;

        const updatedRegistration = await Registration.findByIdAndUpdate(
            id,
            { Attend: Attend },
            { new: true, runValidators: true }
        );

        if (!updatedRegistration) {
            return res.status(404).json({
                message: "Registration record not found!"
            });
        }

        res.status(200).json({
            message: `Attendance marked as ${Attend ? "Present" : "Absent"}!`,
            data: updatedRegistration
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Add Rank
// ========================================
exports.addRankInRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { Rank } = req.body;

        const updatedRegistration = await Registration.findByIdAndUpdate(
            id,
            { Rank: Rank },
            { new: true }
        );

        if (!updatedRegistration) {
            return res.status(404).json({
                message: "Registration not found!"
            });
        }

        res.status(200).json({
            message: "Rank updated successfully!",
            data: updatedRegistration
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Update Registration
// ========================================
exports.updateRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventId, grNumbers, paymentStatus } = req.body;

        const oldRegistration = await Registration.findById(id);

        if (!oldRegistration) {
            return res.status(404).json({
                message: "Registration not found!"
            });
        }

        let studentIds = oldRegistration.Students;

        // Update students if provided
        if (grNumbers) {
            const studentDocs = await Student.find({
                Grno: { $in: grNumbers }
            });

            if (studentDocs.length !== grNumbers.length) {
                return res.status(400).json({
                    message: "One or more students not found"
                });
            }

            studentIds = studentDocs.map(doc => doc._id);
        }

        // Handle seat adjustment on payment change
        if (paymentStatus && paymentStatus !== oldRegistration.Payment) {

            if (paymentStatus === "Success") {
                await Event.findByIdAndUpdate(
                    oldRegistration.Evn_Id,
                    { $inc: { Seats: -1 } }
                );
            }

            else if (
                oldRegistration.Payment === "Failed" &&
                paymentStatus !== "Failed"
            ) {
                await Event.findByIdAndUpdate(
                    oldRegistration.Evn_Id,
                    { $inc: { Seats: 1 } }
                );
            }
        }

        const updatedRegistration = await Registration.findByIdAndUpdate(
            id,
            {
                Evn_Id: eventId || oldRegistration.Evn_Id,
                Students: studentIds,
                Payment: paymentStatus || oldRegistration.Payment
            },
            { new: true }
        );

        res.status(200).json({
            message: "Registration updated successfully!",
            data: updatedRegistration
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Delete Registration
// ========================================
exports.deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found!"
            });
        }

        const eventId = registration.Evn_Id;

        await Registration.findByIdAndDelete(id);

        // Restore seat if payment was successful
        if (registration.Payment === "Success") {
            await Event.findByIdAndUpdate(eventId, {
                $inc: { Seats: 1 }
            });
        }

        res.status(200).json({
            message: "Registration deleted successfully and seat restored!"
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};