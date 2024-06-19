import { newMemEmptyTrie, buildEddsa, buildPoseidon, buildBabyjub } from 'circomlibjs'

import { ethers } from "ethers"

import { BigNumber } from '@ethersproject/bignumber'

import { wasm as wasm_tester } from "circom_tester";

import path from "path";

const __dirname = path.resolve();

const preImage = 18091971;

const buffer2hex = (buff) => {
  return BigNumber.from(buff).toHexString()
}

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

function bnToBuf(bn) {
  var hex = BigInt(bn).toString(16);
  if (hex.length % 2) { hex = '0' + hex; }

  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j+2), 16);
    i += 1;
    j += 2;
  }

  return u8;
}

const hashPoseidon = async () => {

  const circuitBirthday = await wasm_tester(path.join(__dirname, "BirthdayPoseidon.circom"))

  const w = await circuitBirthday.calculateWitness({
    date: [
      "1",
      "8",
      "0",
      "9",
      "1",
      "9",
      "7",
      "1"
    ]
  }, true);
  console.log(w[1].toString())

  const poseidon = await buildPoseidon()

  const F = poseidon.F;

  const birthdayHash = poseidon([
    "1",
    "8",
    "0",
    "9",
    "1",
    "9",
    "7",
    "1"
  ])

  console.log(
    'birthdayHash',
     birthdayHash,
     ethers.hexlify(
       birthdayHash
     ),
     "\n"
  );

  console.log(
    'xxxxxx',
    F.e("17192875363359537871702202739956153645448798961056702518827795889156046289498"),
    F.e(birthdayHash),
    F.e(
      Buffer.from(birthdayHash)
    ),
    areUnit8ArraysEqual(
      F.e("17192875363359537871702202739956153645448798961056702518827795889156046289498"),
      F.e(birthdayHash),
    )
  );


  // more example to create and mapipulate posiedon hashes
  const bnValue = BigInt("17192875363359537871702202739956153645448798961056702518827795889156046289498");
  console.log(
    bnValue
  );
  console.log(bnValue);
  console.log("F.e", F.e(bnValue));
  console.log("17192875363359537871702202739956153645448798961056702518827795889156046289498");
//  console.log(BigInt);

 
  /*
  const transactionHash = poseidon([
    buffer2hex(target.address), nftID, buffer2hex(nonce)
  ])
  const signature = eddsa.signPoseidon(owner.prvKey, 
    transactionHash);
  return {
    ownerPubKey: owner.pubKey,
    targetAddress: target.address,
    nftID: nftID,
    nonce: nonce,
    signature: signature
  }
  */
}

hashPoseidon()
