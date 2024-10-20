import {
  ethers,
  Wallet as EthersWallet,
  HDNodeWallet,
  Mnemonic,
} from 'ethers'
import bip39 from 'bip39-light'
//import EthjsWallet, { hdkey as etherHDkey } from 'ethereumjs-wallet'
import EthjsWallet from 'ethereumjs-wallet'

const myRandomBytes = ethers.randomBytes(32);
const mnemonic = Mnemonic.fromEntropy(myRandomBytes)
const i = 0
const path = "m/44'/60'/0'/0/" + i
console.log(mnemonic.phrase)
const mnemonicInstance = Mnemonic.fromPhrase(mnemonic.phrase)
//const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance, path)
const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance)
//const wallet = Mnemonic.fromPhrase(mnemonic.phrase)

//console.log(wallet)

const pkeyV3 = async (_pkey, _password) => {
  try {
    const key = Buffer.from(_pkey, 'hex');
    const wallet = EthjsWallet.default.fromPrivateKey(key);
    const v3Options = {
      kdf: 'scrypt',
      dklen: 32,
      n: 262144,
      r: 8,
      p: 1,
      cipher: 'aes-128-ctr'
    }
    const n = Math.pow(2, 16);
    const _v3Options = {
      kdf: 'scrypt',
      dklen: 32,
      n,
      r: 8,
      p: 1,
      cipher: 'aes-128-ctr'
    }
    //console.log(_v3Options);
    return await wallet.toV3String(_password, _v3Options);
  }
  catch (err) {
    console.log('pkeyV3 err:', err);
  }
}

const seedHex = bip39.mnemonicToSeedHex(mnemonic.phrase);
const pkeySeed = seedHex;
const pkey0 = pkeySeed.substr(0, (pkeySeed.length / 2));
const pkey1 = pkeySeed.substr((pkeySeed.length / 2));
const password = "_password";
const keystore0 = await pkeyV3(pkey0, password);
const keystore1 =  await pkeyV3(pkey1, password);
const keystore = [
  keystore0,
  keystore1,
];
console.log(seedHex)

//console.log(keystore0)
const recoveredKey = await EthjsWallet.default.fromV3(keystore0, password);
console.log(recoveredKey.privateKey.toString('hex'))
