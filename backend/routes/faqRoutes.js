const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new FAQ
router.post('/', async (req, res) => {
  try {
    // Generate an ID if not provided
    if (!req.body.id) {
      const lastFAQ = await FAQ.findOne().sort({ id: -1 });
      req.body.id = lastFAQ ? lastFAQ.id + 1 : 1;
    }
    
    const newFAQ = new FAQ(req.body);
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a FAQ
router.delete('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findOneAndDelete({ id: req.params.id });
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;