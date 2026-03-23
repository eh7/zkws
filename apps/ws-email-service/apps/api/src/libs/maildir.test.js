const Maildir = require('./maildir');
const fs = require('fs')

require('dotenv').config({ quiet: true })

//src/libs/generateTestMaildir.js

fs.rmSync(process.env.MAILDIR_LIVE_TEST, { recursive: true, force: true })
fs.cpSync(process.env.MAILDIR_MASTER_COPY, process.env.MAILDIR_LIVE_TEST, { recursive: true });

const maildir = new Maildir(process.env.MAILDIR_LIVE_TEST);

describe('Test maildir.js library functions', () => {
  it('request a list of emails in maildir', async () => {
    const emails = await maildir.listEmails();
    //console.log('Emails:', emails.length);
    expect(emails.length).toBe(5)
  });

  it('check subject of first eail is correct in test maildir', async () => {
    const emails = await maildir.listEmails();
    const email = await maildir.readEmail(emails[0].filename);
    //console.log('First email:', email);
    expect(email.subject).toBe("Test Email 1")
  });

  it('check second last email in test maildir has 1 attachment', async () => {
    const emails = await maildir.listEmails();
    const secondLastEmail = await maildir.readEmail(emails[emails.length - 2].filename);
    //console.log('Second Last email attachments:', secondLastEmail.attachments.length);
    expect(secondLastEmail.attachments.length).toBe(2)
  });

  it('check second last email in test maildir has 1 attachment', async () => {
    const emails = await maildir.listEmails();
    const lastEmail = await maildir.readEmail(emails[emails.length - 1].filename);
    //console.log('Last email attachments:', lastEmail.attachments.length);
    expect(lastEmail.attachments.length).toBe(1);
    expect(lastEmail.attachments[0].filename).toBe("sample.pdf");
  });

  it('check new emails list in test maildir has correct number of messages', async () => {
    const newEmails = await maildir.listNewEmails();
    //console.log(newEmails)
    expect(newEmails.length).toBe(5)
  });

  it('check readNewEmail from emails list in test maildir moved to cur directory', async () => {
    const emails = await maildir.listNewEmails();
    await maildir.readAndMoveNewEmail(emails[0].filename)
    const newEmails = await maildir.listNewEmails();
    expect(newEmails.length).toBe(4)
  });

  it('check delete maildir remove file', async () => {
//    const emails = await maildir.listEmails();
//    console.log(emails)
  });

  it('check send, send email', async () => {
  });
})

