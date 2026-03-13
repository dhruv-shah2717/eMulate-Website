// ========================================
// Import Student Model
// ========================================
const Student = require("../Models/Student");


// ========================================
// Get All Students
// ========================================
exports.getAllStudent = async (req, res) => {
    try {
        // Fetch all students
        const students = await Student.find({});

        // If no students found
        if (students.length === 0) {
            return res.status(404).json({
                message: "Student not found!"
            });
        }

        // Send students list
        res.status(200).json(students);

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Get Student by GR Number
// ========================================
exports.getStudentByGrno = async (req, res) => {
    try {
        // Get GR number from params
        const grNumber = req.params.gr;

        // Find student by GR number
        const student = await Student.findOne({
            Grno: Number(grNumber)
        });

        // If student not found
        if (!student) {
            return res.status(404).json({
                message: "Student not found!"
            });
        }

        // Send student data
        res.status(200).json(student);

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Add New Student
// ========================================
exports.addStudent = async (req, res) => {
    try {
        const { Grno, Email } = req.body;

        // Check duplicate GR No or Email
        const existing = await Student.findOne({
            $or: [
                { Grno: Grno },
                { Email: Email }
            ]
        });

        // If duplicate found
        if (existing) {
            return res.status(400).json({
                message: "Student with this GR No or Email already exists!"
            });
        }

        // Create new student
        const newStudent = new Student(req.body);
        await newStudent.save();

        // Send success response
        res.status(201).json({
            message: "Student added successfully!",
            data: newStudent
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Update Student
// ========================================
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Update student by ID
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // If student not found
        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found!"
            });
        }

        // Send updated student
        res.status(200).json({
            message: "Student updated successfully!",
            data: updatedStudent
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Delete Student
// ========================================
exports.deleteStudent = async (req, res) => {
    try {
        // Delete student by ID
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        // If student not found
        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found!"
            });
        }

        // Success response
        res.status(200).json({
            message: "Student deleted successfully!"
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};