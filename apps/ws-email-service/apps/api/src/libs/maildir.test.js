const Maildir = require('./maildir');

require('dotenv').config({ quiet: true })

const maildir = new Maildir(process.env.MAILDIR);

describe('Test maildir.js library functions', () => {
  it('request a list of emails in maildir inbox but not authed', async () => {
    const emails = await maildir.listEmails();
    console.log('Emails:', emails.length);

    const email = await maildir.readEmail(emails[0]);
    console.log('First email:', email);
  })
})

