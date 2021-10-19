import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';
import http from 'http'
import WebSocket from 'ws';
const Lights = require("./persistence/lights");
import LightJSON from './lib/LightJSON';

function server(){
  const lightController = new LightingController(new MQTTBroker("API"));

  const app    = createApplication(lightController);
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws) => {

    const lights = await Lights.all();
    let data = lights.map((light)=>{
      return LightJSON(light);
    })

    ws.send(JSON.stringify(
      {
        "instruction": "ALL_LIGHTS",
        "data": { "lights": data }
      }
    ));

    lightController.registerCallback((instruction, data)=>{
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(
            {
              "instruction": instruction,
              "data": data
            }
          ));
        }
      });
    });
  
  });

  server.listen(process.env.PORT || '3001', '0.0.0.0', () => {
    console.log('received:');
  });
}

server();