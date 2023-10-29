/* eslint-disable no-console */

import delay from 'delay'

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { floodsub } from '@libp2p/floodsub'
import { mplex } from '@libp2p/mplex'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { createLibp2p } from 'libp2p'
import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

import { kadDHT } from '@libp2p/kad-dht'

import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

import {
  createFromJSON,
} from '@libp2p/peer-id-factory'
import { relay as relayPeer, peer0, peer1 } from './zkws.peerIds.mjs'
import { stdinToStream, streamToConsole } from './stream.mjs'

import { default as readline } from 'readline'
import { default as express } from 'express'
//import { default as  webpush } from 'web-push'
import { Server } from "socket.io"
import { createServer } from 'node:http'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const topic = 'news'

const createClientNode = async (bootstrappers) => {
  const node = await createLibp2p({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0/ws']
    },
    //transports: [tcp()],
    transports: [
      webSockets(),
    ],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    peerDiscovery: [
      bootstrap({
        list: bootstrappers
      }),
    ],
    services: {
      dht: kadDHT({
        allowQueryWithZeroPeers: true
      }),
      pubsub: floodsub(),
      identify: identifyService()
    }
  })

  node.services.pubsub.publish(topic, uint8ArrayFromString("hello from clientNode")).catch(err => {
    console.log("pubsub.publish error:", err)
  })
  node.services.pubsub.subscribe(topic)
  node.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      console.log(`>> web client received: ${uint8ArrayToString(evt.detail.data)} \n\ton topic ${evt.detail.topic}\n\tfrom ${evt.detail.from}`)
      //window.messages.value = "sssss";
    }
    //console.log(`node1 received: ${evt.detail.topic}`)
  })

  return node
}

const createNode = async (bootstrappers, _peer) => {
  const thisPeer = (_peer === 'peer1') ? peer1 : peer0
  const peer = await createFromJSON(thisPeer)
  const node = await createLibp2p({
    peerId: peer,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0/ws']
    },
    //transports: [tcp()],
    transports: [
      webSockets(),
      tcp(),
    ],
    streamMuxers: [yamux(), mplex()],
    connectionEncryption: [noise()],
    peerDiscovery: [
      bootstrap({
        list: bootstrappers
      }),
      pubsubPeerDiscovery({
        interval: 1000
      })
      /*
      */
    ],
    services: {
      dht: kadDHT({
        allowQueryWithZeroPeers: true
      }),
      pubsub: floodsub(),
      identify: identifyService()
    }
  })

  return node
}

;(async () => {

  const relayMultiaddrs = [
    //'/ip4/127.0.0.1/tcp/10333/p2p/QmYTDmfM9RnQBoqQ6Lrf5r9W958hs221M86sUgszbSw6q9'
    //'/ip4/127.0.0.1/tcp/10333/ws/p2p/QmYTDmfM9RnQBoqQ6Lrf5r9W958hs221M86sUgszbSw6q9'
    '/ip4/192.168.0.199/tcp/10333/p2p/QmYTDmfM9RnQBoqQ6Lrf5r9W958hs221M86sUgszbSw6q9'
  ]

  if (!process.argv[3]) {
    console.log('USAGE: node ', process.argv[1], ' <[peer0|peer1]> <port number>')
    process.exit(1)
  }

  const node = await createNode(relayMultiaddrs, process.argv[2])

  //const node = await createNode(relayMultiaddrs, 'peer0')

  await delay(1000)

  //console.log(Object.keys(node))

  node.addEventListener('peer:discovery', async (evt) => {
    const peer = evt.detail
    console.log(`Peer ${node.peerId.toString()} discovered: ${peer.id.toString()}`)
    //console.log(await node.peerStore.all());
  })

  // Handle messages for the protocol
  await node.handle('/chat/1.0.0', async ({ stream }) => {
    //console.log(12345, stream.toString());
    // Send stdin to the stream
    stdinToStream(stream)
    // Read the stream and output to console
    streamToConsole(stream)
  })
  // const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')

  // Dial to the remote peer (the "listener")
  //const stream = await node.dialProtocol(node.getMultiaddrs(), '/chat/1.0.0')
  //console.log('-----', await node.dialProtocol(node.getMultiaddrs(), '/chat/1.0.0'))
  //console.log(node2.getMultiaddrs())

  //console.log('Dialer dialed to listener on protocol: /chat/1.0.0')
  console.log('Type a message and see what happens')
/*
  // Send stdin to the stream
  stdinToStream(stream)
  // Read the stream and output to console
  streamToConsole(stream)
*/


  node.services.pubsub.subscribe(topic)
  node.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      console.log(`>> received: ${uint8ArrayToString(evt.detail.data)} \n\ton topic ${evt.detail.topic} from ${evt.detail.from}`)
    }
    //console.log(`node1 received: ${evt.detail.topic}`)
  })

//  setInterval(() => {
//    node.services.pubsub.publish(topic, uint8ArrayFromString('** PubSub Message from node2 **')).catch(err => {
//      console.error(err)
//    })
//    console.log('sent news pubsub test');
//  }, 5000)
  
  //console.log(node1.peerRouting.findPeer);
  //const peer = await node1.peerRouting.findPeer(node2.peerId)

  console.log('peerId1: ', node.peerId)

  rl.on('line', (line) => {
    if (line === 'exit') {
      console.log('>> node shutting down :: ' + line.toString().replace('\n', ''))
      process.exit(0);
    } else {
      node.services.pubsub.publish(topic, uint8ArrayFromString(line)).catch(err => {
        console.log(err)
      })
    }
    //console.log('> ', line);
  });

  rl.once('close', () => {
    // end of input
    console.log('rl close');
  });

  // express and socket,io setup and deployment
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  const clientNode = await createClientNode([
    node.getMultiaddrs()[0]
  ])

  io.on('connection', (socket) => {
    console.log('a user connected');
  });
  app.listen(process.argv[3], () => {
    console.log(node.getMultiaddrs())
    console.log(`Server running on port ${process.argv[3]}`);
  });
  app.get("/", (req, res, next) => {
    console.log("web root")
    //console.log(Object.keys(res))
    //res.set('Content-Type', 'text/html');
    //res.send(Buffer.from(`<h2>Web Root</h2>peer: ${node.peerId}`));
    res.sendFile(new URL('../build/test/zkws.node.0.2.1.html', import.meta.url).pathname);
  });
  app.get("/peerId", (req, res, next) => {
    res.json({ peerId: node.peerId })
    //res.json({
    //  peerId: node.peerId,
    //  users: ['gav','chris','paul']
    //});
  });
  app.get("/test", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
  });
  app.get("*", (req, res, next) => {
    //res.set('Content-Type', 'text/html');
    res.json([]);
  });

})()
