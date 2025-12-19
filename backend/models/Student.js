// --- START OF FILE models/Student.js ---
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    // --- Admission & Course ---
    admission_number: { type: String, unique: true, trim: true },
    academic_year: { type: String, trim: true },
    course_type: { type: String, enum: ['GNM', 'Vocational'] },
    course_name: { type: String, enum: ['GNM', 'MPHW', 'MLT'] },
    
    // --- Personal Details ---
    student_name: { type: String, required: true, trim: true },
    father_name: { type: String, trim: true },
    mother_name: { type: String, trim: true },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Transgender'] },
    
    // --- Contact ---
    email: { type: String, trim: true, lowercase: true, sparse: true },
    student_mobile: { type: String, trim: true },
    parent_mobile: { type: String, trim: true },

    // --- Address ---
    postal_address: { type: String, trim: true },
    district: { type: String, trim: true },
    mandal: { type: String, trim: true },
    
    // --- Documents & IDs ---
    student_aadhar: { type: String, trim: true, sparse: true },
    mole_1: { type: String, trim: true },
    mole_2: { type: String, trim: true },

    // --- NEW: File Upload URLs ---
    photo_url: { type: String }, // For student photo
    student_aadhar_url: { type: String }, // For Aadhar card copy
    study_cert_ssc_url: { type: String }, // For SSC certificate

    // --- Fees ---
    fees: {
        year_1_fee: { type: Number, default: 0 },
        year_2_fee: { type: Number, default: 0 },
        total_fee: { type: Number, default: 0 },
        fee_paid: { type: Number, default: 0 }
    },

    // --- System ---
    password: { type: String, default: 'student123' },

}, { timestamps: true });

// --- HOOKS (Auto ID & Password Hashing) ---
studentSchema.pre('save', async function (next) {
    try {
        if (this.isNew && !this.admission_number) {
            const lastStudent = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
            let nextNum = 1;
            if (lastStudent && lastStudent.admission_number) {
                const match = lastStudent.admission_number.match(/kgr(\d+)/i);
                if (match && match[1]) nextNum = parseInt(match[1], 10) + 1;
            }
            this.admission_number = `kgr${nextNum.toString().padStart(5, '0')}`;
        }

        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) { next(err); }
});

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);