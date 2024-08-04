import express from 'express'
import path from "path"
import { fileURLToPath } from 'url';
import { dirname }  from "path"
import SwaggerParser from 'swagger-parser'
import { connector } from 'swagger-routes-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from 'morgan'
// const logger = require('debug');
import cookieParser from 'cookie-parser'
import api from './api/index.js'

import swaggerUI from 'swagger-ui-express'
//import swaggerSpec from './swagger'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*
// initial env variables o process.env object
require('dotenv').config()
*/

// import regeneratorRuntime from "regenerator-runtime";
//
const jsonErrorHandler = async (err, req, res, next) => {
  res.status(err.statusCode).send({
    error: err.type,
    status: err.statusCode,
  });
}

const makeApp = async () => {
  const parser = new SwaggerParser();
//  const apiDescription = await parser.validate(path.join(__dirname, './zkws-api-3.yaml'));
  const apiDescription = await parser.validate(path.join(__dirname, './zkws-api.yaml'));
  const connect = connector(api, apiDescription);

  const app = express();
console.log(apiDescription)
//  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//  app.set('trust proxy', 'loopback, 87.224.39.210');

  app.use(bodyParser.json());
  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(jsonErrorHandler);

  // then connect the routes
  connect(app);  

  // add any error handlers last
  return app;
}

export default makeApp
