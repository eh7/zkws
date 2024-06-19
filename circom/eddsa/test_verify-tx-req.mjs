
import { newMemEmptyTrie, buildEddsa, buildPoseidon, buildBabyjub } from 'circomlibjs'
import { ethers } from "ethers"
import { BigNumber } from '@ethersproject/bignumber'
import { wasm as wasm_tester } from "circom_tester";
import path from "path";

//import 'dotenv/config';
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const __dirname = path.resolve();

const areUnit8ArraysEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

//const wasm_tester = require("circom_tester").wasm;
//const buildEddsa = require("circomlibjs").buildEddsa;
//const buildBabyjub = require("circomlibjs").buildBabyjub;

const eddsa = await buildEddsa();

const babyJub = await buildBabyjub();

const F = babyJub.F;

const circuit = await wasm_tester(path.join(__dirname, "verify-tx-req.circom"));

//const wallet = new ethers.Wallet(prvKey.toString('hex'));
const wallet = new ethers.Wallet(process.env.PKEY);
const prvKey = Buffer.from(process.env.PKEY, "hex");
const pubKey = eddsa.prv2pub(prvKey);

const msgBuffer = Buffer.from("this is a message");
const msgBufferBigInt = BigInt(
  "0x" + msgBuffer.toString('hex')
);
const msg = F.e(msgBufferBigInt);

//console.log(  prvKey.toString('hex') )
//console.log(  prvKey )

const signature = eddsa.signPoseidon(
  prvKey,
   msg
);
const signatureOther = eddsa.signPoseidon(
  prvKey,
  msg,
);

console.log(eddsa.verifyPoseidon(msg, signature, pubKey));

const poseidon = await buildPoseidon()
const poseidonF = poseidon.F;
const txHash = poseidon([
  wallet.address,
  1,
  //0,
])
console.log(
  'TTTTEESSSTT:',
  F.e("6612469309853801275214630455969680752544795879918022173148337181460117022485"),
  F.e(txHash),
  areUnit8ArraysEqual(
    F.e("6612469309853801275214630455969680752544795879918022173148337181460117022485"),
    F.e(txHash),
  ),
  F.e("6612469309853801275214630455969680752544795879918022173148337181460117022485"),
)
/*
console.log('txHAsh:', txHash)
console.log(
  ethers.hexlify(
    txHash
  )
);
console.log(
//  BigInt('0x' + 
//    (poseidonF.e(
      (
        Buffer.from(txHash)
      )
//    )).toString()
//  )
);
//const bnValue = BigInt(txHash);
*/

console.log(
  F.toObject(pubKey[0]),
  F.toObject(pubKey[1]),
  F.toObject(signature.R8[0]),
  F.toObject(signature.R8[1]),
  signature.S,
);

const input = {
  sender: wallet.address,
  nonce: 1,
  //enabled: 1,
  Ax: F.toObject(pubKey[0]),
  Ay: F.toObject(pubKey[1]),
  R8x: F.toObject(signature.R8[0]),
  //R8x: F.toObject(F.add(
  //  signature.R8[0],
  //  F.e(1)
  //)),
  R8y: F.toObject(signature.R8[1]),
  S: signature.S,
  //M: F.toObject(msg)
};
/*
*/

/*
const input = {
  in0: "2",
  in1: "3",
};
*/

// console.log(JSON.stringify(utils.stringifyBigInts(input)));

const w = await circuit.calculateWitness(input, true);
//console.log(w[1])
/*
console.log(w[1].toString())
await circuit.checkConstraints(w);
*/
