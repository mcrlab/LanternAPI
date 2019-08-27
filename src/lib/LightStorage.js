import Light from '../models/Light';

export default class LightStorage {
    constructor(){
        this.lights = new Map();
    }
    
    async get(id){
        return new Promise((resolve, reject)=> {
            const data = this.lights.get(id);
            if(data){
                resolve(new Light(data.id, data));     
            } else {
                reject("No light found");
            }
        });
    }

    async all(){
        return new Promise((resolve, reject)=> {
            let all = [];
            this.lights.forEach((data) => {
                all.push(new Light(data.id, data));
            });
            resolve(all);
        });
    }

    async set(id, update){
        console.log('update', id, update);
        return new Promise((resolve, reject)=> {
            const data = this.lights.get(id);
            let newData =  Object.assign({}, data, update);
            newData.lastUpdated = new Date();
            this.lights.set(id, newData);
            resolve(new Light(id, newData));
        });
    }
    
    async remove(id){
        return new Promise((resolve, reject)=> {
            resolve(this.lights.delete(id));
        })
    }
/*
    async get(id){
        try {
            const data = await this.all();
            let lightData = data.find((element)=> {
                return element.id == id
            });

            if(lightData){
                return new Light(id, lightData);
            } else {
                return undefined
            }
        } catch(e){
            console.log(e);
            return undefined;
        }
    }
    
    async all(){
        let all = new Map();
        try {
            const data = await this.getAsync('LIGHTS');
            if(data){
                all = new Map(JSON.parse(data));
            }
        } catch(e){
            console.log(e);
        } finally {
            return all;
        }
    }

    async set(id, update){
        let data = await this.all();    

        let newData =  Object.assign({}, data, update);
        newData.lastUpdated = new Date();
         console.log("Saving",newData);
        this.client.set(id,
            JSON.stringify(newData)
        );
        return new Light(id, newData);
    }
*/
}