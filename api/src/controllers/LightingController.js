import LightNotFoundError from '../exceptions/LightNotFoundError';
const Lights = require('../persistence/lights');
import { RGBObjectToHex } from '../lib/color';
import LightInstruction from '../lib/LightInstruction';
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
          const id = messageData.id;
          let light = await Lights.find(id);

          if(light){
            let updatedLight = await Lights.update(id, RGBObjectToHex(messageData.current_color), messageData.pixels, messageData.version, light.x, light.y);
          } else {
            let light = await Lights.create(id, "000000", messageData.pixels, messageData.version);
            this.lightBroker.publish(`color/${id}`, LightMQTT(light, null, 500, 10));
            if(this.cb){
              this.cb("ADD_LIGHT", light );
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
      let updatedLight = await Lights.update(id, color, light.pixels, light.version, light.x, light.y)
      this.lightBroker.publish(`color/${id}`, LightMQTT(updatedLight, easing, time, delay, method));
      if(this.cb){
        this.cb("UPDATE_LIGHT", LightInstruction(updatedLight, time, delay))
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
      
      let updatedLight = await Lights.update(id, color, light.pixels, light.version, x, y);

      this.lightBroker.publish(`color/${id}`, LightMQTT(updatedLight, null, 500, 500, null));
      
      if(this.cb){
        this.cb("UPDATE_LIGHT", LightInstruction(updatedLight))
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
  
  async sleepLight(id, time){
    let light = await Lights.find(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`sleep/${id}`, JSON.stringify(time));
    return LightJSON(light);
  }

  async deleteLight(id){
      let light = await Lights.delete(id);
      if(!light){
        throw new LightNotFoundError();
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
