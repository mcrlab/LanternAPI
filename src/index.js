import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';
const http = require('http');

const lightController = new LightingController(new MQTTBroker());

const app    = createApplication(lightController);
console.log('env', process.env.HOST, process.env.CLIENT);
app.listen(3001, '0.0.0.0', () => {
  console.log('received:');
});