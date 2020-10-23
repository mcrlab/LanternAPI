import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';

const helmet = require('helmet')
import lightRoutes from '../routes/lights';
 
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
  app.use('/', lightRoutes(lightController));
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  return app;
}

export default createApplication
