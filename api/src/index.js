import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';
import LightStorage from './lib/LightStorage';
import http from 'http'
import WebSocket from 'ws';

function server(){
  const lightController = new LightingController(new MQTTBroker(), new LightStorage());

  const app    = createApplication(lightController);
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws) => {
    const allLights = await lightController.getAllLightsData();
    ws.send(JSON.stringify(
      {
        "instruction": "ALL_LIGHTS",
        "data": { "lights": allLights }
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
function startApp(){
  server();
}

startApp();