import express from 'express';
import bodyparser from 'body-parser';
import lightRoutes from '../routes/lights';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
 
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
  app.use(express.static('public'))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(bodyparser.json());
  app.use('/lights/', lightRoutes(lightController));
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  return app;
}

export default createApplication
