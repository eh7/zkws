const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Default encryption algorithm and encoding
const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16; // For AES

class EncryptedFileStore {
  /**
   * Creates an instance of EncryptedFileStore.
   * @param {string} baseDir - Base directory to store encrypted files.
   * @param {string} encryptionKey - Key for encryption/decryption.
   */
  constructor(baseDir, encryptionKey) {
    this.baseDir = baseDir;
    this.encryptionKey = encryptionKey;

    // Create base directory if it doesn't exist
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Encrypts data.
   * @param {string} data - Data to encrypt.
   * @returns {string} Encrypted data.
   */
  encrypt(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
//const key = crypto.randomBytes(32); // 32 bytes for AES-256
//console.log(Buffer.from(this.encryptionKey), 'hex')
//console.log(key)
    //const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(this.encryptionKey), iv);
    let encrypted = cipher.update(data, 'utf8', ENCODING);
    encrypted += cipher.final(ENCODING);
    return iv.toString(ENCODING) + ':' + encrypted;
  }

  /**
   * Decrypts data.
   * @param {string} encryptedData - Encrypted data to decrypt.
   * @returns {string} Decrypted data.
   */
  decrypt(encryptedData) {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, ENCODING);
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(this.encryptionKey), iv);
    let decrypted = decipher.update(encrypted, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Stores encrypted data for a user.
   * @param {string} userId - User ID.
   * @param {string} key - Key for the data.
   * @param {string} data - Data to store.
   * @returns {Promise<void>}
   */
  async store(userId, key, data) {
    const encrypted = this.encrypt(data);
    const userDir = path.join(this.baseDir, userId);
    const filePath = path.join(userDir, `${key}.enc`);

    // Create user directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Write encrypted data to file
    await fs.promises.writeFile(filePath, encrypted);
  }

  /**
   * Retrieves and decrypts data for a user.
   * @param {string} userId - User ID.
   * @param {string} key - Key for the data.
   * @returns {Promise<string>} Decrypted data.
   */
  async retrieve(userId, key) {
    const filePath = path.join(this.baseDir, userId, `${key}.enc`);
    if (!fs.existsSync(filePath)) {
      return new Error('Data not found');
    }
    const encrypted = await fs.promises.readFile(filePath, 'utf8');
    return this.decrypt(encrypted);
  }

  /**
   * Updates encrypted data for a user.
   * @param {string} userId - User ID.
   * @param {string} key - Key for the data.
   * @param {string} data - New data to store.
   * @returns {Promise<void>}
   */
  async update(userId, key, data) {
    await this.store(userId, key, data);
  }

  /**
   * Deletes encrypted data for a user.
   * @param {string} userId - User ID.
   * @param {string} key - Key for the data.
   * @returns {Promise<void>}
   */
  async delete(userId, key) {
    const filePath = path.join(this.baseDir, userId, `${key}.enc`);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  /**
   * Lists all keys for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<string[]>} Array of keys.
   */
  async listKeys(userId) {
    const userDir = path.join(this.baseDir, userId);
    if (!fs.existsSync(userDir)) {
      return [];
    }
    const files = await fs.promises.readdir(userDir);
    return files.map(file => path.parse(file).name);
  }
}

module.exports = EncryptedFileStore;
