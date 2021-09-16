const LightSequence = require('./persistence/sequence');
const Light = require('./persistence/lights');

import MQTTBroker from './lib/mqtt';

let broker;

async function getNextInstruction() {
    let sequence = await LightSequence.next();
    let wait = 100;
    if(sequence){
        await sequence.data.map(async (message)=>{
            const id = message['lightID'];
            const color = message['color'];
            const instruction = message['instruction'];
            broker.publish(`color/${id}`, instruction );
            await Light.updateColor(id, color);
        });
        wait = wait + sequence['wait'];

        await LightSequence.complete(sequence['id'])
    } else {}
    setTimeout(getNextInstruction, wait);
}

try {
    broker = new MQTTBroker();
    broker.init((topic, message) => {
        handleMessage(topic, message);
    });
    getNextInstruction()
} catch(e){
    console.log(e);
}