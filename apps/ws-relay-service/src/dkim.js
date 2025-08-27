import { readFileSync } from 'node:fs'
import { dkimVerify } from 'dkimpy'

const message = readFileSync(process.argv[2] || "/tmp/email.txt")

console.log(message)

const result = await dkimVerify(message)
//  .then(console.log)
//  .catch(console.error);
console.log(result)
