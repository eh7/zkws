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

import { multiaddr } from '@multiformats/multiaddr'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import { relay as relayPeer, peer0, peer1 } from './zkws.peerIds.js'

//const relay = multiaddr(process.argv[2]);
//const relay = process.argv[2];
const relay = [
  '/ip4/127.0.0.1/tcp/46653/p2p/12D3KooWFz7m2XUNZKEPx2NUvEDeapbnJTMeBDWAKhYjLVTv2SfW'
];
/*
const relay = [
  'ip4/192.168.0.199/tcp/44907/p2p/12D3KooWJaYNawAgTswDHs5eACwZwqxuvMjj61aaHsu5ir7nUMUR'
];
*/

const createNode = async (bootstrappers) => {
  const peerUsed = (process.argv[2] === 'peer1') ? peer1 : peer0;
  const peer = await createFromJSON(peerUsed);
  const node = await createLibp2p({
    peerId: peer,
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

//  console.log(relay);
  const [node1] = await Promise.all([
    createNode([relay])
  ])

  node1.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer1 ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
  })

  await node1.start()
  console.log('libp2p has started')
  console.log(`STARTED - ${node1.peerId.toString()}`)

  node1.getMultiaddrs().forEach((ma) => console.log(ma.toString()))

//  console.log(`STARTED - Peer ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
/*
*/

  /*
  const relayMultiaddrs = relay.getMultiaddrs().map((m) => m.toString())

  const [node1, node2] = await Promise.all([
    createNode(relayMultiaddrs),
    createNode(relayMultiaddrs)
  ])
  

  node1.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer1 ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
  })
  node2.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer2 ${node2.peerId.toString()} discovered: ${peer.id.toString()}`)
  })
  */
})()
