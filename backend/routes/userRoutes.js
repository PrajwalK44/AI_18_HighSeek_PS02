const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Middleware for checking admin role
const isAdmin = (req, res, next) => {
  if (req.auth && req.auth.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin role required.' });
};

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Add new user with validation
router.post('/', [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('department')
    .isIn(['HR', 'Sales', 'Finance', 'IT', 'Marketing']).withMessage('Invalid department'),
  body('role')
    .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password, department, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Create and save new user
    const user = new User({ username, password, department, role });
    await user.save();
    
    // Return success without password
    res.status(201).json({ 
      message: 'User created successfully.',
      user: {
        username: user.username,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error while adding user.' });
  }
});

// Delete user by username
router.delete('/:username', async (req, res) => {
  const { username } = req.params;

  // Protect admin user from deletion
  if (username === 'admin') {
    return res.status(403).json({ message: 'Cannot delete admin user.' });
  }

  try {
    const deleted = await User.findOneAndDelete({ username });
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
});

module.exports = router;