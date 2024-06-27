/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { circuitRelayServer } from 'libp2p/circuit-relay'
//import { identify } from '@libp2p/identify'
//import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
//import bootstrappers from './bootstrappers.js'
import bootstrappers from './bootstrappers.empty.js'

import { createFromProtobuf } from '@libp2p/peer-id-factory'
import peers from "../peers.js"

const run = async () => {

  const peerId = await createFromProtobuf(
    Buffer.from(peers[0], 'hex')
  )

  const node = await createLibp2p({
    peerId,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    transports: [tcp()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    //peerDiscovery: [
    //  bootstrap({
    //    list: bootstrappers
    //  })
    //],
    services: {
      //kadDHT: kadDHT(),
      identify: identifyService(),
      kadDHT: kadDHT({
      //  protocol: '/ipfs/lan/kad/1.0.0',
      //  peerInfoMapper: removePublicAddressesMapper,
      //  clientMode: false
      }),
      //identify: identify()
      relay: circuitRelayServer()
    }
  })
  
  node.addEventListener('peer:connect', (evt) => {
    const peerId = evt.detail
    console.log('Connection established to:', peerId.toString()) // Emitted when a peer has been found
  })
  
  node.addEventListener('peer:discovery', (evt) => {
    const peerInfo = evt.detail
  
    console.log('Discovered:', peerInfo.id.toString())
  })

  node.addEventListener('self:peer:update', () => {
    console.log('self:peer:update')
    console.log('Relay listening on multiaddr(s): ', node.getMultiaddrs().map((ma) => ma.toString()))
  })

  console.log('Relay listening on multiaddr(s): ', node.getMultiaddrs().map((ma) => ma.toString()))
  console.log(node.addEventListener)

}

run()
