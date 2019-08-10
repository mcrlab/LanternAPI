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
          data.lastSeen = new Date().toString();
          let updatedLight = await this.lightStorage.set(id, data);
          if(this.cb){
            this.cb( updatedLight.toJSON() );
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

  async updateLightColor(id, color, time, delay){
    
      let light = await this.lightStorage.get(id)
      if(!light){
        throw new LightNotFoundError();
      }

      let updatedLight = await this.lightStorage.set(id, { "current_color":color, time, delay })
      this.lightBroker.publish(`color/${id}`, JSON.stringify(updatedLight.toMQTT()));
      if(this.cb){
        this.cb(updatedLight.toInstruction())
      }
      return updatedLight.toJSON();
  }

  async updateLightPosition(id, x, y){
    let light = await this.lightStorage.get(id)
      if(!light){
        throw new LightNotFoundError();
      }

      let updatedLight = await this.lightStorage.set(id, {"x":x, "y":y})
      
      if(this.cb){
        this.cb(updatedLight.toInstruction())
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
