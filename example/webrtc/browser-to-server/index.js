import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { multiaddr } from '@multiformats/multiaddr'
import { pipe } from "it-pipe";
import { fromString, toString } from "uint8arrays";
import { webRTCDirect } from '@libp2p/webrtc'
import { pushable } from 'it-pushable';

import { kadDHT } from '@libp2p/kad-dht'

let stream;
const output = document.getElementById('output')
const sendSection = document.getElementById('send-section')
const appendOutput = (line) => {
  const div = document.createElement("div")
  div.appendChild(document.createTextNode(line))
  output.append(div)
}
const clean = (line) => line.replaceAll('\n', '')
const sender = pushable()

const node = await createLibp2p({
  services: {
    dht: kadDHT({
      allowQueryWithZeroPeers: true
    })
  },
  transports: [webRTCDirect()],
  connectionEncryption: [noise()],
  connectionGater: {
    denyDialMultiaddr: () => {
      // by default we refuse to dial local addresses from the browser since they
      // are usually sent by remote peers broadcasting undialable multiaddrs but
      // here we are explicitly connecting to a local node so do not deny dialing
      // any discovered address
      return false
    }
  }
});

await node.start()

window.myPeerId.value = node.peerId;

node.addEventListener('peer:connect', (connection) => {
  appendOutput(`Peer connected '${node.getConnections().map(c => c.remoteAddr.toString())}'`)
  sendSection.style.display = 'block'
})

window.connect.onclick = async () => {
  // TODO!!(ckousik): hack until webrtc is renamed in Go. Remove once
  // complete
  let candidateMa = window.peer.value
  candidateMa = candidateMa.replace(/\/webrtc\/certhash/, "/webrtc-direct/certhash")
  const ma = multiaddr(candidateMa)

  appendOutput(`Dialing '${ma}'`)
  stream = await node.dialProtocol(ma, ['/echo/1.0.0'])
  pipe(sender, stream, async (src) => {
    for await(const buf of src) {
      const response = toString(buf.subarray())
      appendOutput(`Received message '${clean(response)}'`)
    }
  })
}

window.send.onclick = async () => {
  const message = `${window.message.value}\n`
  appendOutput(`Sending message '${clean(message)}'`)
  sender.push(fromString(message))
}

window.searchPeerId.onclick = async () => {
  const message = `peerId: ${window.peerId.value}`
  alert(message);
  alert(node.peerRouting.findPeer)
  console.log(node)
  const peer = await node.peerRouting.findPeer(
    window.peerId.value
    //"12D3KooWGq2UboePMbfgB8ndPFGHt6MUetqU1QFMUASWVapLr8cc"
  )
  //const peer = await node.peerRouting.findPeer(node.peerId)
  //const peer = await node.dht.findPeer(node.peerId))
  alert(peer)
}
