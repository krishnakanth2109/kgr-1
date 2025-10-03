const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware'); // For protecting routes

// @route   POST /api/students
// @desc    Add a new student
// @access  Private (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Check for duplicate roll_number, admission_number, or email
        const { roll_number, admission_number, email } = req.body;
        const existingStudent = await Student.findOne({ $or: [{ roll_number }, { admission_number }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: 'A student with the same Roll Number, Admission Number, or Email already exists.' });
        }

        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ message: 'Server error while creating student.' });
    }
});

// @route   GET /api/students
// @desc    Get all students with filtering, pagination, and sorting
// @access  Public (or Private if you prefer, just add authMiddleware)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc', ...filters } = req.query;

        const query = {};
        
        // Build filter query from request query params
        if (filters.searchQuery) {
            query.$or = [
                { first_name: { $regex: filters.searchQuery, $options: 'i' } },
                { last_name: { $regex: filters.searchQuery, $options: 'i' } },
                { roll_number: { $regex: filters.searchQuery, $options: 'i' } }
            ];
        }
        if (filters.admissionYear) query.admission_year = filters.admissionYear;
        if (filters.program) query.program = filters.program;
        if (filters.category) query.category = filters.category;
        if (filters.status) query.status = filters.status;
        
        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const students = await Student.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalStudents = await Student.countDocuments(query);
        const totalPages = Math.ceil(totalStudents / parseInt(limit));

        res.json({
            students,
            currentPage: parseInt(page),
            totalPages,
            totalStudents
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: 'Server error while fetching students.' });
    }
});

// @route   GET /api/students/:id
// @desc    Get a single student by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        res.json(student);
    } catch (error) {
        console.error("Error fetching student by ID:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route   PUT /api/students/:id
// @desc    Update a student's information
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // 'new: true' returns the updated doc, 'runValidators' ensures schema rules are checked
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        res.json(updatedStudent);
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: 'Server error while updating student.' });
    }
});

// @route   PATCH /api/students/status
// @desc    Update a student's status (e.g., Active, Dropped Out)
// @access  Private
router.patch('/status', authMiddleware, async (req, res) => {
    const { id, status } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error("Error updating student status:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        res.json({ message: 'Student deleted successfully.' });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Note: A route for bulk delete is not included here as it can be dangerous.
// It's safer for the frontend to call the single delete endpoint multiple times.
// If you absolutely need it, it can be added.

module.exports = router;