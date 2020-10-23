var mqtt = require('mqtt');
var url = require('url');

export default class MQTTBroker {

  init(callback) {
  //  var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://mqtt:1883');
    var url = process.env.CLOUDMQTT_URL || 'mqtt://mqtt:1883';
//    var auth = (mqtt_url.auth || ':').split(':');

    this.client  = mqtt.connect(url);

    this.client.on('connect', () => {
      console.log("connected to broker");
      this.client.subscribe('connect');
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
    this.client.publish(address, message);
  }

}
