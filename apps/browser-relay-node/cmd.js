/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

import { floodsub } from '@libp2p/floodsub'

import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { multiaddr } from '@multiformats/multiaddr'

import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'
import { stdinToStream, streamToConsole } from './stream.js'

if (!process.argv[2]) {
  console.log("UASAGE: node ", process.argv[1], " [path]")
  //process.exit(1);
}

let connectedPeeers = []

const node = await createLibp2p({
  addresses: {
    listen: ['/ip4/127.0.0.1/tcp/0/ws']
  },
  transports: [
    webSockets({
      filter: filters.all
    })
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  services: {
    identify: identifyService(),
    //pubsub: gossipsub(),
    pubsub: floodsub({
      emitSelf: true
    }),
    relay: circuitRelayServer()
  }
})

await node.start()

console.log('Relay listening on multiaddr(s): ', node.getMultiaddrs().map((ma) => ma.toString()))

node.addEventListener('peer:discovery', (event) => {
  console.log(
    'peer:discovery',
    event.detail.peerId
  )
})

node.addEventListener('peer:identify', async (event) => {
  console.log(
    'peer:identify',
    event.detail.peerId
  )

  //const stream = await node.dialProtocol(event.detail.peerId, '/chat/1.0.0')
  //console.log(stream)

/*
  if (!process.argv[2]) {
    //console.log('dialProtocol to:', peerList[0])
    //const stream = await node.dialProtocol(peerList[0], '/chat/1.0.0')
    console.log('dialProtocol to:', event.detail.peerId)
    const stream = await node.dialProtocol(event.detail.peerId, '/chat/1.0.0')
    console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
    console.log('Type a message and see what happens')
    stdinToStream(stream)
    // Read the stream and output to console
    streamToConsole(stream)
  }
*/
})

node.addEventListener('peer:disconnect', async (event) => {
  // await node.hangUp(ma, '/chat/1.0.0')
  //await node.stop()
  //await node.start()
  const peerList = node.getPeers()
  console.log(
    'peer:disconnect',
    event,
    peerList,
    event.detail.peerId
  )
  console.log(
    'hangUp',
    await node.hangUp(connectedPeeers[0])
    //await connectedPeeers.map(async (ma) => await node.hangUp(ma))
  )
  console.log('hangUp peers:', connectedPeeers,
    connectedPeeers.map((ma) => ma.toString())
  )
})

node.addEventListener('peer:connect', async (event) => {
  const peerList = node.getPeers()
  console.log(
    'peer:connect:',
    event,
    event.detail.peerId
    //peerList
  )
  console.log('peer(s): ', node.getPeers().map((ma) => ma.toString()))
  connectedPeeers = node.getPeers();
  //const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')
})

node.services.pubsub.addEventListener('message', (evt) => {
  console.log('---> pubsub message: ', evt)
})

await node.handle('/chat/1.0.0', async ({ stream }) => {
  try {
    // Send stdin to the stream
    stdinToStream(stream)
    // Read the stream and output to console
    streamToConsole(stream)
  }
  catch (e) {
    console.log('error node.handle:', e)
  }
})

if (process.argv[2]) {
  const val = process.argv[2]
  const ma = multiaddr(val)
  console.log(ma)
  await node.dial(ma)

  const topic = 'testing'
  const message = 'this is a test message'
  console.log(
    await node.services.pubsub.subscribe(topic)
  )
  await node.services.pubsub.publish(topic, fromString(message))

  /*
  const listenerMa = multiaddr(`/ip4/127.0.0.1/tcp/10333/p2p/${idListener.toString()}`)
  const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')
  */

  await node.hangUp(ma)
  const stream = await node.dialProtocol(ma, '/chat/1.0.0')
  console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
  console.log('Type a message and see what happens')
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)
/*
*/
}

/*
node.services.pubsub.subscribe('fruit')
node.services.pubsub.addEventListener('message', (evt) => {
  console.log(evt)
})

node.services.pubsub.publish('fruit', new TextEncoder().encode('banana'))

console.log(node.services.pubsub)
*/

/*
const dial = async () => {
  const value = process.argv[2] //"/ip4/127.0.0.1/tcp/44225/ws/p2p/12D3KooWRAyb4BPi5Q5FFQuApEdYXmVrKDZpst1JwYzq27GjgPoe"
  const ma = multiaddr(value)
  console.log(`Dialing '${ma}'`)
  await node.dial(ma)
  console.log(`Connected to '${ma}'`)
}

const run = async () => {
  dial()
  const topic = "testing"
  node.services.pubsub.subscribe(topic)
  console.log(node.services.pubsub)
  const peerList = node.services.pubsub.getSubscribers(topic)
  console.log('peerList', peerList)
}

run()
*/
