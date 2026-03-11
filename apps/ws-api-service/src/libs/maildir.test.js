require('dotenv').config();

const Maildir = require('./maildir')
const mailDirPath = process.env.MAILDIR

test('test 1', async () => {
  const maildir = new Maildir(mailDirPath)
  const emails = await maildir.listEmails();
  console.log('Emails:', emails);
  console.log('Emails.length:', emails.length);

  const email = await maildir.readEmail(emails[0]);
  console.log('First email:', email);

  expect(emails.length).toBeGreaterThan(0);
});

/*
(async () => {
  const emails = await maildir.listEmails();
  console.log('Emails:', emails);

  const email = await maildir.readEmail(emails[0]);
  console.log('First email:', email);
})();
*/
