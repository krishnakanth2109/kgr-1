const mongoose = require('mongoose');

// Sub-schema for addresses
const addressSchema = new mongoose.Schema({
    type: { type: String, enum: ['Permanent', 'Current'], required: true },
    address_line1: { type: String, trim: true },
    address_line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postal_code: { type: String, trim: true },
}, { _id: false });

// Sub-schema for parents/guardians
const parentSchema = new mongoose.Schema({
    relation: { type: String, enum: ['Father', 'Mother', 'Guardian'], required: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
}, { _id: false });

// Sub-schema for educational history
const educationSchema = new mongoose.Schema({
    level: { type: String, trim: true }, // e.g., '10th', '12th', 'Diploma'
    institution_name: { type: String, trim: true },
    board: { type: String, trim: true }, // e.g., 'CBSE', 'State Board'
    year_of_passing: { type: Number },
    marks: {
        type: { type: String, enum: ['Percentage', 'GPA', 'Marks'] },
        value: { type: String }, // Stored as string to accommodate different formats like '95.2' or '9.8'
    },
}, { _id: false });

// Main Student Schema
const studentSchema = new mongoose.Schema({
    // --- Basic Information ---
    admission_number: { type: String, required: true, unique: true, trim: true },
    
    // --- FIX APPLIED HERE ---
    roll_number: { 
        type: String, 
        required: false, 
        unique: true, 
        trim: true,
        sparse: true // <--- ADDED THIS: Allows multiple students to have no roll number
    },
    
    first_name: { type: String, required: true, trim: true },
    middle_name: { type: String, trim: true },
    last_name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: Date },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone_number: { type: String, required: true, trim: true },
    category: { type: String, enum: ['General', 'OBC', 'SC', 'ST'] },

    // --- Academic Information ---
    program: { type: String, enum: ['MPHW', 'MLT'], required: true },
    admission_year: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Graduated', 'Dropped Out'], default: 'Active' },
    
    // --- Embedded Documents (Arrays of Sub-schemas) ---
    addresses: [addressSchema],
    parents: [parentSchema],
    educational_history: [educationSchema],

    // --- Miscellaneous ---
    extras: {
        profile_photo_url: { type: String, default: '' },
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;