const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const User = require('../models/User');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new FAQ
router.post('/', async (req, res) => {
  try {
    // Generate an ID if not provided
    if (!req.body.id) {
      const lastFAQ = await User.findOne().sort({ id: -1 });
      req.body.id = lastFAQ ? lastFAQ.id + 1 : 1;
    }
    
    const newFAQ = new User(req.body);
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a FAQ
router.delete('/:id', async (req, res) => {
  try {
    const faq = await User.findOneAndDelete({ id: req.params.id });
    if (!faq) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;