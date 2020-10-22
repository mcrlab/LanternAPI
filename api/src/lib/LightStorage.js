import Light from '../models/Light';

export default class LightStorage {
    constructor(){
        this.lights = new Map();
        this.cleanup = setInterval(()=>{this.clear()}, 5000);
    }
    
    async get(id){

        const lightData = await Promise.resolve(this.lights.get(id));
        if(lightData){
            return new Light(id, lightData);     
        } else {
            return null;
        }
    }

    async all(){
       let lights = []
        let result = await Promise.resolve(this.lights);
        result.forEach(function(data, key) {
            lights.push(new Light(key, data));
         });
         return lights;
    }

    async set(id, update){
        this.lights.set(id, update);
        return new Light(id, update);
        
    }

    async delete(id){
        this.lights.delete(id)
    }

    clear(){
        this.lights.forEach((data, key)=> {
            
            let now = new Date();
            let then = new Date(data['lastSeen']);
            let age = (now - then) / 1000;
            if(age > 30){
                this.lights.delete(key);
            }
        })    
    }
    
}