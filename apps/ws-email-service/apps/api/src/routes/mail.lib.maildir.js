const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//const Maildir = require('../libs/maildir.mjs').default;
const Maildir = require('../libs/maildir');
const simpleParser = require('mailparser').simpleParser;
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config({ quiet: true })

// Path to your maildir (e.g., ~/Maildir or /var/mail/username)
//const MAILDIR_PATH = path.join(__dirname, process.env.MAILDIR);
const MAILDIR_PATH = process.env.MAILDIR;

const maildir = new Maildir(MAILDIR_PATH);

router.get('/listnew', auth, async (req, res) => {
  const newEmails = await maildir.listNewEmails();
  res.json({ newEmails });
})

// List all emails in the maildir
router.get('/list', auth, async (req, res) => {
  try {
    //console.log('MAILDIR_PATH', MAILDIR_PATH)
    const emails = await maildir.listEmails();
    res.json({ emails });

//    const maildir = new Maildir({
//      path: MAILDIR_PATH,
//      onNewMail: () => {}, // Optional: Handle new mail events
//    });

//    //console.log(await maildir.loadMessage(MAILDIR_PATH))
//    console.log('zxc', await maildir.monitor())
//    res.json({ messaage: 'WIP testing' });

	  /*
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
  */
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list emails' });
  }
});

// Get a specific email by filename
router.get('/:id', auth, async (req, res) => {
  try {
    const email = await maildir.readEmail(req.params.id);
    res.json({ email });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: 'Email not found' });
  }
});

router.get('/old/:id', auth, async (req, res) => {
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

router.delete('/:id', auth, async (req, res) => {
  await maildir.deleteEmail(req.params.id)
  res.json({ message: `Email '${req.params.id}' deleted` });
});


router.post('/send', auth, upload.array('attachments'), (req, res) => {
  const { to, subject, body } = req.body;
  const attachments = req.files;

  // Implement logic to send the email (e.g., using Nodemailer)
  console.log('Sending email:', { to, subject, body, attachments });

  res.json({ success: true });
});

module.exports = router;

