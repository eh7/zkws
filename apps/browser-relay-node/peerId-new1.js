import {
  createEd25519PeerId,
  createFromProtobuf,
  createRSAPeerId,
  exportToProtobuf,
} from '@libp2p/peer-id-factory'

import fs from 'fs';

const peerId = await createEd25519PeerId()
//console.log(peerId.toString())
/*
const peerIdRSA = await createRSAPeerId()
//console.log(peerIdRSA.toString())
*/

//console.log(exportToProtobuf(peerIdRSA))

let peers = []
for(let i=0; i<6; i++) {
  const buf = exportToProtobuf(peerId)
  peers.push(Buffer.from(buf).toString('hex'))
}

console.log(peers)

process.exit()

//fs.writeFileSync('peer02-buffer.dat', buf)
const bufIn = fs.readFileSync('peer00-buffer.dat')

//console.log(peerId);

/*
*/
//console.log(
//  peerId,
//  buf
//)

//var buf = JSON.parse(fs.readFileSync('peer00-protobuf.json', 'utf8'));
//console.log(buf)
const testPeer = await createFromProtobuf(bufIn)
console.log(testPeer)
console.log(bufIn)
console.log(
  Buffer.from(buf)
)
