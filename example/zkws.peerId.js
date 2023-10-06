
/*
import {
  peerIdFromString,
  createPeerId,
} from '@libp2p/peer-id'

const init = {};
init.type = 'RSA';
//console.log(init);

const peerId = createPeerId(
  init
)

console.log(peerId)
*/

import { peerIdFromString } from '@libp2p/peer-id'

const peer = peerIdFromString('k51qzi5uqu5dkwkqm42v9j9kqcam2jiuvloi16g72i4i4amoo2m8u3ol3mqu6s')
//const peer = peerIdFromString('4550de8c8989fe1e2b01a76a555383fba64d21667e3bee72082f30cdd0bba9')

//console.log(peer.toCid()) // CID(bafzaa...)
console.log(peer.toString()) // "12D3K..."
console.log(peer) // "12D3K..."
