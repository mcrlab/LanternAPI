import {RGBObjectToHex } from '../lib/color';

export default class Light {
    constructor(id, data){
        this.id = data.id;
        this.data = data;
        this.lastUpdated = new Date();
    }

    updateData(data){
        this.data = Object.assign({}, this.data, data);
        this.lastUpdated = new Date();
    }

    toJSON(){
        let data = {
            id: this.id,
            color: RGBObjectToHex(this.data.color)
        };
        return data;
    }

}