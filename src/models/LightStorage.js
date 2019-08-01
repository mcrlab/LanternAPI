import Light from './Light';

export default class LightStorage {
    constructor(){
        this.lights = new Map()
    }

    id(id){
        return new Promise((resolve, reject)=> {
            const data = this.lights.get(id);
            if(data){
                resolve(new Light(data.id, data));     
            } else {
                reject("No light found");
            }
        });
    }

    all(){
        return new Promise((resolve, reject)=> {
            let all = [];
            this.lights.forEach((data) => {
                all.push(new Light(data.id, data));
            });
            resolve(all);
        });
    }

    set(id, update){
        console.log('update', id, update);
        return new Promise((resolve, reject)=> {
            const data = this.lights.get(id);
            let newData =  Object.assign({}, data, update);
            newData.lastUpdated = new Date();
            this.lights.set(id, newData);
            resolve(new Light(id, newData));
        });
    }
    
    remove(id){
        return new Promise((resolve, reject)=> {
            resolve(this.lights.delete(id));
        })
    }
}