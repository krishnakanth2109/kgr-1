// backend/routes/studentFees.js
const express = require('express');
const router = express.Router();
const StudentFee = require('../models/StudentFee');
const authMiddleware = require('../middleware/authMiddleware');

// GET Fees
router.get('/:studentId', authMiddleware, async (req, res) => {
    try {
        let fees = await StudentFee.findOne({ student: req.params.studentId });
        if (!fees) {
            // Return empty structure if not found
            return res.json({ 
                structure: { year1: {}, year2: {}, year3: {} }, 
                payments: [] 
            });
        }
        res.json(fees);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// POST: Update Fee Structure
router.post('/structure/:studentId', authMiddleware, async (req, res) => {
    try {
        const { year1, year2, year3 } = req.body;
        const fees = await StudentFee.findOneAndUpdate(
            { student: req.params.studentId },
            { 
                student: req.params.studentId,
                $set: { 
                    'structure.year1': year1,
                    'structure.year2': year2,
                    'structure.year3': year3
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(fees);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// POST: Add Payment
router.post('/payment/:studentId', authMiddleware, async (req, res) => {
    try {
        const { year, feeTowards, amount, mode } = req.body;
        
        // Generate simple Receipt No (Timestamp + Random)
        const receiptNo = `REC-${Date.now()}-${Math.floor(Math.random()*1000)}`;

        const fees = await StudentFee.findOneAndUpdate(
            { student: req.params.studentId },
            { 
                $push: { 
                    payments: { year, feeTowards, amount, mode, receiptNo } 
                } 
            },
            { new: true, upsert: true }
        );
        res.json(fees);
    } catch (error) { res.status(500).json({ message: 'Payment Failed' }); }
});

module.exports = router;