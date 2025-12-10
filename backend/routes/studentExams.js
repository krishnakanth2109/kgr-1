// backend/routes/studentExams.js
const express = require('express');
const router = express.Router();
const StudentExam = require('../models/StudentExam');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// 1. STATIC ROUTES (Must be defined first)
// ==========================================

// NEW: Bulk Create Exams for a specific batch
// URL: POST /api/exams/bulk/create
router.post('/bulk/create', authMiddleware, async (req, res) => {
    const { program, admissionYear, examDetails } = req.body;

    if (!program || !admissionYear || !examDetails) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 1. Find all students matching the criteria
        // Note: Ensure admission_year matches the type in your DB (Number vs String)
        const students = await Student.find({ 
            program: program, 
            admission_year: admissionYear,
            status: 'Active' 
        });

        if (students.length === 0) {
            return res.status(404).json({ message: `No active students found for ${program} - ${admissionYear}` });
        }

        // 2. Prepare exam objects
        const examDocs = students.map(student => ({
            student: student._id,
            subject: examDetails.subject,
            examDate: examDetails.examDate,
            startTime: examDetails.startTime,
            endTime: examDetails.endTime,
            roomNo: examDetails.roomNo,
            examType: examDetails.examType,
            maxMarks: examDetails.maxMarks,
            isPublished: true
        }));

        // 3. Bulk Insert
        await StudentExam.insertMany(examDocs);

        res.json({ message: `Successfully scheduled exams for ${students.length} students.` });

    } catch (err) {
        console.error("Bulk Exam Error:", err);
        res.status(500).json({ message: 'Server Error while scheduling exams.' });
    }
});

// ==========================================
// 2. DYNAMIC ROUTES (Defined after static)
// ==========================================

// GET exams for a specific student
// URL: GET /api/exams/:studentId
router.get('/:studentId', authMiddleware, async (req, res) => {
    try {
        const exams = await StudentExam.find({ student: req.params.studentId }).sort({ examDate: 1 });
        res.json(exams);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// POST (Add Single Exam)
// URL: POST /api/exams/:studentId
router.post('/:studentId', authMiddleware, async (req, res) => {
    try {
        const newExam = new StudentExam({ ...req.body, student: req.params.studentId });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// DELETE Exam
// URL: DELETE /api/exams/:examId
router.delete('/:examId', authMiddleware, async (req, res) => {
    try {
        await StudentExam.findByIdAndDelete(req.params.examId);
        res.json({ message: 'Exam deleted' });
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

module.exports = router;