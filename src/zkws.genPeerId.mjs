
//import PeerId from 'peer-id'
//console.log(PeerId);
//
import {
  createEd25519PeerId,
  createRSAPeerId,
  createFromJSON,
} from '@libp2p/peer-id-factory'
//import peerJSONData from './relay.mjs'

;(async () => {
  const peerIdRSA = await createRSAPeerId()
  const peerIdRSAJSON = {
    id: peerIdRSA.toString('hex'),
    privKey: peerIdRSA.privateKey.toString('base64'),
    pubKey: peerIdRSA.publicKey.toString('base64'),
  }
  console.log(peerIdRSAJSON);
  //console.log(await createFromJSON(peerIdRSAJSON));
})()
