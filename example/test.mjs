import { createLibp2p as createLibp2pNode } from 'libp2p'
//import { createLibp2p } from 'libp2p'
import { kadDHT } from '@libp2p/kad-dht'

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { floodsub } from '@libp2p/floodsub'
import { mplex } from '@libp2p/mplex'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { identifyService } from 'libp2p/identify'
import { tcp } from '@libp2p/tcp'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import {
  relay as relayJson,
  peer0 as peer0Json,
  peer1 as peer1Json,
} from './zkws.peerIds.mjs'

const relay = await createFromJSON(relayJson)
const peer0 = await createFromJSON(peer0Json)
const peer1 = await createFromJSON(peer1Json)

const relayNode = await createLibp2pNode({
  peerId: relay,
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0']
  },
  transports: [tcp()],
  streamMuxers: [yamux(), mplex()],
  connectionEncryption: [noise()],
  peerDiscovery: [
    //bootstrap({
    //  list: bootstrappers
    //}),
    pubsubPeerDiscovery({
      interval: 1000
    })
    /*
    */
  ],
  services: {
    dht: kadDHT({
      allowQueryWithZeroPeers: true
    }),
    pubsub: floodsub(),
    identify: identifyService()
  }
})
await relayNode.start();

const relayMultiaddrs = [
  '/ip4/127.0.0.1/tcp/10333/p2p/QmYTDmfM9RnQBoqQ6Lrf5r9W958hs221M86sUgszbSw6q9'
]
console.log(relayNode);

const peer0Node = await createLibp2pNode({
  peerId: peer0,
  services: {
    dht: kadDHT()
  },
  peerDiscovery: [
    bootstrap({
      list: relayMultiaddrs
    }),
    /*
    pubsubPeerDiscovery({
      interval: 1000
    })
    */
  ],
  transports: [tcp()],
  streamMuxers: [yamux(), mplex()],
  connectionEncryption: [noise()],
})

const peer1Node = await createLibp2pNode({
  peerId: peer1,
  services: {
    dht: kadDHT()
  },
  peerDiscovery: [
    bootstrap({
      list: relayMultiaddrs
    }),
    /*
    pubsubPeerDiscovery({
      interval: 1000
    })
    */
  ],
  transports: [tcp()],
  streamMuxers: [yamux(), mplex()],
  connectionEncryption: [noise()],
})
await peer0Node.start()
await peer1Node.start()

relayNode.addEventListener('peer:discovery', async (evt) => {
  const peer = evt.detail
  console.log(`RelayPeer ${relayNode.peerId.toString()} discovered: ${peer.id.toString()}`)
  console.log(await relayNode.peerStore.all());
})

peer0Node.addEventListener('peer:discovery', async (evt) => {
  const peer = evt.detail
  console.log(`Peer0 ${peer0Node.peerId.toString()} discovered: ${peer.id.toString()}`)
  console.log(await peer0Node.peerStore.all());
})

peer1Node.addEventListener('peer:discovery', async (evt) => {
  const peer = evt.detail
  console.log(`Peer1 ${peer1Node.peerId.toString()} discovered: ${peer.id.toString()}`)
  console.log(await peer1Node.peerStore.all());
})

console.log(
  relayNode.peerId,
  peer0Node.peerId,
  peer1Node.peerId,
  //await peer0Node.peerRouting.findPeer(relayNode.peerId)
  "relayNode", relayNode.peerId.toString()
)

//for await (const event of node.dht.findPeer(node.peerId)) {
//  console.info(event)
//}
