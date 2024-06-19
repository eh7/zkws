/*
import { PeerId } from 'peer-id'

const id = await PeerId.create({ bits: 1024, keyType: 'RSA' })
console.log(JSON.stringify(id.toJSON(), null, 2))
*/

import {
  createPeerId,
  peerIdFromString,
} from '@libp2p/peer-id'
const peer = peerIdFromString('k51qzi5uqu5dkwkqm42v9j9kqcam2jiuvloi16g72i4i4amoo2m8u3ol3mqu6s')

console.log(peer.toCID()) // CID(bafzaa...)
console.log(peer.toString()) // "12D3K..."

/*
const peer1 = createPeerId({
  type: 'RSA',

    //multihash: MultihashDigest<number>;
    //privateKey?: Uint8Array;
    //publicKey?: Uint8Array;
    //equals(other?): boolean;
    //toBytes(): Uint8Array;
    //toCID(): CID<unknown, number, number, Version>;
    //toString(): string;
//  type: 'secp256k1',
}) 
console.log(peer1) 
*/
