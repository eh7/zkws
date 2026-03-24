require('dotenv').config({ quiet: true })
const nodemailer = require('nodemailer');
const simpleParser = require('mailparser').simpleParser;
const POP3Client = require('node-pop3');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);
const writeFile = promisify(fs.writeFile);

class Maildir {
  constructor(maildirPath) {
    this.path = maildirPath;
    this.newPath = path.join(maildirPath, 'new');
    this.curPath = path.join(maildirPath, 'cur');
    this.tmpPath = path.join(maildirPath, 'tmp');
    this.sentPath = path.join(maildirPath, 'sent');
  }

  // List all new emails (only from 'new' directory)
  async listNewEmails() {
    return this._listDirectory(this.newPath);
  }

  // List all emails (new + cur)
  async listEmails() {
    const [newEmails, curEmails] = await Promise.all([
      this._listDirectory(this.curPath),
      this._listDirectory(this.newPath),
    ]);
    return [...newEmails, ...curEmails];
  }

  // Read email content
  async readEmail(filename) {
    const filePath = fs.existsSync(
      this.newPath + '/' + filename
    ) ?
      (this.newPath + "/" + filename) :
      (this.curPath + "/" + filename);
    //console.log(filePath)
    const content = await readFile(filePath, 'utf-8');
    const message = await simpleParser(content);
    return message
  }

  // Read a new email and move it to 'cur' directory
  async readAndMoveNewEmail(filename) {
    const filePath = path.join(this.newPath, filename);
    const content = await readFile(filePath, 'utf-8');
    const message = await simpleParser(content);
    //const parsedEmail = this._parseEmail(content);

    // Move the email to 'cur' directory
    const newFilePath = path.join(this.curPath, filename);
    await rename(filePath, newFilePath);

    return message
    //return parsedEmail;
  }

  // Delete email
  async deleteEmail(filename) {
    const filePath = fs.existsSync(
      this.newPath + '/' + filename
    ) ?
      (this.newPath + "/" + filename) :
      (this.curPath + "/" + filename);
    //const filePath = path.join(this.newPath, filename)
    //  || path.join(this.curPath, filename);
    await unlink(filePath);
  }

  async sendEmail(email) {
    console.log("sendEmail function")
    try {
      const { from, to, subject, text, html, attachments } = email;

      if (
        typeof from === 'undefined' ||
        typeof to === 'undefined' ||
        typeof subject === 'undefined' ||
        typeof text === 'undefined'
      ) {
        return({ success: false, message: 'Email missing manditory fields!' });
      }

      // Create a Nodemailer transporter with TLS on port 587
      const transporterStream = nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
      });
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports (TLS)
        auth: {
          user: process.env.SMTP_AUTH_USER,
          pass: process.env.SMTP_AUTH_PASS,
        },
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });

      // Prepare email attachments
      //const emailAttachments = attachments
      //  ? attachments.map((attachment) => ({
      //      filename: attachment.originalname,
      //      path: attachment.path,
      //    }))
      //  : [];

      // Send email
      const sentEmail = await transporter.sendMail({
        from,
        to,
        subject,
        text: text,
        html: html,
        attachments: attachments,
      });

      const savedSentEmail = await transporterStream.sendMail({
        from,
        to,
        subject,
        text: text,
        html: html,
        attachments: attachments,
      }, (err, info) => {
        if (err) {
          console.log("transporterSave.sendMail  ERROR :: ", err)
        } else {
          // info.message is a Readable stream of the raw RFC 822 content
          const messageString = info.message.toString();
          //info.message.pipe(process.stdout); // Outputs raw email to console
console.log(messageString)
          this.saveSentEmail(messageString)
        }
      });


      console.log('sentEmail', sentEmail)
      //alert('sentEmail check logs WIP saving sent emails')
