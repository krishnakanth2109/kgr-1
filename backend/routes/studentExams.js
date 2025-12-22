// backend/routes/studentExams.js
const express = require('express');
const router = express.Router();
const StudentExam = require('../models/StudentExam');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// 1. STATIC ROUTES (SPECIFIC PATHS)
// Must be defined BEFORE dynamic /:id routes
// ==========================================

// URL: POST /api/exams/bulk/create
router.post('/bulk/create', authMiddleware, async (req, res) => {
    const { program, admissionYear, examDetails } = req.body;

    if (!program || !admissionYear || !examDetails) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 1. Find all students matching the criteria
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

// URL: GET /api/exams/batch?program=MPHW&year=2024
// MOVED UP to prevent conflict with /:studentId
router.get('/batch', authMiddleware, async (req, res) => {
    const { program, year } = req.query;

    if (!program || !year) return res.status(400).json({ message: 'Missing program or year' });

    try {
        // 1. Find students in this batch first
        const students = await Student.find({ program, admission_year: year }).select('_id');
        const studentIds = students.map(s => s._id);

        if (studentIds.length === 0) return res.json([]);

        // 2. Find exams linked to these students
        // We group by subject/date/type to show unique exam events
        const exams = await StudentExam.aggregate([
            { $match: { student: { $in: studentIds } } },
            {
                $group: {
                    _id: { subject: "$subject", examDate: "$examDate", examType: "$examType" },
                    startTime: { $first: "$startTime" },
                    endTime: { $first: "$endTime" },
                    roomNo: { $first: "$roomNo" },
                    maxMarks: { $first: "$maxMarks" },
                    studentCount: { $sum: 1 } // Count how many students have this exam
                }
            },
            { $sort: { "_id.examDate": 1 } } // Sort by date ascending
        ]);

        res.json(exams);

    } catch (err) {
        console.error("Batch Exam Fetch Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// 2. DYNAMIC ROUTES (WILDCARDS)
// Must be defined AFTER static routes
// ==========================================

// GET exams for a specific student
// URL: GET /api/exams/:studentId
router.get('/:studentId', authMiddleware, async (req, res) => {
    try {
        const exams = await StudentExam.find({ student: req.params.studentId }).sort({ examDate: 1 });
        res.json(exams);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ message: 'Server Error' }); 
    }
});

// POST (Add Single Exam to specific student)
// URL: POST /api/exams/:studentId
router.post('/:studentId', authMiddleware, async (req, res) => {
    try {
        const newExam = new StudentExam({ ...req.body, student: req.params.studentId });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ message: 'Server Error' }); 
    }
});

// DELETE Exam
// URL: DELETE /api/exams/:examId
router.delete('/:examId', authMiddleware, async (req, res) => {
    try {
        await StudentExam.findByIdAndDelete(req.params.examId);
        res.json({ message: 'Exam deleted' });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ message: 'Server Error' }); 
    }
});

module.exports = router;