import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
const swaggerUi = require('swagger-ui-express');
let swaggerDocument = require('../../swagger.json');

const helmet = require('helmet')
import lightRoutes from '../routes/lights';
import easings from '../models/easings';

function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler (err, req, res, next) {
    res.status(500).send({ error: 'Your request was malformed' })
}

const createApplication = (lightController) => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.options('*', cors())
  app.use(bodyparser.json());
  app.use('/lights/', lightRoutes(lightController));
  app.get("/easing", (req, res)=> {
    return res.json(easings);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  return app;
}

export default createApplication
