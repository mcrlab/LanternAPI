import Light from './Light';
const redis = require('redis');
const {promisify} = require('util');

const redisKey = "user:lights"
export default class LightStorage {
    constructor(){
        this.client = redis.createClient(process.env.REDIS_URL || "redis://redis:6379");
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
    }

    async get(id){
        const json = await this.getAsync(redisKey);
        const lights = JSON.parse(json);
        const data = lights[id];
        if(data){
            return new Light(id, data);
        } else {
            return undefined
        }
    }

    async all(){
        const json = await this.getAsync(redisKey);
        const lights = JSON.parse(json);
        let all = [];
        Object.keys(lights).forEach((key, index)=>{
            all.push(new Light(key, lights[key]));
        });
        return all;
    }

    async set(id, update){

        let lights;
        const cache = await this.getAsync(redisKey);

        if(!cache){
            lights = {}
        } else {
            lights = JSON.parse(cache)
        }

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