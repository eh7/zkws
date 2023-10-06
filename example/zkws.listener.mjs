import { createLibp2p } from './lib/libp2p.mjs'
import { stdinToStream, streamToConsole } from './lib/stream.mjs'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import {
  peer0 as peerIdListenerJson,
  peer1 as dialer,
} from './zkws.peerIds.mjs'

async function run () {
  // Create a new libp2p node with the given multi-address
  const idListener = await createFromJSON(peerIdListenerJson)
  const nodeListener = await createLibp2p({
    peerId: idListener,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/10333']
    }
  })

  // Log a message when a remote peer connects to us
  nodeListener.addEventListener('peer:connect', (evt) => {
    const remotePeer = evt.detail
    console.log('connected to: ', remotePeer.toString())
  })

  // Handle messages for the protocol
  await nodeListener.handle('/chat/1.0.0', async ({ stream }) => {
    // Send stdin to the stream
    stdinToStream(stream)
    // Read the stream and output to console
    streamToConsole(stream)
  })

  // Output listen addresses to the console
  console.log('Listener ready, listening on:')
  nodeListener.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString())
  })
}

run()
