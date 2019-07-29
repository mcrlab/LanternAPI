var mqtt = require('mqtt')
let state = {
    "id": "light",
    "color": {
        "r":0,
        "g":0,
        "b":0
    }
};

const client  = mqtt.connect('mqtt://localhost:1883', { will: { topic: 'disconnect', payload: 'me' } })

client.on('connect', () => {
    console.log("connected to broker");
    client.subscribe('color/light');
    client.publish('connect', JSON.stringify(state));
    setInterval(()=> {
        console.log('ping');
        client.publish('connect', JSON.stringify(state));
    }, 5000);
});

client.on('message', (topic, message) => {
    console.log(topic, message);
});

client
    .on('close', function() {
        console.log('close');
    });
client
    .on('reconnect', function() {
        console.log('reconnect');
    });
client
    .on('offline', function() {
        console.log('offline');
    });
client
    .on('error', function(error) {
        console.log('error', error);
    });

 

