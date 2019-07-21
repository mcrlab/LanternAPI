import Light from './Light';

export default class LightStorage {
    constructor(){
        this.lights = new Map()
    }

    contains(id){
        return this.lights.has(id);
    }

    id(id){
        const data = this.lights.get(id);
        if(data){
            return new Light(data.id, data);     
        } else {
            return false;
        }
    }

    all(){
        let all = [];
        this.lights.forEach((data) => {
            all.push(new Light(data.id, data));
          });
        return all;
    }

    set(id, update){
        const data = this.lights.get(id);
        let newData =  Object.assign({}, data, update);
        newData.lastUpdated = new Date();
        this.lights.set(id, newData);
        return new Light(id, newData);
    }
}