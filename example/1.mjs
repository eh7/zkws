/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import delay from 'delay'
import { createLibp2p } from 'libp2p'
import { identifyService } from 'libp2p/identify'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import {
  node0 as node0Json,
  node1 as node1Json,
  node2 as node2Json,
} from './zkws.peerIds.mjs'

const createNode = async (_peerJson) => {
  const peer = await createFromJSON(_peerJson)
  const node = await createLibp2p({
    peerId: peer,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    transports: [tcp()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    services: {
      dht: kadDHT({
        // this is necessary because this node is not connected to the public network
        // it can be removed if, for example bootstrappers are configured
        allowQueryWithZeroPeers: true
      }),
      identify: identifyService()
    }
  })

  return node
}

;(async () => {
  const [node0, node1, node2] = await Promise.all([
    createNode(node0Json),
    createNode(node1Json),
    createNode(node2Json),
  ])

  console.log(
    node0.getMultiaddrs(),
    node1.getMultiaddrs(),
    node2.getMultiaddrs(),
  )

  await node0.peerStore.patch(node1.peerId, {
    multiaddrs: node1.getMultiaddrs()
  })
  await node1.peerStore.patch(node2.peerId, {
    multiaddrs: node2.getMultiaddrs()
  })

  await Promise.all([
    node0.dial(node1.peerId),
    node1.dial(node2.peerId)
  ])

  // The DHT routing tables need a moment to populate
  await delay(1000)

  const peer = await node0.peerRouting.findPeer(node2.peerId)

  console.log('Found it, multiaddrs are:')
  peer.multiaddrs.forEach((ma) => console.log(ma.toString()))
})()
