/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { identify } from '@libp2p/identify'
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
import bootstrappers from './bootstrappers.1.js'

if (process.argv[2] !== '') {
  bootstrappers.push(process.argv[2])
}

//
//const bootstrapList = [];
//if (process.argv[2] !== '') {
//  bootstrapList.push(process.argv[2])
//}
//const bootstrapper = await createNode(bootstrapList)
//
//const peerDiscovery = [
//  bootstrap({
//    list: bootstrappers
//  })
//],
const peerDiscovery = []
if (bootstrappers.length > 0) {
  peerDiscovery.push(bootstrap({list: bootstrappers}))
}

const node = await createLibp2p({
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0']
  },
  transports: [tcp()],
  streamMuxers: [yamux(), mplex()],
  connectionEncryption: [noise()],
  peerDiscovery,
  services: {
    kadDHT: kadDHT(),
    identify: identifyService()
    //identify: identify()
  }
})

console.log(node.getMultiaddrs())

node.addEventListener('peer:connect', (evt) => {
  const peerId = evt.detail
  console.log('Connection established to:', peerId.toString()) // Emitted when a peer has been found
})

node.addEventListener('peer:discovery', (evt) => {
  const peerInfo = evt.detail

  console.log('Discovered:', peerInfo.id.toString())
})
