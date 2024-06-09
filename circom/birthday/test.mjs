
import { newMemEmptyTrie, buildEddsa, buildPoseidon, buildBabyjub } from 'circomlibjs'
import { ethers } from "ethers"

const poseidon = await buildPoseidon()

const F = poseidon.F;

const bnValue = BigInt("17192875363359537871702202739956153645448798961056702518827795889156046289498");

console.log(
  F.e(bnValue)
);

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

console.log(bnValue);

poseidonArray("1")
