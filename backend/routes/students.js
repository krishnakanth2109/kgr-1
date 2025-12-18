const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
require('dotenv').config();

// Helper: Remove empty strings to prevent MongoDB Unique Index errors
// This is critical because MongoDB treats "" as a unique value duplicate.
const cleanStudentData = (data) => {
    const cleaned = { ...data };
    const optionalUniqueFields = ['email', 'student_aadhar', 'admission_number'];
    
    optionalUniqueFields.forEach(field => {
        if (!cleaned[field] || cleaned[field].trim() === '') {
            delete cleaned[field];
        }
    });
    return cleaned;
};

// ==========================================
//  CREATE STUDENT (POST)
//  Logic: Auto-generates ID (kgr00001) if not provided
// ==========================================
router.post('/', authMiddleware, async (req, res) => {
    try {
        const processedData = cleanStudentData(req.body);

        // --- 1. AUTO INCREMENT LOGIC (No Counter Model) ---
        if (!processedData.admission_number) {
            // Find the most recently created student
            const lastStudent = await Student.findOne({}, { admission_number: 1 })
                .sort({ createdAt: -1 })
                .lean();

            let nextSeq = 1;
            if (lastStudent && lastStudent.admission_number) {
                // Extract number from format "kgr00001"
                const match = lastStudent.admission_number.match(/kgr(\d+)/i);
                if (match && match[1]) {
                    nextSeq = parseInt(match[1], 10) + 1;
                }
            }

            // Generate new ID (e.g., kgr00001)
            const autoId = `kgr${nextSeq.toString().padStart(5, '0')}`;
            processedData.admission_number = autoId;
        }

        // --- 2. DUPLICATE CHECKS (Manual check for clear error messages) ---
        if (processedData.admission_number) {
            const exists = await Student.findOne({ admission_number: processedData.admission_number });
            if (exists) return res.status(400).json({ message: `Admission Number '${processedData.admission_number}' already exists.` });
        }
        if (processedData.email) {
            const exists = await Student.findOne({ email: processedData.email });
            if (exists) return res.status(400).json({ message: 'Email already exists.' });
        }

        // --- 3. PASSWORD HANDLING ---
        const plainPassword = processedData.password && processedData.password.trim() !== "" 
            ? processedData.password 
            : 'student123'; // Default password

        const newStudent = new Student({
            ...processedData,
            password: plainPassword // Mongoose pre-save hook will hash this
        });

        await newStudent.save();

        // --- 4. SUCCESS RESPONSE ---
        // Return the object + plain password so the Admin UI can show the popup
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
        
        // Prevent manual ID update to avoid conflicts
        delete updateData.admission_number; 

        // Handle Password Update manually 
        // (findByIdAndUpdate bypasses Mongoose pre-save hooks, so we hash here)
        if (updateData.password && updateData.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            delete updateData.password; // Don't overwrite with empty string
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
//  GET ALL STUDENTS (GET) - With Search & Filter
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
//  LOGIN (POST) - For Student Portal
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

// ==========================================
//  DELETE SINGLE STUDENT (DELETE)
// ==========================================
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==========================================
//  BULK DELETE (POST) - For Batch Actions
// ==========================================
router.post('/bulk-delete', authMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided" });
        }
        
        await Student.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Students deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==========================================
//  GET SINGLE STUDENT (GET)
// ==========================================
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).json({message: "Not Found"});
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==========================================
//  GET PROFILE (GET) - For Logged in Student
// ==========================================
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // req.student is set by authMiddleware
        const studentId = req.student?.id || req.user?.id;
        
        if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

        const studentProfile = await Student.findById(studentId).select('-password');
        
        if (!studentProfile) return res.status(404).json({ message: 'Student record not found' });

        res.json(studentProfile);
    } catch (err) {
        console.error("Profile Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;