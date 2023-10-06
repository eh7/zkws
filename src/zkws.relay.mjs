/* eslint-disable no-console */

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

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import { relay as relayPeer, peer0, peer1 } from './zkws.peerIds.mjs'

;(async () => {
  const peer = await createFromJSON(relayPeer);

  //console.log(createFromJSON, relayPeer);

  const relay = await createLibp2p({
    peerId: peer,
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/0'
      ]
    },
    transports: [tcp(), circuitRelayTransport()],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    peerDiscovery: [
      pubsubPeerDiscovery({
        interval: 1000
      })
    ],
    services: {
      relay: circuitRelayServer(),
      identify: identifyService(),
      pubsub: floodsub()
    }
  })
  console.log(`libp2p relay started with id: ${relay.peerId.toString()}`)
  console.log(
    `multiAddr: ${relay.getMultiaddrs().map((m) => m.toString())}`
  );
  relay.getMultiaddrs().map((m) => {
    console.log(m);
  });
  console.log(relay.getMultiaddrs().map((m) => m));
  relay.getMultiaddrs().forEach((addr) => {
    console.log(addr.toString())
  })

  relay.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log(`Relay $relay.peerId.toString()} discovered: ${peer.id.toString()}`)
  })

  relay.getMultiaddrs().forEach((ma) => console.log(ma.toString()))


})()
