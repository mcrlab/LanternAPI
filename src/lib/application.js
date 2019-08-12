import express from 'express';
import bodyparser from 'body-parser';

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
  app.use(express.static('public'));
  app.use(bodyparser.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use('/lights/', lightRoutes(lightController));
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  return app;
}

export default createApplication
