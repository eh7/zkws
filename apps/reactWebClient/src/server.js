import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import https from 'https'
const app = express()
//const host = 'localhost'
//const host = '127.0.0.1'
const host = '192.168.0.142'
const port = 8000

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
//console.log(import.meta.url)
//console.log()
//console.log(__dirname)

const __dirname = process.cwd();
//const __dirname = '/tmp/';

app.use(express.static('dist'));

app.get('*', (req, res) => {
  //res.sendFile(path.resolve(__dirname, "..", 'dist', 'index.html'));
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`); 
})

// run this to create cert stuff
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
/*
https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: '1234'},
  app
).listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`); 
});
*/


////////////////////////
/*
const app = require('express')();
const https = require('https');
const fs = require('fs');
//GET home route
app.get('/', (req, res) => {    res.send('Hello World');});
// we will pass our 'app' to 'https' server
https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'YOUR PASSPHRASE HERE'},
  app
).listen(3000);
*/
