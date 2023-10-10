/* eslint-disable no-console */

import delay from 'delay'

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

import { kadDHT } from '@libp2p/kad-dht'

import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import { relay as relayPeer, peer0, peer1 } from './zkws.peerIds.mjs'
import { stdinToStream, streamToConsole } from './stream.mjs'

const createNode = async (bootstrappers, _peer) => {
  const thisPeer = (_peer === 'peer1') ? peer1 : peer0
  const peer = await createFromJSON(thisPeer)
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

  return node
}

;(async () => {

  const relayMultiaddrs = [
    '/ip4/127.0.0.1/tcp/10333/p2p/QmYTDmfM9RnQBoqQ6Lrf5r9W958hs221M86sUgszbSw6q9'
  ]

  const topic = 'news'

  const [node1, node2] = await Promise.all([
    createNode(relayMultiaddrs, 'peer0'),
    createNode(relayMultiaddrs, 'peer1')
  ])

  //await delay(1000)

//console.log(node1.getMultiaddrs())
//console.log(node2.getMultiaddrs())

//  await node1.peerStore.patch(node2.peerId, {
//    multiaddrs: node2.getMultiaddrs()
//  })
//  await node1.dial(node2.peerId)
//console.log(await node1.peerStore.all());
//
//
  await delay(1000)

  //console.log(await node1.peerRouting.findPeer(relayMultiaddrs.peerId))
//  console.log(node2.peerId)
//  const peerRoute = await node1.peerRouting.findPeer(node2.peerId)
//console.log(peer);
  console.log(Object.keys(node1))


  node1.addEventListener('peer:discovery', async (evt) => {
    const peer = evt.detail
    console.log(`Peer ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
    console.log(await node1.peerStore.all());
  })
  node2.addEventListener('peer:discovery', async (evt) => {
    const peer = evt.detail
    console.log(`Peer ${node2.peerId.toString()} discovered: ${peer.id.toString()}`)
    console.log(await node2.peerStore.all());
  })

  // Handle messages for the protocol
  await node1.handle('/chat/1.0.0', async ({ stream }) => {
    // Send stdin to the stream
    stdinToStream(stream)
    // Read the stream and output to console
    streamToConsole(stream)
  })
  // const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')

  // Dial to the remote peer (the "listener")
  const stream = await node2.dialProtocol(node1.getMultiaddrs(), '/chat/1.0.0')
  //console.log(node2.getMultiaddrs())
/*
  const listenerMa = multiaddr(`/ip4/127.0.0.1/tcp/10333/p2p/${node2.toString()}`)
  const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')
*/
  console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
  console.log('Type a message and see what happens')
  // Send stdin to the stream
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)


  node1.services.pubsub.subscribe(topic)
  node1.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      console.log(`node1 received: ${uint8ArrayToString(evt.detail.data)} on topic ${evt.detail.topic}`)
    }
    //console.log(`node1 received: ${evt.detail.topic}`)
  })

  node2.services.pubsub.subscribe(topic)
  node2.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      console.log(`node2 received: ${uint8ArrayToString(evt.detail.data)} on topic ${evt.detail.topic}`)
    }
    //console.log(`node1 received: ${evt.detail.topic}`)
  })

  setInterval(() => {
    node2.services.pubsub.publish(topic, uint8ArrayFromString('** PubSub Message from node2 **')).catch(err => {
      console.error(err)
    })
    node1.services.pubsub.publish(topic, uint8ArrayFromString('** PubSub Message from node1 **')).catch(err => {
      console.error(err)
    })
    console.log('sent news pubsub');
  }, 1000)
  
  //console.log(node1.peerRouting.findPeer);
  //const peer = await node1.peerRouting.findPeer(node2.peerId)


/*
  node1.services.pubsub.subscribe(topic)
  node1.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      console.log(`node1 received: ${uint8ArrayToString(evt.detail.data)} on topic ${evt.detail.topic}`)
    }
    //console.log(`node1 received: ${evt.detail.topic}`)
  })

  node2.services.pubsub.subscribe(topic)
  node2.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      console.log(`node2 received: ${uint8ArrayToString(evt.detail.data)} on topic ${evt.detail.topic}`)
    }
    //console.log(`node2 received:`)
  })

  setInterval(() => {
    node2.services.pubsub.publish(topic, uint8ArrayFromString('PubSub Message from node2: Bird bird bird, bird is the word!')).catch(err => {
      console.error(err)
    })
    node1.services.pubsub.publish(topic, uint8ArrayFromString('PubSub Message from node1')).catch(err => {
      console.error(err)
    })
    console.log('sent news pubsub');
  }, 1000)
*/

})()
