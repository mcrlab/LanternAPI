import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';
import http from 'http'
import WebSocket from 'ws';
const Lights = require("./persistence/lights");
import LightJSON from './lib/LightJSON';
import queue from './lib/redis';


let broker;

async function getNextInstruction() {
  let sequence = await queue.pop();
  let wait = 1;
  if(sequence){
      await sequence.instructionSet.map(async (message)=>{
          const id = message['lightId'];
          const address = message['address'];
          const color = message['color'];
          const instruction = message['instruction'];
          broker.publish(`color/${address}`, instruction );
          await Lights.updateColor(id, color);
      });
      wait = sequence['wait'] + (parseInt(process.env.WAIT_TIME) || 0);
      console.log("waiting for: ", wait);
  } 
  setTimeout(getNextInstruction, wait);
}

function server(){
  const lightController = new LightingController(new MQTTBroker());

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

try {
  broker = new MQTTBroker();
  broker.init((topic, message) => {});
  getNextInstruction();
} catch(e){
  console.log(e);
}

server();