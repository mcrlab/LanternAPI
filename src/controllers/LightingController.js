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

  cleanLights(){

  }
  
  async handleMessage(topic, message) {
    try {
      switch(topic){
        case "connect":
          let data = JSON.parse(message);
          const id = data.id;
          data.lastSeen = new Date().toJSON();
          let light = await this.lightStorage.get(id);
          let instruction = ""; 
          if(light){
            data = Object.assign({}, light.data, data);
            instruction = "UPDATE_LIGHT";
          } else {
            instruction = "ADD_LIGHT;"
          }
          let updatedLight = await this.lightStorage.set(id, data);
          if(this.cb){
            this.cb(instruction, updatedLight.toJSON() );
          }
          break;
        case "disconnect":
          console.log('disconnecting');
          break;
        default:
          return;
      }

    } catch (error) {
      console.log(error)
      console.log('Bad Light message - ', message.toString());
    }
  }

  async updateLightColor(id, colorObject, time, delay){
    
      let light = await this.lightStorage.get(id)
      if(!light){
        throw new LightNotFoundError();
      }
      let update = Object.assign(light.data, { "current_color":colorObject, time, delay });
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
