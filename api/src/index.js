import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';
import http from 'http'
import WebSocket from 'ws';
const Lights = require("./persistence/lights");
import LightJSON from './lib/LightJSON';

const Queue = require('./persistence/queue');

let broker;

async function getNextInstruction() {
    let sequence = await Queue.next();
    let wait = 100;
    if(sequence){
        await sequence.data.map(async (message)=>{
            const id = message['lightID'];
            const color = message['color'];
            const instruction = message['instruction'];
            broker.publish(`color/${id}`, instruction );
            await Lights.updateColor(id, color);
        });
        wait = wait + sequence['wait'] + (parseInt(process.env.WAIT_TIME) || 1000);
        await Queue.complete(sequence['id'])
        console.log("waiting for: ", wait);

    } else {}
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
function startApp(){
  server();
}

try {
  broker = new MQTTBroker();
  broker.init((topic, message) => {});
  getNextInstruction();
} catch(e){
  console.log(e);
}

startApp();