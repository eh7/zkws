const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock maildir data
const maildir = {
  emails: [
    { id: 1, from: 'user1@example.com', subject: 'Hello', body: 'This is email 1' },
    { id: 2, from: 'user2@example.com', subject: 'Hi', body: 'This is email 2' },
  ],
};

// List all emails
router.get('/list', auth, (req, res) => {
  res.json(maildir.emails);
});

// Get specific email
router.get('/:id', auth, (req, res) => {
  const email = maildir.emails.find(e => e.id === parseInt(req.params.id));
  if (!email) return res.status(404).json({ message: 'Email not found' });
  res.json(email);
});

module.exports = router;

