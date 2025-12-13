const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import Model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

// Debugging: Ensure Model is loaded correctly
if (!Student || typeof Student.findOne !== 'function') {
    console.error("CRITICAL ERROR: Student Model not loaded correctly in students.js");
}

// @route   POST /api/students/login
router.post('/login', async (req, res) => {
    let { identifier, password } = req.body;
    
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide ID/Email and password.' });
    }

    try {
        identifier = identifier.trim();
        const studentData = await Student.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { admission_number: identifier }
            ]
        });

        if (!studentData) return res.status(400).json({ message: 'Invalid Credentials' });
        
        // Allow login even if password hash logic changed (optional fallback)
        const isMatch = await bcrypt.compare(password, studentData.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = {
            student: {
                id: studentData._id,
                name: studentData.first_name,
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
                        id: studentData._id,
                        name: `${studentData.first_name} ${studentData.last_name}`,
                        email: studentData.email,
                        admission_number: studentData.admission_number
                    }
                });
            }
        );

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
//  PROFILE ROUTES (Protected)
// ==========================================

// @route   GET /api/students/profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Handle various payload structures
        const studentId = req.student?.id || req.user?.id;

        if (!studentId) {
            console.error("Profile Error: No Student ID in request");
            return res.status(401).json({ message: 'Unauthorized: User ID missing' });
        }

        const studentProfile = await Student.findById(studentId).select('-password');
        
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        res.json(studentProfile);
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   PUT /api/students/profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const studentId = req.student?.id || req.user?.id;
        const { first_name, last_name, email, phone_number, dob, gender, category, addresses, parents } = req.body;

        const updateFields = {};
        if (first_name) updateFields.first_name = first_name;
        if (last_name) updateFields.last_name = last_name;
        if (email) updateFields.email = email;
        if (phone_number) updateFields.phone_number = phone_number;
        if (dob) updateFields.dob = dob;
        if (gender) updateFields.gender = gender;
        if (category) updateFields.category = category;
        if (addresses) updateFields.addresses = addresses;
        if (parents) updateFields.parents = parents;

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedStudent);
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/students/change-password
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const studentId = req.student?.id || req.user?.id;
        const { currentPassword, newPassword } = req.body;

        const studentData = await Student.findById(studentId);
        if (!studentData) return res.status(404).json({ message: 'Student not found' });

        const isMatch = await bcrypt.compare(currentPassword, studentData.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        studentData.password = await bcrypt.hash(newPassword, salt);
        await studentData.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error("Password Change Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
//  ADMIN MANAGEMENT ROUTES
// ==========================================

// @route   POST /api/students
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { admission_number, email, password } = req.body;

        const existingStudent = await Student.findOne({ 
            $or: [{ email }, { admission_number }] 
        });
        
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this Email or Admission Number already exists.' });
        }

        const newStudent = new Student({
            ...req.body,
            password: password || 'student123'
        });

        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Create Student Error:", error);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// @route   GET /api/students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json({ students });
    } catch (error) { 
        res.status(500).json({ message: 'Server error' }); 
    }
});

// @route   PUT /api/students/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password && updateData.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            delete updateData.password;
        }

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json(updatedStudent);
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// @route   DELETE /api/students/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// @route   GET /api/students/:id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;