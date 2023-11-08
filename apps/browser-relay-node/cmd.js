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

if (!process.argv[2]) {
  console.log("UASAGE: node ", process.argv[1], " [path]")
  //process.exit(1);
}

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

node.addEventListener('peer:connect', (event) => {
  const peerList = node.getPeers()
  console.log(
    'peer:connect:',
    event,
    //peerList
  )
  console.log('peer(s): ', node.getPeers().map((ma) => ma.toString()))
})

node.services.pubsub.addEventListener('message', (evt) => {
  console.log('--- pubsub message: ', evt)
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
