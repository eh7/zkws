const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_jwt_secret_key';

const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const existingUser = User.findByEmail(email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword };
  User.create(user);
  User.createUser(email, password); 

  // run authDb function in authDb lib debugging
  User.authDb();

  const token = jwt.sign({ user: { email } }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // run authDb function in authDb lib debugging
  User.authDb();

  const token = jwt.sign({ user: { email } }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Update password
router.post('/update-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = User.findByEmail(req.user.email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

  // run authDb function in authDb lib debugging
  User.authDb();

  user.password = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;