/*
      const response = await maildir.saveSentEmail({
        from,
        to,
        subject,
        text: text,
        html: html,
        attachments: attachments,
      });
*/

    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async saveSentEmail(emailContent) {
    // Ensure the sent directory exists
    if (!fs.existsSync(this.sentPath)) {
      fs.mkdirSync(this.sentPath, { recursive: true });
    }

    // Generate a unique filename for the sent email
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const filename = `${timestamp}.M${uniqueId}P${uniqueId}.server.com,S=${emailContent.length}:2,`;

    // Write the email to the sent directory
    const filePath = path.join(this.sentPath, filename);
    await writeFile(filePath, emailContent);

    return filename;
  }

  // List all sent emails
  async listSentEmails() {
    return this._listDirectory(this.sentPath);
  }

  /**
   * Fetches emails from a POP3 mailbox and stores them in a maildir.
   * @param {string} host - POP3 server host.
   * @param {number} port - POP3 server port (usually 995 for SSL/TLS).
   * @param {boolean} useSSL - Whether to use SSL/TLS.
   * @param {string} username - POP3 username.
   * @param {string} password - POP3 password.
   * @param {string} maildirPath - Path to the maildir directory.
   * @param {Function} onSuccess - Callback for successful fetch.
   * @param {Function} onError - Callback for errors.
   */
  async fetchAndStoreEmails({
    host = process.env.POP3_HOST,
    port = process.env.POP3_PORT,
    useSSL = true,
    username = process.env.SMTP_AUTH_USER,
    password = process.env.SMTP_AUTH_PASS,
    maildirPath = process.env.MAILDIR,
    onSuccess,
    onError,
  }) {
    try {
      // Create maildir if it doesn't exist
      if (!fs.existsSync(maildirPath)) {
        fs.mkdirSync(maildirPath, { recursive: true });
      }

      // Connect to POP3 server
      const client = new POP3Client(port, host, { tlserr: !useSSL });

      await new Promise((resolve, reject) => {
        client.on('error', (err) => {
          console.error('POP3 error:', err);
          reject(err);
        });

        client.on('connect', () => {
          client.login(username, password, (err, status) => {
            if (err) {
              console.error('Login failed:', err);
              reject(err);
              return;
            }
            resolve();
          });
        });
      });

      // Get the list of emails
      const list = await new Promise((resolve, reject) => {
        client.list((err, list) => {
          if (err) {
            console.error('Failed to fetch email list:', err);
            reject(err);
            return;
          }
          resolve(list);
        });
      });

      // Fetch and store each email
      for (const item of list) {
        const emailData = await new Promise((resolve, reject) => {
          client.retr(item.number, (err, emailData) => {
            if (err) {
              console.error(`Failed to fetch email ${item.number}:`, err);
              reject(err);
              return;
            }
            resolve(emailData);
          });
        });

        // Parse the email
        const parsed = await simpleParser(emailData);

        // Save to maildir
        const filename = `email_${Date.now()}_${item.number}.eml`;
        const filePath = path.join(maildirPath, filename);
        fs.writeFileSync(filePath, emailData);

        console.log(`Saved email ${item.number} to ${filePath}`);
      }

      // Quit the POP3 connection
      await new Promise((resolve, reject) => {
        client.quit((err) => {
          if (err) {
            console.error('Failed to quit POP3 connection:', err);
            reject(err);
            return;
          }
          resolve();
        });
      });

      if (onSuccess) onSuccess(list.length);
    } catch (error) {
      if (onError) onError(error.message || 'Failed to fetch and store emails');
    }
  }

  // Helper: List files in a directory
  async _listDirectory(dirPath) {
    try {
      //return await readdir(dirPath);
      const emails = await readdir(dirPath);
      const emailsParsed = await Promise.all(
        emails.map(async (email, index) => {
          const content = await readFile(dirPath + '/' + email, 'utf-8');
          const emailJson = await simpleParser(content);
	  emailJson.filename = emails[index];
          return emailJson;
        })
      );
      return emailsParsed;
      //return emails;
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  // Save a sent email to the 'sent' directory
  // Helper: Parse email content (simplified)
  _parseEmail(content) {
    const [headers, body] = content.split('\n\n');
    return { headers, body };
  }

}

module.exports = Maildir;

