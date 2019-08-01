import Light from '../models/Light';
const redis = require('redis');
const {promisify} = require('util');

const redisKey = "user:lights"

export default class LightStorage {
    constructor(){
        this.client = redis.createClient(process.env.REDIS_URL || "redis://redis:6379");
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
    }

    async fetchAllData(){
        let lights = {}
        try {
            const cache = await this.getAsync(redisKey);
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
            const lights = await this.fetchAllData()
            const data = lights[id];
            if(data){
                return new Light(id, data);
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
            let lights = await this.fetchAllData();

            Object.keys(lights).forEach((key, index)=>{
                all.push(new Light(key, lights[key]));
            });
        } catch(e){
            console.log(e);
        } finally {
            return all;
        }
    }

    async set(id, update){

        let lights = await this.fetchAllData();

        const data = lights[id];

        let newData =  Object.assign({}, data, update);
        newData.lastUpdated = new Date();
        lights[id] = newData;
       
        this.client.set(redisKey,
            JSON.stringify(lights)
        );
        return new Light(id, newData);
    }

}