const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// POST: Submit Application (Name, Email, Phone only)
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  // Basic Server-side Validation
  if (!name || !email || !phone) {
    return res.status(400).json({ status: 'error', message: 'Please provide Name, Email, and Phone number.' });
  }

  try {
    const newApplication = new Application({
      name,
      email,
      phone
    });

    await newApplication.save();
    res.status(201).json({ status: 'success', message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ status: 'error', message: 'Server error while processing your application.' });
  }
});

// GET: Fetch All Applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ submissionDate: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch applications' });
  }
});

// DELETE: Remove Application
router.delete('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    
    await Application.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

module.exports = router;