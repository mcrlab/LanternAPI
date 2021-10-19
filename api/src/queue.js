import MQTTBroker from './lib/mqtt';
const Lights = require("./persistence/lights");
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

try {
  broker = new MQTTBroker("QUEUE");
  broker.init((topic, message) => {});
  getNextInstruction();
} catch(e){
  console.log(e);
}