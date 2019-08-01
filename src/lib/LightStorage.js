import Light from '../models/Light';
const redis = require('redis');
const {promisify} = require('util');

const redisKey = "user:lights:"

export default class LightStorage {
    constructor(){
        this.client = redis.createClient(process.env.REDIS_URL || "redis://redis:6379");
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.getKeys = promisify(this.client.keys).bind(this.client);
    }

    async fetchAllData(){
        let lights = {}
        try {
            
            console.log(cache);
            return {};

            if(cache){
                lights = JSON.parse(cache)
            }
        } catch(e){
            console.log(e);

        } finally {
            return lights;
        }

    }
    async get(id){
        try {
            const data = await this.getAsync(id);
            if(data){
                return new Light(id, JSON.parse(data));
            } else {
                return undefined
            }
        } catch(e){
            console.log(e);
            return undefined;
        }
    }

    async all(){
        let all = [];
        try {
            const keys = await this.getKeys('*');
            console.log(keys);
            for(let i = 0; i < keys.length; i++){
                let light = await this.get(keys[i]);
                all.push(light)
            }
            console.log(all);
        } catch(e){
            console.log(e);
        } finally {
            return all;
        }
    }

    async set(id, update){
        let data = await this.getAsync(id);
        if(!data){
            data = {}
        } else {
            data = JSON.parse(data);
        }
        
        let newData =  Object.assign({}, data, update);
        newData.lastUpdated = new Date();
         console.log("Saving",newData);
        this.client.set(id,
            JSON.stringify(newData),
            'EX', 
            30
        );
        return new Light(id, newData);
    }

}