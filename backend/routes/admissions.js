const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');
const Application = require('../models/Application');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post('/', async (req, res) => {
  const { name, email, phone, course, idProof, marksheet, photo } = req.body;

  if (!name || !email || !phone || !course || !idProof || !marksheet || !photo) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields or files.' });
  }

  try {
    const idProofDataUri = `data:${idProof.mimeType};base64,${idProof.data}`;
    const marksheetDataUri = `data:${marksheet.mimeType};base64,${marksheet.data}`;
    const photoDataUri = `data:${photo.mimeType};base64,${photo.data}`;

    const [idProofResult, marksheetResult, photoResult] = await Promise.all([
      cloudinary.uploader.upload(idProofDataUri, { folder: 'admissions/id_proofs' }),
      cloudinary.uploader.upload(marksheetDataUri, { folder: 'admissions/marksheets' }),
      cloudinary.uploader.upload(photoDataUri, { folder: 'admissions/photos' }),
    ]);

    const newApplication = new Application({
      name,
      email,
      phone,
      course,
      idProof: idProofResult.secure_url,
      marksheet: marksheetResult.secure_url,
      photo: photoResult.secure_url,
    });

    await newApplication.save();
    res.status(201).json({ status: 'success', message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ status: 'error', message: 'Server error while processing your application.' });
  }
});

module.exports = router;