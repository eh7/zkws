import bip39 from 'bip39-light';
//import EthjsWallet from 'ethereumjs-wallet';
import EthjsWallet, { hdkey as etherHDkey } from 'ethereumjs-wallet';
import {
  ethers,
  formatEther,
  getBytes,
  hexlify,
  hashMessage,
  JsonRpcProvider,
  keccak256,
  Mnemonic,
  randomBytes,
  recoverAddress,
  toUtf8Bytes,
  Wallet as EthersWallet,
  HDNodeWallet,
} from 'ethers';

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption

import { redirect } from "react-router-dom";

//import { redirect } from "react-router-dom";

import 'dotenv/config';

const endPoint = process.env.RPC_URL || '';

//console.log(ethers)
//console.log(JsonRpcProvider)

export default class Sync {

  constructor(
     syncInitData,
  ) {
    console.log(
      'this.isBaseKeystoreSetup():',
      this.isBaseKeystoreSetup()
    )
    alert("Sync service constructor")
/*
    this.data = '';
    this.initData = syncInitData;
    this.provider = {};
    this.networkProvider = {};

    try {
      this.key = Buffer.from(process.env.KEY, 'hex');
      this.iv = Buffer.from(process.env.IV, 'hex');
    } catch (err) {
      console.error('Error no .env setup see readme')
    }

    this.setupProvider();
    console.log('this.provider:', this.provider);
*/
  }

  isBaseKeystoreSetup = async () => {
    const keystore = localStorage.getItem(
      "baseKeystore",
    )
    if (keystore) {
      return true
    } else {
      await this.setupBaseKeystore() 
      return false
    }
  }

  setupBaseKeystore = async () => {
    const myRandomBytes = ethers.randomBytes(32);
    const mnemonic = Mnemonic.fromEntropy(myRandomBytes)
    const i = 0
    const path = "m/44'/60'/0'/0/" + i
//console.log(mnemonic.phrase)
    const mnemonicInstance = Mnemonic.fromPhrase(mnemonic.phrase)
    //const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance, path)
    const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance)

    const seedHex = bip39.mnemonicToSeedHex(mnemonic.phrase);
    const pkey0 = seedHex.substr(0, (seedHex.length / 2));
    const pkey1 = seedHex.substr((seedHex.length / 2));
    const password = "_password";
    const keystore0 = await this.pkeyV3(pkey0, password);
    const keystore1 =  await this.pkeyV3(pkey1, password);
    const keystore = [
      await keystore0,
      await keystore1,
    ];
    console.log({keystore})

