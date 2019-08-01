import LightNotFoundError from '../exceptions/LightNotFoundError';
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
          data.lastSeen = new Date().toString();
  
          this.lights.set(id, data)
            .then(()=>{
              console.log('light updated');
            })
            .catch((e)=>{
              console.log('error', e);
            });
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
    
    return new Promise((resolve, reject)=>{
      this.lights.id(id)
      .then((light)=>{
        return this.lights.set(light.id, {"current_color":color})
      })
      .then((light)=>{
        this.lightBroker.publish(`color/${id}`, JSON.stringify({ "color": color, "time": time, "delay": delay}));
        resolve(light.toJSON());
      })
      .catch((e)=>{
        reject(new LightNotFoundError());
      });

  });
}

  updateAllLightColor(color, time, delay){

    let lightData = [];
    this.lights.all().forEach((light) => {
      lightData.push(this.updateLightColor(light.id, color, time, delay));
    });
    return lightData;
  }

  getAllLightsData() {
    return new Promise((resolve, reject)=> {
      this.lights.all()
        .then((lights)=> {
          const lightData = [];
          lights.forEach((light) => {
            console.log('light', light);
            lightData.push(light.toJSON());
          });
          resolve(lightData);
        })
        .catch((e)=> {
          reject(e);
        })
    });
  }

  getLightDataById(id) {
    return new Promise((resolve, reject)=> {
      this.lights.id(id)
        .then((light)=> {
          resolve(light.toJSON());
        })
        .catch((error)=>{
          reject(new LightNotFoundError());
        })
    });
  }
}
