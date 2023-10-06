/* eslint-disable no-console */

import { multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from './lib/libp2p.mjs'
import { stdinToStream, streamToConsole } from './lib/stream.mjs'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import {
  peer0 as peerIdListenerJson,
  peer1 as peerIdDialerJson,
} from './zkws.peerIds.mjs'

async function run () {
  const [idDialer, idListener] = await Promise.all([
    createFromJSON(peerIdDialerJson),
    createFromJSON(peerIdListenerJson)
  ])

  // Create a new libp2p node on localhost with a randomly chosen port
  const nodeDialer = await createLibp2p({
    peerId: idDialer,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    }
  })

  // Output this node's address
  console.log('Dialer ready, listening on:')
  nodeDialer.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString())
  })

  // Dial to the remote peer (the "listener")
  const listenerMa = multiaddr(`/ip4/127.0.0.1/tcp/10333/p2p/${idListener.toString()}`)
  const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')

  console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
  console.log('Type a message and see what happens')

  // Send stdin to the stream
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)
}

run()
