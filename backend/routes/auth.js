const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const Admin = require('../models/admin'); // Make sure path is correct
const transporter = require('../utils/mailer'); // We will create this file next

// @route   POST api/auth/register
// @desc    Register a new admin (FOR ONE-TIME SETUP ONLY)
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }

    admin = new Admin({ email, password });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully. You can now log in.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Create and sign a JWT
    const payload = { admin: { id: admin.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ success: true, token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- PASSWORD RESET FLOW ---

// 1. FORGOT PASSWORD: Generate and email an OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            // Still send a success message for security to not reveal if an email is registered
            return res.status(200).json({ message: 'If an account with that email exists, an OTP has been sent.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        admin.passwordResetOTP = otp;
        admin.passwordResetExpires = Date.now() + 600000; // 10 minutes
        await admin.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: 'Your Admin Password Reset OTP',
            text: `Your One-Time Password (OTP) for password reset is: ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: `An OTP has been sent to ${admin.email}.` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const admin = await Admin.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() } // Check if not expired
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid OTP or it has expired.' });
        }
        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 3. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const admin = await Admin.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid session. Please try the process again.' });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        // Invalidate the OTP
        admin.passwordResetOTP = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;