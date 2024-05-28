import { newMemEmptyTrie, buildEddsa, buildPoseidon, buildBabyjub } from 'circomlibjs'
import { BigNumber } from '@ethersproject/bignumber'

const preImage = 18091971;

const buffer2hex = (buff) => {
  return BigNumber.from(buff).toHexString()
}

const hashPoseidon = async () => {

  const poseidon = await buildPoseidon()

  const birthdayHash = poseidon([
    buffer2hex(1),
    buffer2hex(8),
    buffer2hex(0),
    buffer2hex(9),
    buffer2hex(1),
    buffer2hex(9),
    buffer2hex(7),
    buffer2hex(1),
  ])

  console.log(birthdayHash);
 
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
