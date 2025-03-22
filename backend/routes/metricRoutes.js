const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ'); // Your FAQ model

// Get metrics grouped by department
router.get('/department-metrics', async (req, res) => {
  try {
    // Aggregate FAQs by department
    const metrics = await FAQ.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          department: '$_id',
          queries: '$count',
          _id: 0
        }
      }
    ]);
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

module.exports = router;