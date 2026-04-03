const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 bytes for AES-256
const iv = crypto.randomBytes(16);  // 16 bytes for AES

function decrypt(encryptedHex, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function encrypt(data, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

(async () => {
const encrypted = encrypt('some clear text data', key, iv)
console.log('Encrypted:', encrypted)
//console.log('Encrypted:', encrypted);
console.log('Key:', key.toString('hex'));
console.log('IV:', iv.toString('hex'));
console.log('decrypted:', decrypt(encrypted, key, iv))
})();
