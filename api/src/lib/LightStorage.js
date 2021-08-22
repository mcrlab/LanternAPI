import Light from '../models/Light';
const Lights = require('../persistence/lights');

const db = require('../persistence/db');
const sql = require('sql-template-strings');
import { RGBObjectToHex } from './color';

export default class LightStorage {
    constructor(){
        this.lights = new Map();
        this.cleanup = setInterval(()=>{this.clear()}, 30000);
    }
    
    async get(id){
        let light = await Lights.find(id)
        if(light){
            console.log(light);
        }
        //     return new Light(id, rows[0])
        // } else {
        //     return null
        // }

        const lightData = await Promise.resolve(this.lights.get(id));
        if(lightData){
            return new Light(id, lightData);     
        } else {
            return null;
        }
    }

    async all(){
       const rows  = await Lights.all()

       console.log(rows);


       let lights = []
        let result = await Promise.resolve(this.lights);
        result.forEach(function(data, key) {
            lights.push(new Light(key, data));
         });
         return lights;
    }

    async set(id, update){
        let light = await Lights.find(id)

        if (!light) {
            light = await Lights.create(id, RGBObjectToHex(update.current_color), update.pixels, update.version);
        } else {
            light = await Lights.update(id, RGBObjectToHex(update.current_color), update.pixels, update.version);
        }
        console.log(light)
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