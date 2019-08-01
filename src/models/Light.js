import {RGBObjectToHex } from '../lib/color';

export default class Light {
    constructor(id, data){
        this.id = id;
        this.data = data;
    }

    toJSON(){
        let data = {
            id: this.id,
            color: RGBObjectToHex(this.data.current_color)
        };
        return data;
    }

}