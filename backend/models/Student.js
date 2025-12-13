const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- Sub-schemas ---
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

// --- Main Student Schema ---
const studentSchema = new mongoose.Schema({
    admission_number: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    
    // Using sparse for roll_number to allow null/unique values
    roll_number: { type: String, unique: true, trim: true, sparse: true },

    first_name: { type: String, required: true, trim: true },
    middle_name: { type: String, trim: true },
    last_name: { type: String, required: true, trim: true },
    
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: Date, required: true },
    
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone_number: { type: String, required: true, trim: true },
    category: { type: String, enum: ['General', 'OBC', 'SC', 'ST'] },

    program: { type: String, enum: ['MPHW', 'MLT'], required: true },
    admission_year: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Graduated', 'Dropped Out'], default: 'Active' },
    
    addresses: [addressSchema],
    parents: [parentSchema],
    educational_history: [educationSchema],

    extras: {
        profile_photo_url: { type: String, default: '' },
    }
}, {
    timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
});

// Ensure the model is not re-compiled if it already exists
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;