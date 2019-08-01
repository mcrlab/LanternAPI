var mqtt = require('mqtt')

export default class MQTTBroker {

  init(callback) {

    this.client  = mqtt.connect(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883')

    this.client.on('connect', () => {
      console.log("connected to broker");
      this.client.subscribe('connect');
      this.client.subscribe('disconnect');
    });

    this.client.on('message', (topic, message) => {
      callback(topic, message);
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

  publish(address, message) {
    console.log(address, message);
    this.client.publish(address, message);
  }

}
