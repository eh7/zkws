const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Maildir = require('../libs/maildir');
const simpleParser = require('mailparser').simpleParser;
const path = require('path');

// Path to your maildir (e.g., ~/Maildir or /var/mail/username)
const MAILDIR_PATH = path.join(__dirname, '../maildir');

// List all emails in the maildir
router.get('/list', auth, async (req, res) => {
  try {
    const maildir = new Maildir({
      path: MAILDIR_PATH,
      onNewMail: () => {}, // Optional: Handle new mail events
    });

    const emails = await new Promise((resolve, reject) => {
      maildir.on('end', () => resolve(maildir.list));
      maildir.on('error', reject);
      maildir.list();
    });

    const emailList = emails.map(email => ({
      id: email.name,
      path: email.path,
      date: email.stats.mtime,
    }));

    res.json(emailList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list emails' });
  }
});

// Get a specific email by filename
router.get('/:id', auth, async (req, res) => {
  try {
    const maildir = new Maildir({
      path: MAILDIR_PATH,
    });

    const emailPath = path.join(MAILDIR_PATH, 'new', req.params.id);
    const email = await simpleParser(await maildir.get(emailPath));

    res.json({
      from: email.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments: email.attachments,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: 'Email not found' });
  }
});

module.exports = router;

