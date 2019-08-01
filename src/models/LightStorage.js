import Light from './Light';

export default class LightStorage {
    constructor(){
        this.lights = new Map()
    }

    id(id){
        const data = this.lights.get(id);
        return data;
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
    
    remove(id){
        return new Promise((resolve, reject)=> {
            resolve(this.lights.delete(id));
        })
    }
}