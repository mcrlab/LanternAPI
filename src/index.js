import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';

const lightController = new LightingController(new MQTTBroker());

const app    = createApplication(lightController);

app.listen(process.env.PORT || '3001', '0.0.0.0', () => {
  console.log('received:');
});