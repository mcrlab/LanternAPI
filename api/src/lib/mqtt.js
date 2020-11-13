var mqtt = require('mqtt');
var url = require('url');

export default class MQTTBroker {

  init(callback) {
    var url = process.env.CLOUDMQTT_URL || 'mqtt://lantern:ilovelamp@localhost:1883';

    this.client  = mqtt.connect(url);

    this.client.on('connect', () => {
      console.log("connected to broker");
      this.client.subscribe('connect');
    });

    this.client.on('message', (topic, message) => {
      console.log({topic, message});
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
    this.client.publish(address, message);
  }

}
