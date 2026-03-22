require('dotenv').config({ quiet: true })
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

class Maildir {
  constructor(maildirPath) {
    this.path = maildirPath;
    this.newPath = path.join(maildirPath, 'new');
    this.curPath = path.join(maildirPath, 'cur');
    this.tmpPath = path.join(maildirPath, 'tmp');
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

  // Helper: Parse email content (simplified)
  _parseEmail(content) {
    const [headers, body] = content.split('\n\n');
    return { headers, body };
  }
}

module.exports = Maildir;

