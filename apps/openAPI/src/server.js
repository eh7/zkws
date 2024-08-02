// const makeApp = require('./makeApp');
import makeApp from './makeApp.js';

//exports.makeApp = function makeApp()
makeApp()
  .then(app => app.listen(3000))
//  .then(app => app.listen(3003, '10.0.0.10'))
//  .then(app => app.listen(3003, '192.168.1.14'))
  .then(() => {
    console.log('Server started')
    console.log('http://localhost:3000')
//    console.log('http://10.0.0.10:3003')
  })
  .catch(err => {
    console.error('caught error', err)
  })

/*

const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Your API routes go here

app.listen(3000, () => {
console.log('Server is running on port http://localhost:3000');
});
*/
