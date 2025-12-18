const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    // --- 1. Admission Details ---
    admission_number: { type: String, unique: true, trim: true }, // Ad. No.
    academic_year: { type: String, trim: true }, // Academic Year
    photo_url: { type: String }, // Browse (Photo)
    
    // --- 2. Personal Details ---
    student_name: { type: String, required: true, trim: true }, // Name of the Student
    father_name: { type: String, trim: true }, // Name of the father
    mother_name: { type: String, trim: true }, // Name of the Mother
    dob: { type: Date }, // Date of Birth
    age: { type: Number }, // Age
    gender: { type: String, enum: ['Male', 'Female', 'Transgender'] }, // Radio Buttons

    // --- 3. Address Details ---
    postal_address: { type: String, trim: true }, // Postal Address
    district: { type: String, trim: true }, // District
    mandal: { type: String, trim: true }, // Mandal
    sachivalayam_name: { type: String, trim: true }, // Sachivalayam Name
    pincode: { type: String, trim: true }, // Pin code

    // --- 4. Community/Religion ---
    nationality: { type: String, default: 'Indian' }, // Nationality
    religion: { type: String, trim: true }, // Religion
    caste: { type: String, trim: true }, // Caste (Drop Down)
    sub_caste: { type: String, trim: true }, // Sub-Caste

    // --- 5. School Details (SSC) ---
    ssc_hall_ticket: { type: String, trim: true }, // Hall Ticket No.
    ssc_total_marks: { type: String, trim: true }, // Total
    ssc_pass_year: { type: String, trim: true }, // Year of Pass
    study_cert_ssc: { type: Boolean, default: false }, // Study Certificate (6th to 10th) - Checkbox

    // --- 6. Qualified Exam Details (Inter) ---
    inter_hall_ticket: { type: String, trim: true }, // Hall Ticket No.
    inter_total_marks: { type: String, trim: true }, // Total
    inter_pass_year: { type: String, trim: true }, // Year of Pass
    study_cert_inter: { type: Boolean, default: false }, // Study Certificate (Inter)
    transfer_cert_inter: { type: Boolean, default: false }, // Transfer Certificate (Inter)

    // --- 7. Scholarship / Bank / Aadhar Details ---
    student_aadhar: { type: String, trim: true, sparse: true }, // Student Aadhar No.
    mother_aadhar: { type: String, trim: true }, // Mother Aadhar No.
    father_aadhar: { type: String, trim: true }, // Father Aadhar No.
    mother_bank_acc: { type: String, trim: true }, // Mother Bank A/C No.
    bank_ifsc: { type: String, trim: true }, // Bank IFSC Code
    student_mobile: { type: String, trim: true }, // Student Mobile No.
    parent_mobile: { type: String, trim: true }, // Parent Mobile No.
    rice_card_no: { type: String, trim: true }, // Rice Card / Income Certificate No.
    caste_cert_no: { type: String, trim: true }, // Caste Certificate No.

    // --- 8. Moles ---
    mole_1: { type: String, trim: true }, // Moles: 1
    mole_2: { type: String, trim: true }, // Moles: 2

    // --- 9. System / Course Fields (Required for App Logic) ---
    course_type: { type: String, enum: ['GNM', 'Vocational'] },
    course_name: { type: String, enum: ['GNM', 'MPHW', 'MLT'] },
    email: { type: String, trim: true, lowercase: true, sparse: true }, // Sparse allows nulls to not be duplicates
    password: { type: String, default: 'student123' },
    
    // --- 10. Fees (Backend tracking) ---
    fees: {
        year_1_fee: { type: Number, default: 0 },
        year_2_fee: { type: Number, default: 0 },
        year_3_fee: { type: Number, default: 0 },
        total_fee: { type: Number, default: 0 },
        fee_paid: { type: Number, default: 0 }
    }

}, { timestamps: true });

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

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
module.exports = Student;