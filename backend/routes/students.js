// --- START OF FILE students.js ---
const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
require('dotenv').config();

const cleanStudentData = (data) => {
    const cleaned = { ...data };
    const optionalUniqueFields = ['email', 'student_aadhar', 'admission_number'];
    
    optionalUniqueFields.forEach(field => {
        if (!cleaned[field] || (typeof cleaned[field] === 'string' && cleaned[field].trim() === '')) {
            delete cleaned[field];
        }
    });
    return cleaned;
};

// ==========================================
//  CREATE STUDENT (POST)
//  Logic: Manual Roll Number
// ==========================================
router.post('/', authMiddleware, async (req, res) => {
    try {
        const processedData = cleanStudentData(req.body);

        // --- 1. VALIDATION: Check for Manual Roll Number ---
        if (!processedData.admission_number) {
            return res.status(400).json({ message: "Roll Number (Admission Number) is required." });
        }

        // --- 2. DUPLICATE CHECKS ---
        if (processedData.admission_number) {
            const exists = await Student.findOne({ admission_number: processedData.admission_number });
            if (exists) return res.status(400).json({ message: `Roll Number '${processedData.admission_number}' already exists.` });
        }
        if (processedData.email) {
            const exists = await Student.findOne({ email: processedData.email });
            if (exists) return res.status(400).json({ message: 'Email already exists.' });
        }

        // --- 3. PASSWORD HANDLING ---
        const plainPassword = processedData.password && processedData.password.trim() !== "" 
            ? processedData.password 
            : 'student123'; 

        const newStudent = new Student({
            ...processedData,
            password: plainPassword 
        });

        await newStudent.save();

        res.status(201).json({
            ...newStudent.toObject(),
            generatedPassword: plainPassword 
        });

    } catch (error) {
        console.error("Create Error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `Duplicate data: ${field} already exists.` });
        }
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// ==========================================
//  UPDATE STUDENT (PUT)
// ==========================================
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updateData = cleanStudentData(req.body);
        
        // Allow updating admission_number if needed, but usually we block it.
        // If you want to allow changing Roll Number, comment out the next line.
        // delete updateData.admission_number; 

        if (updateData.password && updateData.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            delete updateData.password; 
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);

    } catch (error) {
        console.error("Update Error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `Error: ${field} already exists.` });
        }
        res.status(500).json({ message: 'Server error' }); 
    }
});

// ==========================================
//  GET ALL STUDENTS (GET)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const { search, course_type } = req.query;
        let query = {};

        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { student_name: regex },
                { admission_number: regex },
                { student_mobile: regex }
            ];
        }
        if (course_type && course_type.trim() !== "") {
            query.course_type = course_type;
        }

        const students = await Student.find(query).sort({ createdAt: -1 });
        res.json({ students });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// ==========================================
//  LOGIN, DELETE, BULK DELETE, PROFILE, GET SINGLE
//  (These remain unchanged but included for completeness)
// ==========================================

router.post('/login', async (req, res) => {
    let { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ message: 'Missing credentials' });

    try {
        identifier = identifier.trim();
        const student = await Student.findOne({
            $or: [{ email: identifier.toLowerCase() }, { admission_number: identifier }]
        });

        if (!student) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ student: { id: student._id } }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ 
            success: true, 
            token, 
            student: {
                id: student._id,
                name: student.student_name,
                admission_number: student.admission_number
            } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/bulk-delete', authMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        await Student.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Students deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).json({message: "Not Found"});
        res.json(student);
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const studentId = req.student?.id || req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'Unauthorized' });
        const studentProfile = await Student.findById(studentId).select('-password');
        if (!studentProfile) return res.status(404).json({ message: 'Student record not found' });
        res.json(studentProfile);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

module.exports = router;