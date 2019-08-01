import Light from './Light';

export default class LightStorage {
    constructor(){
        this.lights = {};
    }

    get(id){
        const data = this.lights['id'];
        if(data){
            return new Light(id, data);
        } else {
            return undefined
        }
    }

    all(){

        let all = [];
        Object.keys(this.lights).forEach((key, index)=>{
            all.push(new Light(key, this.lights[key]));
        });
        return all;
    }

    set(id, update){
        const data = this.lights[id];
        let newData =  Object.assign({}, data, update);
        newData.lastUpdated = new Date();
        this.lights[id] =  newData;
        return new Light(id, newData);
    }

}