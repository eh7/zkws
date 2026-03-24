const Maildir = require('./maildir');
const fs = require('fs')

require('dotenv').config({ quiet: true })

//src/libs/generateTestMaildir.js

fs.rmSync(process.env.MAILDIR_LIVE_TEST, { recursive: true, force: true })
fs.cpSync(process.env.MAILDIR_MASTER_COPY, process.env.MAILDIR_LIVE_TEST, { recursive: true });

//console.log(process.env.MAILDIR_LIVE_TEST)
//console.log(process.env.MAILDIR_MASTER_COPY, process.env.MAILDIR_LIVE_TEST)

const maildir = new Maildir(process.env.MAILDIR_LIVE_TEST);

describe('Test maildir.js library functions', () => {
  it('request a list of emails in maildir', async () => {
    const emails = await maildir.listEmails();
    console.log('Emails:', emails.length);
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
console.log(emails[0].attachments)
console.log(emails[1].attachments)
console.log(emails[2].attachments)
console.log(emails[3].attachments)
console.log(emails[4].attachments)
    const secondLastEmail = await maildir.readEmail(emails[emails.length - 2].filename);
console.log('secondLastEmail', secondLastEmail.attachments.length)
    console.log('Second Last email attachments:', secondLastEmail.attachments.length);
    expect(secondLastEmail.attachments.length).toBe(2)
  });

  it.skip('check second last email in test maildir has 1 attachment', async () => {
    const emails = await maildir.listEmails();
    const lastEmail = await maildir.readEmail(emails[emails.length - 1].filename);
    //console.log('Last email attachments:', lastEmail.attachments.length);
    expect(lastEmail.attachments.length).toBe(1);
    expect(lastEmail.attachments[0].filename).toBe("sample.pdf");
  });

  it.skip('check new emails list in test maildir has correct number of messages', async () => {
    const newEmails = await maildir.listNewEmails();
    //console.log(newEmails)
    expect(newEmails.length).toBe(5)
  });

  it.skip('check readNewEmail from emails list in test maildir moved to cur directory', async () => {
    const emails = await maildir.listNewEmails();
    await maildir.readAndMoveNewEmail(emails[0].filename)
    const newEmails = await maildir.listNewEmails();
    expect(newEmails.length).toBe(4)
  });

  it.skip('check delete maildir remove file', async () => {
    const emails = await maildir.listEmails();
    //console.log(emails[0].filename)
    const deleteReturn = await maildir.deleteEmail(emails[0].filename);
    const emails2 = await maildir.listEmails();
    expect(emails2[0].filename).not.toBe(emails[0].filename);
    expect(emails.length).toBe(5)
    expect(emails2.length).toBe(4)
  });

  it.skip('check send, send email', async () => {
    const from = "\"from\" <gav@zkws.org>";
    const to = "\"to\" <gav@zkws.org>";
    const subject = "Test subject line - email with attachments";
    const text = "this is the body text of the email....\n\nThanks\n\nGav. :)";
    const attachments = [
      {
        filename: "hello.txt",
        content: "Hello world!",
      },
      {
        filename: 'HelloWorld.txt',
        content: Buffer.from('hello world Buffer!','utf-8')
      },
      { // data uri as an attachment
        filename: 'BlobDataText.txt',
        path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
      },
      {
        filename: 'sample-red-400x300.jpeg',
        path: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEARwBHAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAEsAZADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAWAQEBAQAAAAAAAAAAAAAAAAAABgj/2gAMAwEAAhADEAAAAZzC6pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/8QAFBABAAAAAAAAAAAAAAAAAAAAoP/aAAgBAQABBQJtn//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8BbZ//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAECAQE/AW2f/8QAFBABAAAAAAAAAAAAAAAAAAAAoP/aAAgBAQAGPwJtn//EABQQAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQEAAT8hbZ//2gAMAwEAAgADAAAAEP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAEDAQE/EG2f/8QAFBEBAAAAAAAAAAAAAAAAAAAAoP/aAAgBAgEBPxBtn//EABQQAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQEAAT8QbZ//2Q==',
      }, 
    ];

    const sendEmail = await maildir.sendEmail({
      from,
      to,
      subject,
      text: 'Plain text version',
      html: '<h1>Welcome!</h1><p>This is an <strong>HTML email</strong> sent with Nodemailer.</p>',
      //text: body,
      //html: "<h1>This is HTML BODY</h1>Thanks",
      attachments,
    });

    console.log(sendEmail)

/*
    const emails = await maildir.listEmails();
    const email = emails.find(email => (typeof email.attachments !== 'undefinded' && email.attachments.length > 1));

    const sendEmail = await maildir.sendEmail(email);
    console.log('inTest', email)
*/
  });

  it.skip('check email pop3 and store in maildir', async () => {
    maildir.fetchAndStoreEmails({
      host: process.env.POP3_HOST,
      port: process.env.POP3_PORT,
      useSSL: true,
      username: process.env.SMTP_AUTH_USER,
      password: process.env.SMTP_AUTH_PASS,
      maildirPath: process.env.MAILDIR_POP3_TEST,
      onSuccess:  (count) => {
        console.log(`Successfully fetched and stored ${count} emails.`);
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });
  })

})

