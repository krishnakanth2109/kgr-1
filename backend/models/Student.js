// --- START OF FILE backend/models/Student.js ---

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sub-schemas (kept as is)
const addressSchema = new mongoose.Schema({
    type: { type: String, enum: ['Permanent', 'Current'], required: true },
    address_line1: { type: String, trim: true },
    address_line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postal_code: { type: String, trim: true },
}, { _id: false });

const parentSchema = new mongoose.Schema({
    relation: { type: String, enum: ['Father', 'Mother', 'Guardian'], required: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
}, { _id: false });

const educationSchema = new mongoose.Schema({
    level: { type: String, trim: true },
    institution_name: { type: String, trim: true },
    board: { type: String, trim: true },
    year_of_passing: { type: Number },
    marks: {
        type: { type: String, enum: ['Percentage', 'GPA', 'Marks'] },
        value: { type: String }, 
    },
}, { _id: false });

const studentSchema = new mongoose.Schema({
    // --- Basic Information ---
    admission_number: { 
        type: String, 
        required: [true, 'Admission Number is required'], 
        unique: true, 
        trim: true 
    },
    // NEW FIELD: Password
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    roll_number: { 
        type: String, 
        required: false, 
        unique: true, 
        trim: true,
        sparse: true 
    },
    first_name: { type: String, required: [true, 'First Name is required'], trim: true },
    middle_name: { type: String, trim: true },
    last_name: { type: String, required: [true, 'Last Name is required'], trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: [true, 'Gender is required'] },
    dob: { type: Date, required: [true, 'Date of Birth is required'] },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phone_number: { 
        type: String, 
        required: [true, 'Phone Number is required'], 
        trim: true,
        match: [/^\d{10}$/, 'Phone number must be 10 digits'] 
    },
    category: { type: String, enum: ['General', 'OBC', 'SC', 'ST'] },

    // --- Academic Information ---
    program: { type: String, enum: ['MPHW', 'MLT'], required: [true, 'Program (Course) is required'] },
    admission_year: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Graduated', 'Dropped Out'], default: 'Active' },
    
    // --- Embedded Documents ---
    addresses: [addressSchema],
    parents: [parentSchema],
    educational_history: [educationSchema],

    extras: {
        profile_photo_url: { type: String, default: '' },
    }
}, {
    timestamps: true
});

// --- Pre-save Hook to Hash Password ---
studentSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;