
import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import {
  bytesToHex,
} from '@ethereumjs/util'
import {
  Common,
  parseGethGenesis
} from '@ethereumjs/common'

import { BlockHeader } from '@ethereumjs/block'

//const common = Common.fromGethGenesis(gethGenesisJson, { chain: 'customChain' })
//console.log(Common);

(async () => {
  const common = Common.custom({chainId: 1123})

  const blockchain = await Blockchain.create({ common })

  const block = Block.fromBlockData({
    header: {
      baseFeePerGas: BigInt(10),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  {
    common
  })
console.log(block)
console.log(Object.keys(block.header))
console.log(block.header.number)

//  await blockchain.putBlock(block1)
})()


/*
// Use the safe static constructor which awaits the init method
const blockchain = Blockchain.create({ common, db })

// See @ethereumjs/block on how to create a block
await blockchain.putBlock(block1)
await blockchain.putBlock(block2)

blockchain.iterator('i', (block) => {
  const blockNumber = block.header.number.toString()
  const blockHash = bytesToHex(block.hash())
  console.log(`Block ${blockNumber}: ${blockHash}`)
})


*/
/*

import { Blockchain, parseGethGenesisState } from '@ethereumjs/blockchain'
import { Common, parseGethGenesis } from '@ethereumjs/common'

// Load geth genesis json file into lets say `gethGenesisJson`
const common = Common.fromGethGenesis(gethGenesisJson, { chain: 'customChain' })
const genesisState = parseGethGenesisState(gethGenesisJson)
const blockchain = await Blockchain.create({
  genesisState,
  common,
})
const genesisBlockHash = blockchain.genesisBlock.hash()
common.setForkHashes(genesisBlockHash)
*/
