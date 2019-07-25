import LightNotFountError from '../exceptions/LightNotFoundError';
import LightStorage from '../models/LightStorage';

export default class LightingController {
  constructor(lightBroker) {
    this.lights = new LightStorage();
    this.lightBroker = lightBroker;

    this.lightBroker.init((topic, message) => {
      this.handleMessage(topic, message);
    });

  }

  handleMessage(topic, message) {
    try {
      switch(topic){
        case "connect":
          let data = JSON.parse(message);
          const id = data.id;
          this.lights.set(id, data);
          break;
        case "disconnect":
          console.log('disconnecting');
          break;
        default:
          return;
      }

    } catch (error) {
      console.log('Bad Light message - ', message);
    }
  }


  updateLightColor(id, color, time){

      if(this.lights.contains(id)) {  
          const light = this.lights.set(id, {
            color
          });
          this.lightBroker.publish(`color/${id}`, JSON.stringify({ "color": color, "time": time}));
          return light;
      } else {
          throw new LightNotFountError();
      }
  }

  getAllLightsData() {
    const lights = [];
    this.lights.all().forEach((light) => {
      lights.push(light.toJSON());
    });
    return lights;
  }

  getLightDataById(id) {
    if(this.lights.contains(id)) {
      const light = this.lights.id(id);
      return light.toJSON();
    } else {
      throw new LightNotFountError();
    }
  }
}
