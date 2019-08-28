import {RGBObjectToHex } from '../lib/color';

export default class Light {
    constructor(id, data){
        this.id = id;
        this.data = data;
    }

    toMQTT(){
        let data = {
            color: this.data.current_color,
            time: this.data.time,
            delay: this.data.delay
        };
        return data;
    }

    toInstruction(){
        let data = {
            id: this.id,
            color: RGBObjectToHex(this.data.current_color),
            time: this.data.time,
            delay: this.data.delay,
            position: {
                x: this.data.x || 0.5,
                y: this.data.y || 0.5
            }
        };
        return data;
    }

    toJSON(){
        let data = {
            id: this.id,
            color: RGBObjectToHex(this.data.current_color),
            position: {
                x: this.data.x || 0.5,
                y: this.data.y || 0.5
            },
            lastUpdated: this.data.lastSeen

        };
        return data;
    }

}