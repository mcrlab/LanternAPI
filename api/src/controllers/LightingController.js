import LightNotFoundError from '../exceptions/LightNotFoundError';
const Lights = require('../persistence/lights');

import LightMQTT from '../lib/LightMQTT';
import LightJSON from '../lib/LightJSON';

export default class LightingController {
  constructor(lightBroker) {
    this.lightBroker = lightBroker;
    this.cb = (key, message) => {};
    this.lightBroker.init((topic, message) => {
      this.handleMessage(topic, message);
    });
  }
  
  registerCallback(cb){
    this.cb = cb;
  }
  
  async handleMessage(topic, message) {
    try {
      switch(topic){
        case "connect":
          const messageData = JSON.parse(message);
          const address = messageData.id;            
          const config = JSON.stringify(messageData.config);
          const light = await Lights.findByAddress(address);
          const timestamp = Date.now() / 1000.0;

          if(light){
            await Lights.update(address, messageData.current_color, messageData.version, timestamp, config );
            if(light.sleep > 0){
              await this.sleepLight(light.id, light.sleep);
            }
          } else {
            let light = await Lights.create(address, "000000", messageData.version, timestamp, config);
            this.lightBroker.publish(`color/${address}`, LightMQTT(light.current_color, null, 500, 10));
            
            this.cb("ADD_LIGHT", LightJSON(light) );
            
          }
        default:
          return;
      }

    } catch (error) {
      console.log('Error', error)
    }
  }

  async updateLightFirmware(id) {
    let light = await Lights.find(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`update/${light.address}`, JSON.stringify({}));
    return LightJSON(light);
  }

  async updateLightConfig(id, config) {
    let light = await Lights.find(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`config/${light.address}`, config);
    return LightJSON(light);
  }
  
  async restartLight(id){
    let light = await Lights.find(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`restart/${light.address}`, JSON.stringify({}))
    return LightJSON(light);
  }

  async sleepLight(id, seconds){
    let light = await Lights.find(id);
    
    if(!light){
      throw new LightNotFoundError();
    }
    
    let updatedLight = await Lights.updateSleep(id, seconds);
    
        
    let data = {
      seconds: seconds
    };
    
    if(seconds > 0){
      this.lightBroker.publish(`sleep/${light.address}`, JSON.stringify(data));
    }
    
    this.cb("UPDATE_LIGHT", LightJSON(updatedLight));
    

    return LightJSON(updatedLight);
  }

  async deleteLight(id){
      let light = await Lights.delete(id);
      if(!light){
        throw new LightNotFoundError();
      }
      this.cb("REMOVE_LIGHT", LightJSON(light));
      
      return LightJSON(light);
  }
}
