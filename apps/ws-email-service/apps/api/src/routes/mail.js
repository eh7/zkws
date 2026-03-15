const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

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


// Move email between folders (e.g., 'new' to 'cur')
router.post('/move/:id', auth, async (req, res) => {
  const { source, destination } = req.body; // e.g., { source: 'new', destination: 'cur' }
  const maildir = new Maildir({ path: MAILDIR_PATH });

  try {
    const oldPath = path.join(MAILDIR_PATH, source, req.params.id);
    const newPath = path.join(MAILDIR_PATH, destination, req.params.id);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ message: 'Email not found' });
    }

    fs.renameSync(oldPath, newPath);
    res.json({ message: 'Email moved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to move email' });
  }
});

// Mark email as read (move from 'new' to 'cur')
router.post('/mark-read/:id', auth, async (req, res) => {
  await moveEmail(req.params.id, 'new', 'cur', res);
});

// Delete email
router.delete('/:id', auth, async (req, res) => {
  const maildir = new Maildir({ path: MAILDIR_PATH });

  try {
    const emailPath = path.join(MAILDIR_PATH, 'new', req.params.id);
    if (fs.existsSync(emailPath)) {
      fs.unlinkSync(emailPath);
      return res.json({ message: 'Email deleted successfully' });
    }

    const curPath = path.join(MAILDIR_PATH, 'cur', req.params.id);
    if (fs.existsSync(curPath)) {
      fs.unlinkSync(curPath);
      return res.json({ message: 'Email deleted successfully' });
    }

    res.status(404).json({ message: 'Email not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete email' });
  }
});

module.exports = router;

// Helper function to move emails
async function moveEmail(id, source, destination, res) {
  const maildir = new Maildir({ path: MAILDIR_PATH });

  try {
    const oldPath = path.join(MAILDIR_PATH, source, id);
    const newPath = path.join(MAILDIR_PATH, destination, id);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ message: 'Email not found' });
    }

    fs.renameSync(oldPath, newPath);
    res.json({ message: 'Email moved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to move email' });
  }
}

