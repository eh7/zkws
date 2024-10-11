import Bundler from 'parcel-bundler'
import app from'express'

const host = 'localhost'; 
const port = 8000

const file = 'index.html'; // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Bundler(file, options);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// Listen on port 8080
app.listen(8080);

/*
//const http = require('http');
//const fs = require('fs');

import http from 'http'
import fs from 'fs'

const host = 'localhost'; 
const port = 8000

http.createServer((req, res) => {
  const indexPath = 'dist/index.html'; // adjust to your production bundle location
  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(err.message);
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    }
  });
}).listen(port, () => {
  console.log('Production server listening on port ' + port);
  console.log(`Server is running on http://${host}:${port}`); 
});
*/

/*
//const express = require('express')
import express from 'express'
const app = express()
const host = 'localhost'; 
const port = 8000

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  //console.log(`Example app listening on port ${port}`)
  console.log(`Server is running on http://${host}:${port}`); 
})
*/

/*

//const http = require("http"); 
import http from "http"
const host = 'localhost'; 
const port = 8000; 
const requestListener = function (req, res) {
  //res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Type", "text/html");

  res.writeHead(200);
  //res.end({
  //  message: "My first server!",
  //});
  res.end("My first server!");
}; 
const server = http.createServer(requestListener); 
server.listen(port, host, () => { 
 console.log(`Server is running on http://${host}:${port}`); 
}); 
*/
