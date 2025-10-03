
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// @route   POST /api/contact
// @desc    Create a new contact message
// @access  Public
router.post('/', async (req, res) => {
  const { fullName, email, message } = req.body;

  try {
    const newContact = new Contact({
      fullName,
      email,
      message
    });

    const contact = await newContact.save();
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;