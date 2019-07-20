import LightNotFountError from '../exceptions/LightNotFoundError';
import Light from '../models/Light';

export default class LightingController {
  constructor(lightBroker) {
    this.lights = new Map();
    this.lightBroker = lightBroker;

    this.lightBroker.init((topic, message) => {
      this.handleMessage(message);
    });

  }

  handleMessage(message) {
    let data = JSON.parse(message);
    const id = data.id;
    let light;
    if(!this.lights.has(id)){
      light = new Light(id, data);
    } else {
      light = this.lights.get(id); 
      light.updateData(data);
    }

    this.lights.set(id, light);
  }


  updateLightColor(id, color){
      const light = this.lights.get(id);
      if(light) {  
          light.updateData({
            color
          });
          this.lightBroker.publish(`color/${id}`, JSON.stringify(color));
          return light;
      } else {
          throw new LightNotFountError();
      }
  }

  getAllLightsData() {
    const lights = [];
    this.lights.forEach((light) => {
      lights.push(light.toJSON());
    });
    return lights;
  }

  getLightDataById(id) {
    const light = this.lights.get(id);
    if(light) {
      return light.toJSON();
    } else {
      throw new LightNotFountError();
    }
  }
}
