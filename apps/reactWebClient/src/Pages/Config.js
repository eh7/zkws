import * as React from 'react'

/*
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
//import { bootstrap } from '@libp2p/bootstrap'
import { floodsub } from '@libp2p/floodsub'
import { mplex } from '@libp2p/mplex'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
//import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { createLibp2p } from 'libp2p'
//import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
*/

export class Config extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
      input: {},
    };
  }

  render() {
    return (
      <h1>Pages - Config Page</h1>
    );
  }
}
