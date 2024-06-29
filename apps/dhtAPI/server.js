import express from 'express'
import * as fs from 'fs';

//import runNode from './node.js'
import Libp2pNode from './node.js'
import { fromString, toString } from 'uint8arrays'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let count = 0

//const node = runNode()
const libp2pNode = new Libp2pNode()
const pubsubMessages = []

const app = express();

libp2pNode.eventEmitter.on('node:p2p:message', (event, messageEvent) => {
  console.log("in  server main node:p2p:message event")
//  console.log(event, messageEvent)
//  console.log(Object.keys(event))
//  console.log(Object.keys(event.detail))
  const from = event.detail.from
  const topic = event.detail.topic
  const message = toString(event.detail.data)
  const sequenceNumber = event.detail.sequenceNumber
  //console.log(event.detail)
  //console.log(from + '\nmessage :: (text) :: ', message)
  pubsubMessages.push({
    from,
    message,
    sequenceNumber,
    topic,
    timestamp: event.timeStamp,
  })
  //console.log('pubsubMessages :: ', pubsubMessages)
/*
  console.log('mebug', Object.keys(messageEvent.detail))
  const topic = messageEvent.detail.topic
  const message = toString(messageEvent.detail.data)
  console.log(from + '\nmessage :: (text) :: ', message)
*/
});

const toObject = (_data) => {
  return JSON.parse(JSON.stringify(_data, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ))
}

app.get('/', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      count++
      let newData = JSON.parse(data)

      newData.count = count

      console.log(newData)

      res.end( JSON.stringify(newData, 0, 4) );
   });
})

app.get('/messages', async function (req, res) {
  const data = toObject(pubsubMessages)
  console.log(
    //toObject(pubsubMessages)
    JSON.stringify(data, 0, 4)
  );
  //res.end( "JSON.stringify(pubsubMessages, 0, 4)" );
  res.end(
    JSON.stringify(data, 0, 4)
  )
})

app.get('/pub/:topic/:text', async function (req, res) {
})

app.get('/peerListSubscribers', async function (req, res) {
  // get peerListSubscribers from p2p pubsub network ofr a topic
  // then send api request
  //const topic = "testing000"
  const topic = libp2pNode.topic 
  const peerListSubscribers = await libp2pNode.node.services.pubsub.getSubscribers(topic)
  res.end( JSON.stringify(peerListSubscribers, 0, 4) );
})

app.get('/:id', function (req, res) {
  console.log(req.params.id) 
  res.end( JSON.stringify({id:req.params.id}, 0, 4) );
})

const server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})
