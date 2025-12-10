// --- START OF FILE server.js ---

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CORS Configuration ---
app.use(cors({
  origin: [
    "http://localhost:3000",              // For local React development
    "http://localhost:5173",              // For local Vite development
    "https://kgr-college.netlify.app"     // Your deployed Netlify Frontend
  ],
  credentials: true
}));

// --- Middleware ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- MongoDB Connection ---
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connection established successfully!'))
  .catch((err) => { 
    console.error('❌ MongoDB connection error:', err); 
    process.exit(1); 
  });

// --- API Routes ---

// General Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admissions', require('./routes/admissions'));

// Academic Management Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));

// NEW FEATURES (Fees, Exams, Documents)
app.use('/api/fees', require('./routes/studentFees'));
app.use('/api/documents', require('./routes/studentDocuments'));
app.use('/api/exams', require('./routes/studentExams')); // <--- Critical for Exam Scheduler

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});