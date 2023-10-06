import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { mplex } from '@libp2p/mplex'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
//import { GossipSub } from '@chainsafe/libp2p-gossipsub'
//import { GossipSub } from '@chainsafe/libp2p-gossipsub'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { bootstrap } from '@libp2p/bootstrap'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import { relay as relayPeer, peer0, peer1 } from './zkws.peerIds.mjs'

//;(async () => {
const run = async () => {
  const peer = await createFromJSON(relayPeer);

  const relay = await createLibp2p({
    peerId: peer,
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/0'
      ]
    },
    transports: [tcp()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    pubsub: gossipsub({ allowPublishToZeroPeers: true }),
    peerDiscovery: [
      new pubsubPeerDiscovery({
        interval: 1000
      })
    ],
    relay: {
      enabled: true, // Allows you to dial and accept relayed connections. Does not make you a relay.
      hop: {
        enabled: true // Allows you to be a relay for other peers
      }
    }
  })

  console.log(`libp2p relay starting with id: ${relay.peerId.toString()}`)

  await relay.start()

  const relayMultiaddrs = relay.getMultiaddrs()

  console.log(relayMultiaddrs);

  /*
  const [node1, node2] = await Promise.all([
    createNode(relayMultiaddrs),
    createNode(relayMultiaddrs)
  ])

  node1.addEventListener('peer:discovery', (evt) => {
    console.log(`Peer ${node1.peerId.toString()} discovered: ${evt.detail.id.toString()}`)
  })
  node2.addEventListener('peer:discovery', (evt) => {
    console.log(`Peer ${node2.peerId.toString()} discovered: ${evt.detail.id.toString()}`)
  })

  ;[node1, node2].forEach((node, index) => console.log(`Node ${index} starting with id: ${node.peerId.toString()}`))

  await Promise.all([
    node1.start(),
    node2.start()
  ])
  */

}
//})()

run()
