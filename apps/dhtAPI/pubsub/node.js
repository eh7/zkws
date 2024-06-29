/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { floodsub } from '@libp2p/floodsub'
//import { identifyService } from '@libp2p/identify'
import { identifyService } from 'libp2p/identify'
import { mplex } from '@libp2p/mplex'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'

const createNode = async (bootstrappers = []) => {
  const config = {
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    transports: [tcp()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    pubsub: floodsub({
      //identify: identify(),
    }),
    //pubsub: new floodsub({
    //  emitSelf: true,
    //  enabled: true
    //}),
    peerDiscovery: [
      pubsubPeerDiscovery({
        //topics: topics,
        //listenOnly: false,
        interval: 1000
      })
    ],
    services: {
      identify: identifyService(),
      pubsub: floodsub(),
    }
  }

  if (bootstrappers.length > 0) {
    config.peerDiscovery.push(bootstrap({
      list: bootstrappers
    }))
  }

  return await createLibp2p(config)
}

const bootstrapList = [];
if (process.argv[2] !== '') {
  bootstrapList.push(process.argv[2])
}
const bootstrapper = await createNode(bootstrapList)

console.log(`libp2p bootstrapper started with id: ${bootstrapper.peerId.toString()}`)

const bootstrapperMultiaddrs = bootstrapper.getMultiaddrs().map((m) => m.toString())

console.log(bootstrapperMultiaddrs)

bootstrapper.addEventListener('peer:discovery', (evt) => {
  const peer = evt.detail
  console.log(`Peer ${bootstrapper.peerId.toString()} discovered: ${peer.id.toString()}`)
})

/*
const [node1, node2] = await Promise.all([
  createNode(bootstrapperMultiaddrs),
  createNode(bootstrapperMultiaddrs)
])

node1.addEventListener('peer:discovery', (evt) => {
  const peer = evt.detail
  console.log(`Peer ${node1.peerId.toString()} discovered: ${peer.id.toString()}`)
})
node2.addEventListener('peer:discovery', (evt) => {
  const peer = evt.detail
  console.log(`Peer ${node2.peerId.toString()} discovered: ${peer.id.toString()}`)
})
*/
