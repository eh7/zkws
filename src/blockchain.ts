import {
  Blockchain,
} from '@ethereumjs/blockchain'
import { bytesToHex } from '@ethereumjs/util'

import { Chain, Common, Hardfork } from '@ethereumjs/common'
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

import { MapDB } from '@ethereumjs/util'
const db = new MapDB()

import { Block } from '@ethereumjs/block'

//import { getGenesis } from '@ethereumjs/genesis'

const run = async () => {
//console.log(getGenesis)
console.log(1234)

  const blockchain = await Blockchain.create({ common, db })

  const myTestChainId = 1337;
  //console.log(Chain.Mainnet)
  console.log(`myTestChainId => ${myTestChainId}`)
  //const myNetGenesis = await getGenesis(myTestChainId)
  //const myNetGenesis = Blockchain.getGenesisStateRoot(myTestChainId)
  console.log(blockchain);


  //console.log(myNetGenesis);

process.exit()
/*
  // Use the safe static constructor which awaits the init method
  const blockchain = await Blockchain.create({ common, db })

  const genesisState = parseGethGenesisState(gethGenesisJson)
  const blockchain = await Blockchain.create({
    genesisState,
    common,
  })


process.exit()

  const block1 = Block.fromBlockData(
    {
      header: {
        baseFeePerGas: BigInt(10),
        gasLimit: BigInt(100),
        gasUsed: BigInt(60),
      },
    },
    { common }
  )

  const block2 = Block.fromBlockData(
    {
      header: {
        baseFeePerGas: BigInt(10),
        gasLimit: BigInt(100),
        gasUsed: BigInt(60),
      },
    },
    { common }
  )

  await blockchain.putBlock(block1)

  await blockchain.putBlock(block2)

  blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })
*/
}

run();

/*
(async () => {

  // See @ethereumjs/block on how to create a block
  await blockchain.putBlock(block1)
  await blockchain.putBlock(block2)

  blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })

})();
*/
