import {RGBObjectToHex } from '../lib/color';

export default class Light {
    constructor(id, data){
        this.id = data.id;
        this.data = data;
    }


    toJSON(){
        let data = {
            id: this.id,
            color: RGBObjectToHex(this.data.color)
        };
        return data;
    }

}