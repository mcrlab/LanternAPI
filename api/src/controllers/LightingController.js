import LightNotFoundError from '../exceptions/LightNotFoundError';
const Lights = require('../persistence/lights');
import { RGBObjectToHex } from '../lib/color';
import LightMQTT from '../lib/LightMQTT';
import LightJSON from '../lib/LightJSON';

export default class LightingController {
  constructor(lightBroker) {
    this.lightBroker = lightBroker;

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
          console.log(messageData);
          const id = messageData.id;            
          let config = JSON.stringify(messageData.config);
          let light = await Lights.find(id);
          let timestamp = Date.now() / 1000.0;
          if(light){

            let updatedLight = await Lights.update(id, RGBObjectToHex(messageData.current_color), messageData.version, light.x, light.y, light.sleep, timestamp, config );
            if(light.sleep > 0){
              console.log(`light should sleep for ${light.sleep} seconds`);
              await this.sleepLight(light.id, light.sleep);

            }
          } else {
            let light = await Lights.create(id, "000000", messageData.version, timestamp, config);
            this.lightBroker.publish(`color/${id}`, LightMQTT(light, null, 500, 10));
            if(this.cb){
              this.cb("ADD_LIGHT", LightJSON(light) );
            }
          }

          break;
        default:
          return;
      }

    } catch (error) {
      console.log('Error', error)
    }
  }

  async updateLightColor(id, colorObject, time, delay, easing, method){
    
      let light = await Lights.find(id)
      if(!light){
        throw new LightNotFoundError();
      }
      let color = RGBObjectToHex(colorObject);
      let timestamp = new Date(light.last_updated).getTime() / 1000.0;
      let updatedLight = await Lights.update(id, color, light.version, light.x, light.y, light.sleep, timestamp, light.config)
      this.lightBroker.publish(`color/${id}`, LightMQTT(updatedLight, easing, time, delay, method));
      if(this.cb){
        this.cb("UPDATE_LIGHT", LightJSON(updatedLight));
      }
      return LightJSON(updatedLight);
  }
  
  async updateLightPosition(id, x, y, color){
    let light = await Lights.find(id)
      if(!light){
        throw new LightNotFoundError();
      }

      if(!color){
        color = light.current_color;
      }
      let timestamp = new Date(light.last_updated).getTime() / 1000.0;
      let updatedLight = await Lights.update(id, color, light.version, x, y, light.sleep, timestamp,  light.config);

      this.lightBroker.publish(`color/${id}`, LightMQTT(updatedLight, null, 500, 500, null));
      
      if(this.cb){
        this.cb("UPDATE_LIGHT", LightJSON(updatedLight));// LightInstruction(updatedLight))
      }
      return LightJSON(updatedLight);
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
    
    if(this.cb){
      this.cb("UPDATE_LIGHT", LightJSON(updatedLight));
    }

    return LightJSON(updatedLight);
  }

  async deleteLight(id){
      let light = await Lights.delete(id);
      if(!light){
        throw new LightNotFoundError();
      }
      if(this.cb){
        this.cb("REMOVE_LIGHT", LightJSON(light));
      }
      return LightJSON(light);
  }

  async getAllLightsData() {
    const lights = await Lights.all();

    let data = lights.map((light)=>{
      return LightJSON(light);
    })
    return data;
  }

  async getLightDataById(id) {
    const light = await Lights.find(id);
    if(light){
      return LightJSON(light);
    } else {
      throw new LightNotFoundError()
    }
  }
}
