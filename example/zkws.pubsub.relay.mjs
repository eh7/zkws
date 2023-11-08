import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { floodsub } from '@libp2p/floodsub'
import { mplex } from '@libp2p/mplex'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { webSockets } from '@libp2p/websockets'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

import { pull } from 'pull-stream'

import { kadDHT } from '@libp2p/kad-dht'

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
        //'/ip4/127.0.0.1/tcp/10333'
        '/ip4/127.0.0.1/tcp/10333/ws'
      ]
    },
    //transports: [tcp(), circuitRelayTransport()],
    transports: [webSockets(), circuitRelayTransport()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    peerDiscovery: [
      pubsubPeerDiscovery({
        interval: 1000
      })
    ],
    services: {
      dht: kadDHT({
        allowQueryWithZeroPeers: true
      }),
      relay: circuitRelayServer(),
      identify: identifyService(),
      pubsub: floodsub()
    }
  })
  console.log(`libp2p relay started with id: ${relay.peerId.toString()}`)

  const relayMultiaddrs = relay.getMultiaddrs().map((m) => m.toString())

  console.log(relayMultiaddrs);

  relay.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Relay Peer ${relay.peerId.toString()} discovered: ${peer.id.toString()}`)

    /*
    const pull = require('pull-stream')
    */
    libp2p.handle('/my/protocol/name/1.0.0', (protocolName, connection) => {
      pull(connection, pull.collect((err, data) => {
        console.log("received:", data.toString())
      }))
    })
    console.log(`Relay Peer ${relay.peerId.toString()} discovered: ${peer.id.toString()}`)

  })

  /*
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
  */

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
