const redis = require("redis");
const { promisify } = require("util");


let redisReady = false;
let redisClient = redis.createClient({
    host: process.env.REDIS_URL || '127.0.0.1',
    port: 6379
});

redisClient.on("error", (err) => {
   console.log("error", err)
});

redisClient.on("connect", (err) => {
    console.log("Redis Connected");
});

redisClient.on("ready", (err) => {
    redisReady = true;
    console.log("Redis Ready");
});

const pushAsync = promisify(redisClient.rpush).bind(redisClient);
const popAsync = promisify(redisClient.lpop).bind(redisClient);
const lengthAsync = promisify(redisClient.llen).bind(redisClient);

let add = async (wait, instructionSet)=>{
    if(redisReady){
        const data = {
            wait: wait,
            instructionSet: instructionSet
        };
        
        await pushAsync(['light-queue', JSON.stringify(data)]);
    }    
}

let pop = async ()=> {
    let data = await popAsync(['light-queue']);
    if(data){
        const obj = JSON.parse(data)
        return obj;
    }
    return null;
}
let len = async ()=> {
     let len = await lengthAsync(['light-queue']);
     console.log(len);
     return len;
 }

export default {
    add,
    pop,
    len
}