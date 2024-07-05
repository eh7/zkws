import express from 'express'
import bodyParser from 'body-parser'
import * as fs from 'fs';

//import runNode from './node.js'
import Libp2pNode from './node.js'
import { fromString, toString } from 'uint8arrays'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

import multer from 'multer'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let count = 0

const myDirname = "/var/tmp/source/"
const filename = "/tmp/source/message.json"

const libp2pNode = new Libp2pNode()

const pubsubMessages = []

try {
 fs.statSync(filename)
  JSON.parse(fs.readFileSync(filename).toString()).map((item) => {
    pubsubMessages.push(item)
  })
} catch (e) {
  console.log(e.message, e.errno)
}

if (fs.statSync(filename)) {
}

const app = express();
//const jsonParser = bodyParser.json()
//const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.json());
app.use(express.urlencoded());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(myDirname));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

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

  // JSON.stringify(newData, 0, 4) );
  const data = toObject(pubsubMessages)
  fs.writeFile(
    filename,
    JSON.stringify(
      data,
      0,
      4,
    ),
    (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync(filename, "utf8"));
    }
  });

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

app.post('/file/save/data', function (req, res) {
  //fs.readFileSync(myDirname + "/test.txt", "utf8")
  console.log('receiving data /file/save');
  console.log('body is ', req.body);
  res.send(req.body);
})

app.post(
  '/file/save/multi',
  upload.array('files', 12),
  (req, res, next) => {
  console.log(req.files)
  //res.send('Files uploaded successfully!')
  if (!req.files) {
    res.json({ error: 'not working' });
    return;
  }
  //const files = []
  const files = req.files.map((item) => {
    const path = item.destination + item.filename
    return path
  })
  res.json({
    status: 'files Uploaded Okay',
    files,
  });
  return;
});

app.post(
  '/file/save',
  upload.single('fileUpload'),
  (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    res.json({ error: 'not working' });
    return;
  }
  res.json({
    status: 'fileUpload',
    path: req.file.destination + req.file.filename,
  });
  return;
});

const server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})
