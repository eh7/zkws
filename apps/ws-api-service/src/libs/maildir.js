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

  // List all emails (new + cur)
  async listEmails() {
    const [newEmails, curEmails] = await Promise.all([
      this._listDirectory(this.newPath),
      this._listDirectory(this.curPath),
    ]);
    return [...newEmails, ...curEmails];
  }

  // Read email content
  async readEmail(filename) {
    const filePath = path.join(this.newPath, filename)
      || path.join(this.curPath, filename);
    const content = await readFile(filePath, 'utf-8');
    return this._parseEmail(content);
  }

  // Delete email
  async deleteEmail(filename) {
    const filePath = path.join(this.newPath, filename)
      || path.join(this.curPath, filename);
    await unlink(filePath);
  }

  // Helper: List files in a directory
  async _listDirectory(dirPath) {
    try {
      return await readdir(dirPath);
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

