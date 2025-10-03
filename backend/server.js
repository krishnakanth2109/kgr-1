const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- THIS IS THE FIX ---
// Replace the simple app.use(cors()); with this more specific configuration.
// This explicitly allows your frontend (at http://localhost:5173) to make requests.
const corsOptions = {
  origin: 'http://localhost:5173', // Your Vite frontend's address
  optionsSuccessStatus: 200 // For legacy browser compatibility
};
app.use(cors(corsOptions));
// --- END OF FIX ---


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established successfully!'))
  .catch((err) => { console.error('MongoDB connection error:', err); process.exit(1); });

// --- API Routes (These remain the same) ---
const contactRoutes = require('./routes/contact');
const admissionsRoutes = require('./routes/admissions');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const facultyRoutes = require('./routes/faculty');

app.use('/api/contact', contactRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});