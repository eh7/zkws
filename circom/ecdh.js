const crypto = require('crypto');

const args = process.argv.slice(2);

type = args[0];

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
