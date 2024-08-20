import crypto from 'crypto'


const args = process.argv.slice(3);

// type = args[0];
//let type='secp128r2';
let type='secp256k1';
console.log("Type:\t",type);


// Generate Alice's keys...
const alice = crypto.createECDH(type);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createECDH(type);
const bobKey = bob.generateKeys();

console.log("\nAlice private key:\t",alice.getPrivateKey().toString('hex'));
console.log("Alice public key:\t",aliceKey.toString('hex'))

console.log("\nBob private key:\t",bob.getPrivateKey().toString('hex'));
console.log("Bob public key:\t",bobKey.toString('hex'));

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

console.log("\nAlice shared key:\t",aliceSecret.toString('hex'))
console.log("Bob shared key:\t\t",bobSecret.toString('hex'));

const text = "This Is a Test Message";
//const algorithm = 'aes-128-cbc';
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(aliceSecret), iv);
let encrypted = cipher.update(text);
encrypted = Buffer.concat([encrypted, cipher.final()]);
const data = {
  iv: iv.toString('hex'),
  encryptedData: encrypted.toString('hex')
}

let ivData = Buffer.from(data.iv, 'hex');
let encryptedText = Buffer.from(data.encryptedData, 'hex');
let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(bobSecret), ivData);
let decrypted = decipher.update(encryptedText);
decrypted = Buffer.concat([decrypted, decipher.final()]);

console.log('text:', decrypted.toString())
console.log('decrypted text:', text)
console.log('Encrypt/Decrypt check = ', decrypted.toString() === text)

//console.log(crypto)
/*
const data = crypto.AES.encrypt(text, aliceSecret);
const decrypted = crypto.AES.decrypt(data, bobSecret).toString(crypto.enc.Utf8);
console.log(decrypted)
*/
