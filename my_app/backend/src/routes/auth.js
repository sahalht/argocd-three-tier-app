const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateEmail, validatePassword, validateName } = require('../utils/validation');

const router = express.Router();

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// JWT Secret validation
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
if (JWT_SECRET === 'fallback_secret') {
  console.warn('⚠️  WARNING: Using fallback JWT secret. Set JWT_SECRET in production!');
}

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (!validateName(name)) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  // Check if user exists
  const existingUser = await User.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Create user
  const user = await User.createUser(email, password, name);

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = await User.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await User.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
}));

// Get user profile
router.get('/profile', auth, asyncHandler(async (req, res) => {
  const user = await User.findUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
}));

module.exports = router;

