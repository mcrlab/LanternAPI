import LightNotFoundError from '../exceptions/LightNotFoundError';
const Lights = require('../persistence/lights');
import { RGBObjectToHex } from '../lib/color';
import LightInstruction from '../models/LightInstruction';
import LightMQTT from '../models/LightMQTT';

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
            let light = Lights.create(id, "000000", messageData.pixels, messageData.version)
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
      console.log('Bad Light message - ', message.toString());
    }
  }

  async updateLightColor(id, colorObject, time, delay, easing, method){
    
      let light = await Lights.find(id)
      if(!light){
        throw new LightNotFoundError();
      }
      let color = RGBObjectToHex(colorObject);
      console.log(light);
      let updatedLight = await Lights.update(id, color, light.pixels, light.version, light.x, light.y)
      this.lightBroker.publish(`color/${id}`, LightMQTT(light, easing, time, delay, method));
      if(this.cb){
        this.cb("UPDATE_LIGHT", LightInstruction(light, time, delay))
      }
      return updatedLight;
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

      this.lightBroker.publish(`color/${id}`, LightMQTT(light, 500, 500));
      
      if(this.cb){
        this.cb("UPDATE_LIGHT", updatedLight)
      }
      return updatedLight;
  }

  async updateLightFirmware(id) {
    let light = await this.lightStorage.get(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`update/${id}`, JSON.stringify({}));
    return light;
  }

  async updateLightConfig(id, config) {
    let light = await this.lightStorage.get(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`config/${id}`, config);
    return light;
  }

  async getAllLightsData() {
    const lights = await Lights.all();
    return lights;
  }

  async getLightDataById(id) {
    const light = await Lights.find(id);
    if(light){
      return light;
    } else {
      throw new LightNotFoundError()
    }
  }
}
