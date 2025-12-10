// backend/models/StudentFee.js
const mongoose = require('mongoose');

// Schema for Fee Structure (Total Amount to be paid)
const feeStructureSchema = {
    admissionFee: { type: Number, default: 0 },
    collegeFee: { type: Number, default: 0 },
    hostelFee: { type: Number, default: 0 },
    scholarship: { type: Number, default: 0 },
    booksFee: { type: Number, default: 0 },
    uniformFee: { type: Number, default: 0 },
    clinicalFee: { type: Number, default: 0 },
    cautionDeposit: { type: Number, default: 0 },
    busFee: { type: Number, default: 0 }
};

// Schema for Individual Payments
const paymentSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    year: { type: String, enum: ['1st', '2nd', '3rd'], required: true },
    feeTowards: { type: String, required: true },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ['Cash', 'Online', 'Cheque'], default: 'Cash' },
    receiptNo: { type: String } // Optional: Auto-generated on backend or frontend
});

const studentFeeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    
    // Fee Structures (Targets)
    structure: {
        year1: feeStructureSchema,
        year2: feeStructureSchema,
        year3: feeStructureSchema
    },

    // Transaction History
    payments: [paymentSchema]

}, { timestamps: true });

module.exports = mongoose.model('StudentFee', studentFeeSchema);