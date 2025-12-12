// --- START OF FILE backend/routes/students.js ---

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); // Added authMiddleware for protection
require('dotenv').config();

// @route   POST /api/students/login
// @desc    Student Login using Email OR Admission Number
router.post('/login', async (req, res) => {
    // 1. FIX: Trim inputs to remove accidental spaces
    let { identifier, password } = req.body;
    identifier = identifier?.trim();
    password = password?.trim();

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide ID/Email and password.' });
    }

    try {
        console.log(`Login Attempt: ${identifier}`); // Debug Log

        // Find student (Case-insensitive for Email)
        const student = await Student.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { admission_number: identifier }
            ]
        });

        if (!student) {
            console.log("User not found in DB");
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. FIX: Check if password exists in DB (for old accounts)
        if (!student.password) {
            console.log("Account exists but has no password set");
            return res.status(400).json({ message: 'Account not set up. Contact Admin.' });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT Token
        const payload = {
            student: {
                id: student._id,
                name: student.first_name,
                role: 'student'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    success: true,
                    token,
                    student: {
                        id: student._id,
                        name: `${student.first_name} ${student.last_name}`,
                        email: student.email,
                        admission_number: student.admission_number
                    }
                });
            }
        );

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/students
// @desc    Add a new student (Admin)
// @access  Protected
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { roll_number, admission_number, email, password } = req.body;

        // Check duplicates
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already exists.' });

        const existingAdmission = await Student.findOne({ admission_number });
        if (existingAdmission) return res.status(400).json({ message: 'Admission Number already exists.' });

        if (roll_number) {
            const existingRoll = await Student.findOne({ roll_number });
            if (existingRoll) return res.status(400).json({ message: 'Roll Number already exists.' });
        }

        // Set default password if not provided
        const finalPassword = password || 'student123';

        const newStudent = new Student({
            ...req.body,
            password: finalPassword // Pre-save hook in model will hash this
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate field value entered.' });
        }
        console.error("Error creating student:", error);
        res.status(500).json({ message: 'Server error while creating student.' });
    }
});

// @route   GET /api/students
// @desc    Get all students
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
        const query = {};
        
        if (filters.globalSearch) {
            query.$or = [
                { first_name: { $regex: filters.globalSearch, $options: 'i' } },
                { last_name: { $regex: filters.globalSearch, $options: 'i' } },
                { roll_number: { $regex: filters.globalSearch, $options: 'i' } },
                { admission_number: { $regex: filters.globalSearch, $options: 'i' } },
                { email: { $regex: filters.globalSearch, $options: 'i' } }
            ];
        }
        if (filters.program) query.program = filters.program;
        if (filters.status) query.status = filters.status;
        if (filters.admissionYear) query.admission_year = filters.admissionYear;

        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const students = await Student.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit));
        const totalStudents = await Student.countDocuments(query);

        res.json({ students, currentPage: parseInt(page), totalPages: Math.ceil(totalStudents / parseInt(limit)), totalStudents });
    } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

// @route   PUT /api/students/:id
// @desc    Update a student (FIXED PASSWORD HASHING)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updateData = { ...req.body };

        // 3. FIX: Handle Password Hashing on Update
        if (updateData.password) {
            if (updateData.password.trim() === "") {
                delete updateData.password; // Don't update if empty string sent
            } else {
                // Manually hash because findByIdAndUpdate doesn't trigger pre-save hook
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedStudent) return res.status(404).json({ message: 'Student not found.' });
        res.json(updatedStudent);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server error.' }); 
    }
});

// @route   DELETE /api/students/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });
        res.json({ message: 'Student deleted successfully.' });
    } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

// @route   POST /api/students/bulk-delete
router.post('/bulk-delete', authMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'No IDs provided.' });
        await Student.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Students deleted successfully.' });
    } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});
// Add this route AFTER the login route but BEFORE the '/:id' update route
// @route   GET /api/students/:id
// @desc    Get single student by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });
        res.json(student);
    } catch (error) { 
        res.status(500).json({ message: 'Server error.' }); 
    }
});
module.exports = router;