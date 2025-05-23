import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { multiaddr } from '@multiformats/multiaddr'
import { pipe } from "it-pipe";
import { fromString, toString } from "uint8arrays";
import { webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { pushable } from 'it-pushable';

/*
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
*/

const node = await createLibp2p({
  transports: [
   // webSockets({
   //   //filter: filter.all
   // }),
    webRTCDirect()
  ],
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

node.addEventListener('peer:connect', (connection) => {
  console.log(
    'peer:connect: ',
    node.getConnections().map(c => c.remoteAddr.toString()),
  )
  //appendOutput(`Peer connected '${node.getConnections().map(c => c.remoteAddr.toString())}'`)
  //sendSection.style.display = 'block'
})

//const candidateMa = "/ip4/192.168.0.199/udp/10333/webrtc-direct/certhash/uEiBax36XjOjEx1SSwzZjKZkb_clJk7YDHXOgpZkczwKXNA/p2p/16Uiu2HAm95sgxBhjjpqsTP5cYfMwpVARoJFt7z4RimaLkG25fR1k"
const candidateMa = "/ip4/192.168.0.199/udp/10333/webrtc-direct/certhash/uEiDX_aR3cCiAF-rc_NJqVZH_tAo6G2c-lRPFY-lEdo-agw/p2p/16Uiu2HAm95sgxBhjjpqsTP5cYfMwpVARoJFt7z4RimaLkG25fR1k";
//const candidateMa = "/ip4/192.168.0.199/tcp/40883/ws/p2p/12D3KooWM8WLLmHieLr2Q5X345bYELw5akTrgGx62SgtDAmfdWPz"
const ma = multiaddr(candidateMa)
console.log(ma);

async function run () {
  let stream = await node.dialProtocol(ma, ['/echo/1.0.0'])
}

run();




/*
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
*/
