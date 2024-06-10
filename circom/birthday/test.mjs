
import { newMemEmptyTrie, buildEddsa, buildPoseidon, buildBabyjub } from 'circomlibjs'
import { ethers } from "ethers"

import { wasm as wasm_tester } from "circom_tester";

import path from "path";

const __dirname = path.resolve();

const poseidon = await buildPoseidon()

const F = poseidon.F;

const bnValue = BigInt("17192875363359537871702202739956153645448798961056702518827795889156046289498");

console.log(
  F.e(bnValue)
);
console.log(bnValue);

function poseidonArray(_numberString) {
  const bnValue = BigInt(_numberString);
  console.log(
    F.e(bnValue),
    bnValue,
    //ethers.hexlify(
    //  Buffer.from(
    //    "1"
    //  )
    //),
  );
}
console.log(
  poseidon(Array.from("18091971"))
);


poseidonArray("2")
poseidonArray("1")

const poseidonHash = poseidon([
  "1",
]);
console.log(poseidonHash)

const circuitBirthday = await wasm_tester(path.join(__dirname, "BirthdayPoseidon1.circom"))

const w = await circuitBirthday.calculateWitness({
  date: [
    "1",
  ]
}, true);
console.log(w[1].toString())
