/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { floodsub } from '@libp2p/floodsub'
import { mplex } from '@libp2p/mplex'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

const createNode = async (bootstrappers) => {
  const node = await createLibp2p({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    transports: [tcp()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    peerDiscovery: [
      bootstrap({
        list: bootstrappers
      }),
      pubsubPeerDiscovery({
        interval: 1000
      })
    ],
    services: {
      pubsub: floodsub(),
      identify: identifyService()
    }
  })

  return node
}

;(async () => {

  const relayMultiaddrs = [
    '/ip4/127.0.0.1/tcp/10333/p2p/QmYTDmfM9RnQBoqQ6Lrf5r9W958hs221M86sUgszbSw6q9'
  ]

  const [node1, node2] = await Promise.all([
    createNode(relayMultiaddrs),
    createNode(relayMultiaddrs)
  ])

  node1.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
  })
  node2.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer ${node2.peerId.toString()} discovered: ${peer.id.toString()}`)
  })
})()
