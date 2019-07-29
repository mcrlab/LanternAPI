import LightNotFountError from '../exceptions/LightNotFoundError';
import LightStorage from '../models/LightStorage';

export default class LightingController {
  constructor(lightBroker) {
    this.lights = new LightStorage();
    this.lightBroker = lightBroker;

    this.lightBroker.init((topic, message) => {
      this.handleMessage(topic, message);
    });
    this.lightRemoval = setInterval(()=>{
      this.cleanLights()
    }, 5000);
  }

  cleanLights(){
    const now = new Date().getTime();
    console.log('cleaning');
    this.lights.all().forEach((light)=> {
      if((light.lastSeen + 10000) < now){
        this.lights.remove(light.id);
        console.log(`removing light ${light.id}`);
      }
    });
  }

  handleMessage(topic, message) {
    try {
      switch(topic){
        case "connect":
          let data = JSON.parse(message);
          const id = data.id;
          data.lastSeen = new Date().toString();
          console.log(data);
          this.lights.set(id, data);
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


  updateLightColor(id, color, time, delay){

      if(this.lights.contains(id)) {  
          const light = this.lights.set(id, {
            color
          });
          this.lightBroker.publish(`color/${id}`, JSON.stringify({ "color": color, "time": time, "delay": delay}));
          return light;
      } else {
          throw new LightNotFountError();
      }
  }

  updateAllLightColor(color, time, delay){
    let lightData = [];
    this.lights.all().forEach((light) => {
      lightData.push(this.updateLightColor(light.id, color, time, delay));
    });
    return lightData;
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
