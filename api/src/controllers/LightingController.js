import LightNotFoundError from '../exceptions/LightNotFoundError';
const Lights = require('../persistence/lights');
import { RGBObjectToHex } from '../lib/color';
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
          const id = messageData.id;            
          const config = JSON.stringify(messageData.config);
          const light = await Lights.find(id);
          const timestamp = Date.now() / 1000.0;

          if(light){
            await Lights.update(id, RGBObjectToHex(messageData.current_color), messageData.version, light.x, light.y, light.sleep, timestamp, config );
            if(light.sleep > 0){
              await this.sleepLight(light.id, light.sleep);
            }
          } else {
            let light = await Lights.create(id, "000000", messageData.version, timestamp, config);
            this.lightBroker.publish(`color/${id}`, LightMQTT(light.current_color, null, 500, 10));
            
            this.cb("ADD_LIGHT", LightJSON(light) );
            
          }
          break;
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
    this.lightBroker.publish(`update/${id}`, JSON.stringify({}));
    return LightJSON(light);
  }

  async updateLightConfig(id, config) {
    let light = await Lights.find(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`config/${id}`, config);
    return LightJSON(light);
  }
  
  async restartLight(id){
    let light = await Lights.find(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`restart/${id}`, JSON.stringify({}))
    return LightJSON(light);
  }

  async sleepLight(id, seconds){
    let light = await Lights.find(id);
    
    if(!light){
      throw new LightNotFoundError();
    }
    
    let data = {
      seconds: seconds
    };
    
    let timestamp = new Date(light.last_updated).getTime() / 1000.0
    let updatedLight = await Lights.update(id, light.current_color, light.version, light.x, light.y, seconds, timestamp);
    
    if(seconds > 0){
      this.lightBroker.publish(`sleep/${id}`, JSON.stringify(data));
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
