import { createLibp2p } from 'libp2p'

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

const run = async (bootstrappers) => {
  alert('script')
  const node = createClientNode([])
  alert('script')
}

alert('script 1321')
run()
