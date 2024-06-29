import express from 'express'
import * as fs from 'fs';

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let count = 0

const app = express();
app.get('/', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      count++
      let newData = JSON.parse(data)

      newData.count = count

      console.log(newData)

      res.end( JSON.stringify(newData, 0, 4) );
   });
})

app.get('/:id', function (req, res) {
  console.log(req.params.id) 
  res.end( JSON.stringify({id:req.params.id}, 0, 4) );
})

const server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})
