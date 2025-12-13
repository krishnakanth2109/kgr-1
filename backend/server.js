// --- START OF FILE server.js ---

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. CORS Configuration ---
// Allows requests from your local frontend and deployed site
app.use(cors({
  origin: [
    "http://localhost:3000",              // React Local
    "http://localhost:5173",              // Vite Local
    "https://kgr-college.netlify.app"     // Deployed Frontend
  ],
  credentials: true
}));

// --- 2. Middleware ---
// Increased limits to handle Base64 image uploads if necessary
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 3. MongoDB Connection ---
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('✅ MongoDB connection established successfully!'))
.catch((err) => { 
    console.error('❌ MongoDB connection error:', err); 
    process.exit(1); // Exit process with failure
});

// --- 4. API Routes ---

// General & Auth Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admissions', require('./routes/admissions'));

// Academic Management Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));

// --- FEE MANAGEMENT SYSTEM (CRITICAL FOR NEW FEATURES) ---
// 1. Fee Structures: Defines templates like "MPHW 2024-25" (Year 1, 2, 3 breakdown)
app.use('/api/fee-structures', require('./routes/feeStructureRoutes')); 

// 2. Student Fees: Handles individual student mappings, payments, and dues
app.use('/api/student-fees', require('./routes/studentFees')); 

// Student Academic Extras (Exams & Documents)
app.use('/api/documents', require('./routes/studentDocuments'));
app.use('/api/exams', require('./routes/studentExams')); 

// --- 5. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});