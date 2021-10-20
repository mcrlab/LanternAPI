import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';

const helmet = require('helmet')
import lightRoutes from '../routes/lights';

var queueRoutes = require('../routes/queue');
var colorRoutes = require('../routes/colors');
var easingRoutes = require('../routes/easings');
var bufferRoutes = require("../routes/buffer");
var rainbow= require("../routes/rainbow");
var morgan = require('morgan')

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
  app.use(morgan("combined"))
  app.options('*', cors())
  app.use(bodyparser.json());
  app.use('/lights', lightRoutes(lightController));
  app.use("/easings", easingRoutes);
  app.use("/colors", colorRoutes);
  app.use('/queue', queueRoutes);
  app.use('/buffer', bufferRoutes);
  app.use('/rainbow', rainbow);
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  return app;
}

export default createApplication
