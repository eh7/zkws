
import { newMemEmptyTrie, buildEddsa, buildPoseidon, buildBabyjub } from 'circomlibjs'
import { ethers } from "ethers"
import { wasm as wasm_tester } from "circom_tester";
import path from "path";

const __dirname = path.resolve();

//const wasm_tester = require("circom_tester").wasm;
//const buildEddsa = require("circomlibjs").buildEddsa;
//const buildBabyjub = require("circomlibjs").buildBabyjub;

const eddsa = await buildEddsa();

const babyJub = await buildBabyjub();

const F = babyJub.F;

const circuit = await wasm_tester(path.join(__dirname, "eddsaPoseidon.circom"));

const msg = F.e(1234);

const prvKey = Buffer.from("0001020304050607080900010203040506070809000102030405060708090001", "hex");

const pubKey = eddsa.prv2pub(prvKey);

const signature = eddsa.signPoseidon(prvKey, msg);

//assert(eddsa.verifyPoseidon(msg, signature, pubKey));

/*
const input = {
  enabled: 1,
  Ax: F.toObject(pubKey[0]),
  Ay: F.toObject(pubKey[1]),
  R8x: F.toObject(signature.R8[0]),
  R8y: F.toObject(signature.R8[1]),
  S: signature.S,
  M: F.toObject(msg)
};
*/

const input = {
  in0: "2",
  in1: "3",
};

// console.log(JSON.stringify(utils.stringifyBigInts(input)));

const w = await circuit.calculateWitness(input, true);
console.log(w[1].toString())
/*
*/
