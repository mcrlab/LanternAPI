var mqtt = require('mqtt')

export default class MQTTBroker {

  init(callback) {
    console.log(process.env);
    this.client  = mqtt.connect(process.env.MQTT_URL || 'mqtt://mqtt:1883',{
      'username':process.env.MOSQUITTO_USERNAME,
      'password': process.env.MOSQUITTO_PASSWORD
    });

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
