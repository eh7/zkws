/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'

import { createFromProtobuf } from '@libp2p/peer-id-factory'

//import peers from "./peers.json" assert { type: "json"  }
import peers from "./peers.js"

import express from 'express'
const app = express()
const port = 3999

const peerId = await createFromProtobuf(
  Buffer.from(peers[0], 'hex')
)
//console.log(peerId)
//process.exit()

app.get('/', (req, res) => {
  res.send('no pubkey specified')
})

app.get('/pubkey/*', (req, res) => {
  res.send('Hello World! for pubkey :: ', req.baseUrl)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const server = await createLibp2p({
  peerId,
  addresses: {
    listen: [
      '/ip4/0.0.0.0/tcp/0/ws'
      //'/ip4/127.0.0.1/tcp/0/ws'
    ]
  },
  transports: [
    webSockets({
      filter: filters.all
    })
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  dht: kadDHT(),
  services: {
    kadDHT: kadDHT(),
    identify: identifyService(),
    relay: circuitRelayServer()
  }
})

server.addEventListener('peer:connect', (event) => {
  const peerList = server.getPeers()
  console.log(
    'peer:connect:',
    event,
  )
  /*
  const connections = server.getConnections()
  console.log(
    'peer:connect:',
    event,
    peerList,
    Object.keys(connections),
    connections[0],
    connections[0].remoteAddr.toString(),
  )
  */
})

server.addEventListener('peer:disconnect', (event) => {
  const peerList = server.getPeers()
  console.log('peer:disconnect:', event, peerList)
  /*
  const connections = server.getConnections()
  console.log('peer:disconnect:', event, peerList, connections)
  */
})

server.addEventListener('self:peer:update', () => {
  console.log('self:peer:update')
  console.log('Relay listening on multiaddr(s): ', server.getMultiaddrs().map((ma) => ma.toString()))
})

console.log('Relay listening on multiaddr(s): ', server.getMultiaddrs().map((ma) => ma.toString()))
console.log(server.addEventListener)
