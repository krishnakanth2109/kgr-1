
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// @route   POST /api/contact
// @desc    Create a new contact message
// @access  Public
// @route   GET /api/contact
// @desc    Get all messages
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

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