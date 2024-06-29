import peers from './peers.js'

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

import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { kadDHT } from '@libp2p/kad-dht'

import { stdinToStream, streamToConsole } from './stream.js'

import { multiaddr } from '@multiformats/multiaddr'

import {
  createFromProtobuf,
} from '@libp2p/peer-id-factory'

const relayAddress = "/ip4/192.168.0.142/tcp/37237/ws/p2p/12D3KooWJFFzTUybGYeusoPT8Ku5Qpkfe8fCHHM8gfEXnpRDx19A"

const createNode = async (_peerId, _bootstrappers) => {
  //const peerUsed = (process.argv[2] === 'peer1') ? peer1 : peer[1];
  //const peer = await createFromJSON(peerUsed);
  const node = await createLibp2p({
    peerId: _peerId,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    transports: [tcp()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    peerDiscovery: [
      bootstrap({
        list: _bootstrappers
      }),
      pubsubPeerDiscovery({
        interval: 1000
      })
    ],
    services: {
      kadDHT: kadDHT(),
      pubsub: floodsub(),
      identify: identifyService()
    }
  })

  return node
}

//;(async () => {

  const peerId1 = await createFromProtobuf(
    Buffer.from(peers[1], 'hex')
  )
  const peerId2 = await createFromProtobuf(
    Buffer.from(peers[2], 'hex')
  )
  console.log(peerId1)
  console.log(peerId2)

  const [
    node1,
    node2,
  ] = await Promise.all([
    createNode(
      peerId1,
      [relayAddress],
    ),
    createNode(
      peerId2,
      [relayAddress],
    ),
  ])

  node1.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer1 ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
  })
  await node1.start()
  console.log('libp2p node1 has started')
  console.log(`STARTED - ${node1.peerId.toString()}`)
  //node1.getMultiaddrs().forEach((ma) => console.log('peer1: ', ma.toString()))

  node2.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Peer2 ${node2.peerId.toString()} discovered: ${peer.id.toString()}`)
  })
  await node2.start()
  console.log('libp2p node2 has started')
  console.log(`STARTED - ${node2.peerId.toString()}`)
 // node2.getMultiaddrs().forEach((ma) => console.log('peer2: ', ma.toString()))

  // 
  await node2.handle('/chat/1.0.0', async ({ stream }) => {
    // Send stdin to the stream
    stdinToStream(stream)
    // Read the stream and output to console
    streamToConsole(stream)
  })

  const node2Ma = node2.getMultiaddrs()[1]
  const stream = await node1.dialProtocol(node2Ma, '/chat/1.0.0')

  console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
  console.log('Type a message and see what happens')

  // Send stdin to the stream
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)

//})()

