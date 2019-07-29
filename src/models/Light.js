import {RGBObjectToHex } from '../lib/color';

export default class Light {
    constructor(id, data){
        this.id = data.id;
        this.data = data;
        console.log(this.data);
    }


    toJSON(){
        let data = {
            id: this.id,
            color: RGBObjectToHex(this.data.current_color)
        };
        return data;
    }

}