    //this.pkeyV3(wallet.privateKey)
    console.log(
      //await this.pkeyV3(
        wallet.privateKey,
        Buffer.from(wallet.privateKey, 'hex'),
      //  'password'
      //)
    )
//console.log(wallet)

//    localStorage.setItem(
//      "baseKeystore",
//      "12345texting",
//    );
  }

  pkeyV3 = async (_pkey, _password) => {
    try {
      const key = Buffer.from(_pkey, 'hex');
      const wallet = EthjsWallet.fromPrivateKey(key);
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

/*
  setupProvider = () => {
    const networks = JSON.parse(localStorage.getItem("networks"));

//console.log(ethers, endPoint)
    //this.provider = new ethers.providers.JsonRpcProvider(endPoint);
    this.provider = new JsonRpcProvider(endPoint);

    if (networks === null) {
      console.log(localStorage.getItem("networks"));
    } else {
      networks.map((network, i) => {
        //this.networkProvider[networks[i].chainId] = new ethers.providers.JsonRpcProvider(networks[i].rpcUrl);
        this.networkProvider[networks[i].chainId] = new JsonRpcProvider(networks[i].rpcUrl);
      })
      console.log(
        'this.networkProvider:',
        this.networkProvider,
        networks
      );
    }

  }

  getBlockNumber = async () => {
    return await this.provider.getBlockNumber()
  }

  recoverAddressFromMessage = async (_message, _signature) => {
    //const network = JSON.parse(localStorage.getItem("network"))
    const network = { chainId: 9911999 }
    const provider = this.networkProvider[network.chainId]
    const privateKeyString = await this.getPrivateKey()
    const signer = new EthersWallet(privateKeyString, provider)

    const digest = getBytes(hashMessage(_message))
    const recoveredAddress = recoverAddress(digest, _signature)

    return recoveredAddress
  }

  signMessage = async (_message) => {
    //const network = JSON.parse(localStorage.getItem("network"))
    const network = { chainId: 9911999 }
    const provider = this.networkProvider[network.chainId]
    const privateKeyString = await this.getPrivateKey()
    const signer = new EthersWallet(privateKeyString, provider)

    //const signature = await signer.signMessage(_message)
    //console.log('hashed _message::', keccak256(Buffer.from(_message)))
    //const signature = await signer.signMessage(_message)
    //const digest = getBytes(hashMessage(_message))

console.log('Buffer.from(_message):', _message, Buffer.from(_message))
console.log('Buffer.from(_message).toString(\'hex\'):', _message, Buffer.from(_message).toString('hex'), '\n')
    //const hashedMessage = keccak256(Buffer.from(_message)))
    const hashedMessage = keccak256(Buffer.from(_message))
    console.log('hashed _message::', hashedMessage, _message)
    const signature = await signer.signMessage(hashedMessage)
    const digest = getBytes(hashMessage(hashedMessage))

    const recoveredAddress = recoverAddress(digest, signature)
    const address = await this.getAddress()
    console.log({
      recoveredAddress,
      address,
      status: (recoveredAddress === address),
    })

    return { signature, hashedMessage } 
  }

  sendTx = async (_params) => {
    const network = JSON.parse(localStorage.getItem("network"));
    const provider = this.networkProvider[network.chainId];
    const privateKeyString = await this.getPrivateKey();
    //const signer = new ethers.Wallet(privateKeyString, provider);
    const signer = new EthersWallet(privateKeyString, provider);
    const params = {
      from: _params[0].from,
      to: _params[0].to,
      //value: ethers.utils.parseUnits(_params[0].value, 'ether').toHexString(),
      value: ethers.parseEther(_params[0].value),
    };
    const transaction = await signer.sendTransaction(params)
    //console.log('transaction hash:', transaction.hash);
    console.log('transaction:', transaction);
    const receipt = await transaction.wait(transaction);
    console.log('receipt:', receipt);
    return receipt;
  }

  getBalance = async (_address) => {
    try {
      const network = JSON.parse(localStorage.getItem("network"));
      const provider = this.networkProvider[network.chainId];
      const balance = await provider.getBalance(_address);
      //const balance = await this.provider.getBalance(_address);
      //const balanceInEth = ethers.utils.formatEther(balance);
      const balanceInEth = formatEther(balance);
      return balanceInEth;
    } catch (e) {
      console.log('eallet.js :: getBalance :: ', e);
    }
  }

  getWalletFilesData = (_phrase, _index) => {
    const i = _index
    const path = "m/44'/60'/0'/0/" + i
    const mnemonicInstance = Mnemonic.fromPhrase(_phrase)
    return HDNodeWallet.fromMnemonic(mnemonicInstance, path)
  }

  decryptFilesData = (_encryptedData, _phrase) => {
    const wallet = this.getWalletFilesData(_phrase, 0)
    const key = wallet.privateKey.substr(2, 64);
    const iv = Buffer.from(_encryptedData.iv, 'hex');
    const encryptedText = Buffer.from(_encryptedData.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(
     'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(
      decrypted.toString('utf8')
    );
  }

  getDataWalletAddress = async (_phrase) => {
    const wallet = await this.getWalletFilesData(_phrase, 0)
    return wallet.address;
  }

  getDataWalletPhrase = async (_phrase) => {
    const wallet = await this.getWalletFilesData(_phrase, 0)
    return wallet.address;
  }

  encryptFileData = async (_file, _phrase, _addressUser, _index) => {
    const wallet = this.getWalletFilesData(_phrase, 0)
    const key = wallet.privateKey.substr(2, 64);
    const address = wallet.address;

    const iv = crypto.randomBytes(16)
    let cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv
    );

    const encrypted = Buffer.concat([
      cipher.update(
        JSON.stringify(_file)
      ),
      cipher.final(),
    ])

    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted.toString('hex'),
      index: _index,
    }
  }

  encryptFilesData = async (_files, _phrase, _addressUser) => {

    const wallet = this.getWalletFilesData(_phrase, 0)
    const key = wallet.privateKey.substr(2, 64);
console.log('key', key)
    const address = wallet.address;

    const iv = crypto.randomBytes(16)
console.log('iv', iv.toString('hex'))
    let cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv
    );

    const encrypted = Buffer.concat([
      cipher.update(
        JSON.stringify(_files)
      ),
      cipher.final(),
    ])
 
    const hashes = [];
    const encryptedFiles = [];
    _files.map(async (file, index) => {
      hashes.push({
        hash: keccak256(
          toUtf8Bytes(
            JSON.stringify(file.data)
          )
        ),
        addressUser: _addressUser,
        addressData: address,
        index,
      })
      encryptedFiles.push(
        await this.encryptFileData(file, _phrase, _addressUser, index)
      )
    })
    console.log("HASHES AND ENCRYPTEDFILES :: ", hashes, encryptedFiles)

    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted.toString('hex'),
      addressUser: _addressUser,
      addressData: address,
      encryptedFiles,
      hashes,
      timestamp: new Date(),
    };
  }

  //Encrypting text
  encrypt = (text) => {
    //const key = Buffer.from(this.key);
    let cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.key),
      this.iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      encryptedData: encrypted.toString('hex')
    };
  }

  // Decrypting text
  decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }

  setupNewWallet = async () => {
    if (!localStorage.getItem("keyset")) {
      // setup wallet data
      alert('setup wallet data as no wallet data provided')
      localStorage.setItem("keyset", this.data.mnemonic);
      this.setupWallet(this.data.mnemonic);
      //const phrase = await bip39.generateMnemonic();
      //
      const HDwallet = etherHDkey.fromMasterSeed(seedHex);
      const zeroWallet = HDwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
      const address = zeroWallet.getAddressString();

    } else {
      // import or load wallet data
      console.log('import or load wallet data')
    }
  }

  getSeedHex= async () => {
    return await this.decrypt(
      JSON.parse(
        localStorage.getItem(
          "seedHex",
        )
      )
    )
  }

  saveKeystorePassword = async (_password) => {
    const seedHex = this.getSeedHex();
    const keystore = await this.seedHexToKeystore(seedHex, _password);
    localStorage.setItem(
      'keystore',
      JSON.stringify(keystore)
    );
    console.log('keystore:', JSON.stringify(keystore));
  }

  saveKeystore = async () => {
    const _password = "thisisapassword";
    const seedHex = this.getSeedHex();
    const keystore = await this.seedHexToKeystore(seedHex, _password);
    localStorage.setItem(
      'keystore',
      JSON.stringify(keystore)
    );
    console.log('saveKeystore keystore :: ', keystore);
  }

  getKeystoreJson = () => {
    try {
      if (localStorage.getItem('keyset')) {
        const keystore = JSON.parse(
          localStorage.getItem(
            "keystore",
          )
        )
        return keystore;
      }
    } catch (e) {
      console.log('ERROR :: wallet :: getKeystoreJson :: ', e);
    }
  }

  getKeystoreWithPasswordKeystore = async (_password, _keystore) => {
    return await this.recoverSeedHexFromKeystore(_keystore, _password);
  }

  getKeystoreWithPassword = async (_password) => {
    if (localStorage.getItem('keystore')) {
      try {
        const keystore = JSON.parse(
          localStorage.getItem(
            "keystore",
          )
        )
        console.log('wallet.getKeystore:', keystore);
        return await this.recoverSeedHexFromKeystore(keystore, _password);
      } catch (e) {
        console.log('ERROR :: wallet :: getKeystoreWithPassword :: ', e); 
      }
    }
  }

  getKeystore = async () => {
    if (localStorage.getItem('keyset')) {
      const _password = "password01";
      const keystore = JSON.parse(
        localStorage.getItem(
          "keystore",
        )
      )
      console.log('wallet.getKeystore:', keystore);
      return await this.recoverSeedHexFromKeystore(keystore, _password);
    }
  }
 
  getPrivateKey = async () => {
    if (localStorage.getItem('keyset')) {
      const seedHex = this.decrypt(
        JSON.parse(
          localStorage.getItem(
            "seedHex",
          )
        )
      )
      const HDwallet = etherHDkey.fromMasterSeed(seedHex);
      const zeroWallet = HDwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
      return zeroWallet.getPrivateKeyString();
    } else {
      alert('no keyset error wallet/getPrivateKey');
      //return { redirect: '/setup/phrase/import' };
    }
  }

  getWalletSettings = async () => {
    const address = await this.getAddress();
    const network = JSON.parse(localStorage.getItem("network"));
    const chain = network.name;
    const balance = await this.getBalance(address);
    return {
      address,
      balance,
      chain,
    };
  }

  checkPhraseData = () => {
    const dataPhrase = this.decrypt(
      JSON.parse(
        localStorage.getItem(
          "dataPhrase"
        )
      )
    )
    return dataPhrase
  }

  getPhraseData = async () => {
    try {
      let dataPhrase = localStorage.getItem(
        "dataPhrase"
      )

      if (dataPhrase) {
        dataPhrase = this.decrypt(
          JSON.parse(
            localStorage.getItem(
              "dataPhrase"
            )
          )
        )
      } else {
        dataPhrase = this.getNewPhraseData()
      }
    
      return dataPhrase
    } catch (err) {
      console.error("ERROR servcie::wallet::getPhraseData:", err)
      return "" 
    }
  }

  getRandomPhraseData = async () => {
    const myRandomBytes = randomBytes(32);
    const mnemonic = Mnemonic.fromEntropy(myRandomBytes)
    return mnemonic.phrase;
  }

  getNewPhraseData = async () => {
    const myRandomBytes = randomBytes(32);
    const mnemonic = Mnemonic.fromEntropy(myRandomBytes)
    localStorage.setItem(
      "dataPhrase",
      JSON.stringify(
        this.encrypt(mnemonic.phrase)
      )
    )
    return mnemonic.phrase;
  }

  setNewPhraseData = async (_phrase) => {
    if (_phrase) {
      localStorage.setItem(
        "dataPhrase",
        JSON.stringify(
          this.encrypt(_phrase)
        )
      )
    }
  }

  getDataAddress = async () => {
  }

  syncPhraseData = async () => {
  }

  syncSetupNewPhraseData = async () => {
  }

  getAddress = async () => {
    if (localStorage.getItem('keyset')) {
      // TODO remove this from localStorage after dev
      const seedHex = this.decrypt(
        JSON.parse(
          localStorage.getItem(
            "seedHex",
          )
        )
      )

      //WIP
      //const seedHex = bip39.mnemonicToSeedHex(phrase);
//console.log(seedHex)
//
      const HDwallet = etherHDkey.fromMasterSeed(seedHex);

      const zeroWallet = HDwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
      const address = zeroWallet.getAddressString();
      const addressCheckSum = zeroWallet.getChecksumAddressString();
      return addressCheckSum;

    } else {
      alert('no keyset error');
    }
  }

  // TODO async setup if required for FormPassword
  getNewPasswordForSeed = async () => {
    return new Promise(async function(resolve, reject) {
      try {
        const newPassword = await bip39.generateMnemonic();
        resolve(newPassword);
      } catch (e) {
        reject('ERROR :: walletService :: getNewPasswordForSeed :: ', e);
      }
    })
  }

  getNewPhraseForSeedOperation = async () => {
    return new Promise(async function(resolve, reject) {
      try {
        const newPhrase = await bip39.generateMnemonic();
        resolve(newPhrase);
      } catch (e) {
        reject('ERROR :: walletService :: getNewPhraseForSeed :: ', e);
      }
    })
  }

  getNewPhraseForSeed = async () => {
    return await bip39.generateMnemonic();
  }

  saveNewPhraseSeed = async (_words, _password, _type) => {
    const phrase = _words.join(' ');
    const seedHex = bip39.mnemonicToSeedHex(phrase);
    localStorage.setItem(
      "seedHex",
      JSON.stringify(
        this.encrypt(seedHex)
      )
    )
    localStorage.setItem(
      "keyset",
      true,
    );
    console.log("new phrase saves and loaded");
    //console.log(_password);

    console.log("!!! saving keystore");
    await this.saveKeystorePassword(_password);
    console.log("!!! saved keystore");

    if (_type === 'init') {
      window.location.href='/';
    }
  }

  getNewPhrase = async (_reset) => {
    if (!localStorage.getItem('keyset') || _reset) {
      const phrase = await bip39.generateMnemonic();
      const seedHex = bip39.mnemonicToSeedHex(phrase);
      localStorage.setItem(
        "seedHex",
        JSON.stringify(
          this.encrypt(seedHex)
        )
      )
      localStorage.setItem(
        "keyset",
        true,
      );
      return phrase;
    }
  }

  checkWalletSetup = (message) => {
    if (this.data.address) {
      return true;
    } else {
      return false;
    }
  }

  initSetupWalletKeystore = async (_seedHex) => {
    localStorage.setItem(
      "seedHex",
      JSON.stringify(
        this.encrypt(_seedHex)
      )
    )
    localStorage.setItem(
      "keyset",
      true,
    );
  }

  setupWalletKeystore = async (_password) => {
    const mnemonic = this.data.mnemonic;
    const seedHex = bip39.mnemonicToSeedHex(mnemonic);
    const keystore = await this.seedHexToKeystore(seedHex, _password);
    console.log('after seedHexToKeystore', mnemonic, seedHex);
    //console.log('keystore:', keystore);
    //this.data.keystore = keystore;
    console.log('save data walletKeystore', this.data);
    this.eventEmitter.emit('wallet provider setup done', this);
  }

  setupWallet = async (message) => {
    const mnemonic = message || await bip39.generateMnemonic();
    const seedHex = bip39.mnemonicToSeedHex(mnemonic);
    const HDwallet = etherHDkey.fromMasterSeed(seedHex);
    const zeroWallet = HDwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
    const address = zeroWallet.getAddressString();
    const addressCheckSum = zeroWallet.getChecksumAddressString();
    //const keystore = this.seedHexToKeystore(seedHex, '_password');
    //const keystore = await this.seedHexToKeystore(seedHex, '_password');
    this.data = {
      address: zeroWallet.getAddressString(),
      addressCheckSum,
      mnemonic: mnemonic,
      privateKey: zeroWallet.getPrivateKeyString(),
      publicKey: zeroWallet.getPublicKeyString(),
      //keystore
    };
    console.log('save data', this.data);

    this.ethersData = await this.setupEthers();
    console.log('this wallet.js:', this.ethersData.provider);
  }

  setupEthers = async (data) => {
    if (endPoint === '') {
      throw({
        error: 'no endPoint set',
      });
    }
    //const provider = new ethers.providers.JsonRpcProvider(endPoint);
    const provider = new JsonRpcProvider(endPoint);
    const wallet = new ethers.Wallet(this.data.privateKey);
    //const currentBlock = await provider.getBlockNumber();
    //console.log('currentBlock:', currentBlock);
    //alert(currentBlock);
    
    return {
      ethers,
      //latestBlock: currentBlock,
      provider,
      wallet,
    };
  }

  getNetwork = async () => {
    return await this.ethersData.provider.getNetwork();
  }

  getAddressOld = () => {
    const phrase = localStorage.getItem('phrase');
    console.log(
      phrase
    );
  }

  recoverHexFromSingleKeystore = async (_keystore, _password) => {
    try {
      console.log(
        'recoverHexFromSingleKeystore',
        _keystore,
        _password,
      );
      const resKey = await EthjsWallet.fromV3(_keystore, _password);
      const hexKey = resKey.privateKey.toString('hex');
      return hexKey;
    }
    catch (e) {
      console.log("ERROR catch recoverSeedHexFromKeystore:", e);
    }
  }

  // TODO debug this and check it works okay
  recoverSeedHexFromKeystore = async (_keystore, _password) => {
    try {
      const password = _password;
      console.log(
        'recoverSeedHexFromKeystore',
        _keystore[0],
        _keystore[1],
        _password
      );
      const resPkey0 = await EthjsWallet.fromV3(_keystore[0], password);
      const resPkey1 = await EthjsWallet.fromV3(_keystore[1], password);
      // console.log(_pkeySeed);
      const seedHex = resPkey0.privateKey.toString('hex') + resPkey1.privateKey.toString('hex');
      //console.log("recoverSeedHexFromKeystore :: seedHex", seedHex);
      return seedHex;

      console.log("recoverSeedHexFromKeystore :: seedHex", seedHex);
      const HDwallet = etherHDkey.fromMasterSeed(seedHex);
      const zeroWallet = HDwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
      const address = zeroWallet.getAddressString();
      const addressCheckSum = zeroWallet.getChecksumAddressString();
      //console.log(addressCheckSum);
      return addressCheckSum;
    }
    catch (e) {
      console.log("ERROR catch recoverSeedHexFromKeystore:", e);
    }
  }

  seedHexToKeystore = async (_pkeySeed, _password) => {
    try {
      const pkeySeed = await _pkeySeed;
      const pkey0 = pkeySeed.substr(0, (pkeySeed.length / 2));
      const pkey1 = pkeySeed.substr((pkeySeed.length / 2));
      const password = _password;
      const keystore0 = this.pkeyV3(pkey0, password);
      const keystore1 =  this.pkeyV3(pkey1, password);
      const keystore = [
        await keystore0,
        await keystore1,
      ];
      return keystore;
    }
    catch (err) {
      console.log('seedHexToKeystore err:', err);
    }
  }

  pkeyV3 = async (_pkey, _password) => {
    try {
      const key = Buffer.from(_pkey, 'hex');
      const wallet = EthjsWallet.fromPrivateKey(key);
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
      console.log(_v3Options);
      return await wallet.toV3String(_password, _v3Options);
    }
    catch (err) {
      console.log('pkeyV3 err:', err);
    }
  }
*/

}
