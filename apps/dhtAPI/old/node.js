/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { identify } from '@libp2p/identify'
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
//import { floodsub } from '@libp2p/floodsub'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
//import bootstrappers from './dht/bootstrappers.1.js'
import bootstrappers from './bootstrappers.js'

import { fromString, toString } from 'uint8arrays'

import events from 'events'

import { createFromProtobuf } from '@libp2p/peer-id-factory'
import peers from "./peers.js"

if (process.argv[2] !== '') {
  bootstrappers.push(process.argv[2])
}

class Libp2pNode {

  constructor() {
    this.runNode()
    this.eventEmitter = new events.EventEmitter()
  }

  topic = "testing000"


  runNode = async () => {

    const peerDiscovery = []
    if (bootstrappers.length > 0) {
      peerDiscovery.push(bootstrap({list: bootstrappers}))
    }

    const peerId = await createFromProtobuf(
      Buffer.from(peers[0], 'hex')
    )

    const node = await createLibp2p({
      addresses: {
        listen: ['/ip4/0.0.0.0/tcp/0']
      },
      transports: [tcp()],
      streamMuxers: [yamux(), mplex()],
      connectionEncryption: [noise()],
      //pubsub: floodsub({
      //  //identify: identify(),
      //}),
      peerDiscovery,
      services: {
        kadDHT: kadDHT(),
        identify: identifyService(),
        //pubsub: gossipsub(),
        //identify: identify()
        // pubsub: floodsub(),
        pubsub: gossipsub({
          //emitSelf: true
        })
      },
    })

    console.log(node.getMultiaddrs())

    this.node = node;

    const topic = "testing000"
    node.addEventListener('peer:connect', async (evt) => {
      const peerId = evt.detail
      console.log('Connection established to:', peerId.toString()) // Emitted when a peer has been found

      const peerList = node.getPeers()
      console.log('peerList::', peerList)

      await node.services.pubsub.subscribe(this.topic)
      const peerListSubscribers = await node.services.pubsub.getSubscribers(this.topic)
      console.log('peerListSubscribers (', this.topic, ') :: ', peerListSubscribers)
    })

    node.addEventListener('peer:discovery', (evt) => {
      const peerInfo = evt.detail
      console.log('Discovered:', peerInfo.id.toString())
    })

    node.services.pubsub.addEventListener('connection:open', event => {
      const peerList = node.getPeers()
      const peerInfo = evt.detail
      console.log('connection:open :: (peers, peerInfo) ::)', peers, peerInfo)
    })

    const message = "message txt here";
    //await node.services.pubsub.publish(topic, fromString(message))

    process.stdin.on('data', data => { 
      console.log(`You typed ${data.toString()}`); 
      const peerListSubscribers = node.services.pubsub.getSubscribers(this.topic)
      console.log('peerListSubscribers (', this.topic, ') :: ', peerListSubscribers)
      if(Object.keys(peerListSubscribers).length > 0) {
        const message = data.toString('utf8');
        node.services.pubsub.publish(this.topic, fromString(message))
      } else {
        console.log('no other peers')
      }
    });
   
    this.listenMessages()

    //return node
  }

  listenMessages = async () => {
    this.node.services.pubsub.addEventListener('message', (event) => {
      const from = event.detail.from
      console.log('mebug', Object.keys(event.detail))
      const topic = event.detail.topic
      const message = toString(event.detail.data)
      console.log(from + '\nmessage :: (text) :: ', message)
      this.eventEmitter.emit('node:p2p:message', event);
    })
  }
}

//runNode()

export default Libp2pNode
