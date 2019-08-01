import LightNotFoundError from '../exceptions/LightNotFoundError';


export default class LightingController {
  constructor(lightBroker, lightStorage) {
    this.lightStorage = lightStorage;
    this.lightBroker = lightBroker;

    this.lightBroker.init((topic, message) => {
      this.handleMessage(topic, message);
    });
  }

  async handleMessage(topic, message) {
    try {
      switch(topic){
        case "connect":
          let data = JSON.parse(message);
          const id = data.id;
          data.lastSeen = new Date().toString();
          await this.lightStorage.set(id, data)
          break;
        case "disconnect":
          console.log('disconnecting');
          break;
        default:
          return;
      }

    } catch (error) {
      console.log(error)
      console.log('Bad Light message - ', message);
    }
  }


  async updateLightColor(id, color, time, delay){
    
      let light = await this.lightStorage.get(id)
      if(!light){
        throw new LightNotFoundError();
      }
      let updatedLight = await this.lightStorage.set(id, {"current_color":color})
      this.lightBroker.publish(`color/${id}`, JSON.stringify({ "color": color, "time": time, "delay": delay}));
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

  async getLightDataById(id) {
    const light = await this.lightStorage.get(id);
    if(light){
      return light.toJSON();
    } else {
      throw new LightNotFoundError()
    }
  }
}
