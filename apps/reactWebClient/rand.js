import * as crypto from 'crypto';
  
const number = Number(process.argv[2]) || 32
const randomString = crypto.randomBytes(number).toString('hex');
console.log(number,randomString)

