var mqtt = require('mqtt')

class Light {
    constructor(id){
        console.log(`Creating new light ${id}`);
        this.state = {
            "id": id,
            "current_color": {
                "r":0,
                "g":0,
                "b":0
            }
        };
        this.client = mqtt.connect('mqtt://localhost:1883', {
            "username":process.env.MOSQUITTO_USERNAME,
            "password":process.env.MOSQUITTO_PASSWORD
        });
        this.client.on('connect', () => {
            console.log("connected to broker");
            this.client.subscribe(`color/${this.state.id}`);
            this.client.publish('connect', JSON.stringify(this.state));
            setInterval(()=> {
                console.log('ping');
                this.client.publish('connect', JSON.stringify(this.state));
            }, 30000);
        });
        
        this.client.on('message', (topic, message) => {
            const data = JSON.parse(message.toString());
            this.state = Object.assign({}, this.state,{
                current_color: data.color
            });
            console.log(this.state);
        });
        
        this.client
            .on('close', function() {
                console.log('close');
            });
        this.client
            .on('reconnect', function() {
                console.log('reconnect');
            });
        this.client
            .on('offline', function() {
                console.log('offline');
            });
        this.client
            .on('error', function(error) {
                console.log('error', error);
            });
    }
}

for(let i = 0; i < 10; i++){
    new Light(`LIGHT_ID_${i}`);

}







 

