import LightNotFoundError from '../exceptions/LightNotFoundError';


export default class LightingController {
  constructor(lightBroker, lightStorage) {
    this.lightStorage = lightStorage;
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
          let data = JSON.parse(message);
          const id = data.id;
          data.lastSeen = new Date().toJSON();
          let light = await this.lightStorage.get(id);
          if(light){
            data = Object.assign({}, light.data, data);
          }
          let updatedLight = await this.lightStorage.set(id, data);
          if(this.cb && !light){
            this.cb("ADD_LIGHT", updatedLight.toJSON() );
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
    
      let light = await this.lightStorage.get(id)
      if(!light){
        throw new LightNotFoundError();
      }
      let update = Object.assign(light.data, { "current_color":colorObject, time, delay, easing, method });
      let updatedLight = await this.lightStorage.set(id, update)
      this.lightBroker.publish(`color/${id}`, JSON.stringify(updatedLight.toMQTT()));
      if(this.cb){
        this.cb("UPDATE_LIGHT", updatedLight.toInstruction())
      }
      return updatedLight.toJSON();
  }
  
  async updateLightPosition(id, x, y, color){
    let light = await this.lightStorage.get(id)
      if(!light){
        throw new LightNotFoundError();
      }
      console.log("COLOR:", color);
      if(!color){
        console.log(light, light.data);
        color = light.data.current_color;
      }
      console.log("COLOR:", color);
      let update = Object.assign(light.data, {"x":x, "y":y, "current_color": color});
      
      let updatedLight = await this.lightStorage.set(id, update);
      this.lightBroker.publish(`color/${id}`, JSON.stringify(updatedLight.toMQTT()));
      
      if(this.cb){
        this.cb("UPDATE_LIGHT", updatedLight.toInstruction())
      }
      return updatedLight.toJSON();
  }

  async updateLightFirmware(id) {
    let light = await this.lightStorage.get(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`update/${id}`, JSON.stringify({}));
    return light.toJSON();
  }

  async updateLightConfig(id, data) {
    let light = await this.lightStorage.get(id);
    if(!light){
      throw new LightNotFoundError();
    }
    this.lightBroker.publish(`config/${id}`, data);
    return light.toJSON();
  }

  async getAllLightsData() {
    const lights = await this.lightStorage.all()
    const lightData = [];
    lights.forEach((light) => {
      lightData.push(light.toJSON());
    });
    return lightData;
  }

  async getAllLightInstructions() {
    const lights = await this.lightStorage.all()
    const lightData = [];
    lights.forEach((light) => {
      lightData.push(light.toInstruction());
    });
    return lightData;
  }

  async getLightDataById(id) {
    const light = await this.lightStorage.get(id);
    if(light){
      return light.toJSON();
    } else {
      throw new LightNotFoundError()
    }
  }
}
