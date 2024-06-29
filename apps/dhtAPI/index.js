import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'
import { fromString, toString } from 'uint8arrays'

import { stdinToStream, streamToConsole } from './stream.js'

//import express from 'express'
//const app = express()

//localStorage.setItem('debug', 'libp2p:*')

const DOM = {
  peerId: () => document.getElementById('peer-id'),

  dialMultiaddrInput: () => document.getElementById('dial-multiaddr-input'),
  dialMultiaddrButton: () => document.getElementById('dial-multiaddr-button'),

  subscribeTopicInput: () => document.getElementById('subscribe-topic-input'),
  subscribeTopicButton: () => document.getElementById('subscribe-topic-button'),

  sendTopicMessageInput: () => document.getElementById('send-topic-message-input'),
  sendTopicMessageButton: () => document.getElementById('send-topic-message-button'),

  output: () => document.getElementById('output'),

  listeningAddressesList: () => document.getElementById('listening-addresses'),
  peerConnectionsList: () => document.getElementById('peer-connections'),
  topicPeerList: () => document.getElementById('topic-peers')
}

const appendOutput = (line) => {
  DOM.output().innerText += `${line}\n`
}
const clean = (line) => line.replaceAll('\n', '')

const libp2p = await createLibp2p({
  addresses: {
    listen: [
      // create listeners for incoming WebRTC connection attempts on on all
      // available Circuit Relay connections
      '/webrtc'
    ]
  },
  transports: [
    // the WebSocket transport lets us dial a local relay
    webSockets({
      // this allows non-secure WebSocket connections for purposes of the demo
      filter: filters.all
    }),
    // support dialing/listening on WebRTC addresses
    webRTC(),
    // support dialing/listening on Circuit Relay addresses
    circuitRelayTransport({
      // make a reservation on any discovered relays - this will let other
      // peers use the relay to contact us
      discoverRelays: 1
    })
  ],
  // a connection encrypter is necessary to dial the relay
  connectionEncryption: [noise()],
  // a stream muxer is necessary to dial the relay
  streamMuxers: [yamux()],
  connectionGater: {
    denyDialMultiaddr: () => {
      // by default we refuse to dial local addresses from the browser since they
      // are usually sent by remote peers broadcasting undialable multiaddrs but
      // here we are explicitly connecting to a local node so do not deny dialing
      // any discovered address
      return false
    }
  },
  services: {
    identify: identifyService(),
    pubsub: gossipsub({
      emitSelf: true
    })
  },
  connectionManager: {
    minConnections: 0
  }
})

await libp2p.start()

DOM.peerId().innerText = libp2p.peerId.toString()

function updatePeerList () {
  // Update connections list
  const peerList = libp2p.getPeers()
    .map(peerId => {
      const el = document.createElement('li')
      el.textContent = peerId.toString()
      return el
    })
  DOM.peerConnectionsList().replaceChildren(...peerList)
}

// update peer connections
libp2p.addEventListener('connection:open', () => {
  updatePeerList()
})
libp2p.addEventListener('connection:close', () => {
  updatePeerList()
})

// update listening addresses
libp2p.addEventListener('self:peer:update', () => {
  const multiaddrs = libp2p.getMultiaddrs()
    .map((ma) => {
      const el = document.createElement('li')
      el.textContent = ma.toString()
      return el
    })
  DOM.listeningAddressesList().replaceChildren(...multiaddrs)

  console.log('Dialer ready, listening on:', libp2p.getMultiaddrs())
  libp2p.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString())
  })
})

// dial remote peer
DOM.dialMultiaddrButton().onclick = async () => {
  try{ 
    const ma = multiaddr(DOM.dialMultiaddrInput().value)
    appendOutput(`Dialing '${ma}'`)
    console.log('swarm')
    await libp2p.dial(ma)
    appendOutput(`Connected to '${ma}'`)

    console.log('swarm', libp2p.getPeers())
  }
  catch (e) {
    console.log('dialMultiaddrButton err:', e)
  }
}

// subscribe to pubsub topic
DOM.subscribeTopicButton().onclick = async () => {
  const topic = DOM.subscribeTopicInput().value
  appendOutput(`Subscribing to '${clean(topic)}'`)

  //console.log(
  // libp2p.services.pubsub.subscribe,
  //)
  await libp2p.services.pubsub.subscribe(topic)

  //const peerList = libp2p.services.pubsub.getSubscribers(topic)
  //console.log('peerList', peerList)

  DOM.sendTopicMessageInput().disabled = undefined
  DOM.sendTopicMessageButton().disabled = undefined
}

// send message to topic
DOM.sendTopicMessageButton().onclick = async () => {
  const topic = DOM.subscribeTopicInput().value
  const message = DOM.sendTopicMessageInput().value
  appendOutput(`Sending message '${clean(message)}'`)

  await libp2p.services.pubsub.publish(topic, fromString(message))
}

/*
setInterval(() => {
  const message = 'testing 123 testing....'
  await libp2p.services.pubsub.publish(topic, fromString(message))
}, 5000)
*/

// update topic peers
setInterval(() => {
  const topic = DOM.subscribeTopicInput().value

  const peerList = libp2p.services.pubsub.getSubscribers(topic)
    .map(peerId => {
      const el = document.createElement('li')
      el.textContent = peerId.toString()
      return el
    })
  //console.log('peerList: ', peerList)
  DOM.topicPeerList().replaceChildren(...peerList)
}, 500)

libp2p.services.pubsub.addEventListener('message', event => {
  const topic = event.detail.topic
  const message = toString(event.detail.data)
  const peerId = event.detail.from.toString()

  //console.log('event.detail: ', event.detail)

  appendOutput(`Message received on topic '${topic}' from '${peerId}'`)
  appendOutput(message)
})

  // Log a message when a remote peer connects to us
libp2p.addEventListener('peer:connect', (evt) => {
  const remotePeer = evt.detail
  console.log('connected to: ', remotePeer.toString())
})

// Handle messages for the protocol
await libp2p.handle('/chat/1.0.0', async ({ stream }) => {
  // Send stdin to the stream
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)
})

/*
  // Output this node's address
  console.log('Dialer ready, listening on:', libp2p.getMultiaddrs())
  libp2p.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString())
  })

  // Dial to the remote peer (the "listener")
  const listenerMa = multiaddr(`/ip4/127.0.0.1/tcp/10334/p2p/${idListener.toString()}`)
  const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')

  console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
  console.log('Type a message and see what happens')

  // Send stdin to the stream
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)
*/
