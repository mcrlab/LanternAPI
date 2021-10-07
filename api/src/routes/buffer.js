var express = require('express'),
    router = express.Router(),
    Lights = require('../persistence/lights');
const auth = require("../lib/auth");
const Queue = require('../persistence/queue');
import LightMQTT from '../lib/LightMQTT';
import queue from '../lib/redis';


router.get('/', async (req, res) => {
    try {
        return res.json("hello world");

    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error || "Oops something went wrong");
    };
});

router.post('/all', async (req, res) => {
    try {
        const updates = req.body.lights;
        const lights = await Lights.all();

        let instructionSet = [];
        let wait = 0;

        updates.map((update, index)=> {
            let light = lights.find((element)=> { return element.id == update.id});
            if(!light){
                return;
            }
            let color = update.color;
            let easing = update.easing || "LinearInterpolation";
            let time = update.time || 1000;
            let delay = update.delay || 0;
            
            if(time + delay > wait){
                wait = time + delay;
            }
            
            let instruction = LightMQTT(color, easing, time, delay);

            instructionSet.push({
                "lightID": light.id,
                "address": light.address,
                "color":    color,
                "instruction": instruction
            });
        });

        queue.add(wait, instructionSet);
        await Queue.insert(wait, JSON.stringify(instructionSet))

        return res.json("Success");

    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error || "Oops something went wrong");
    };
})

router.post('/', async (req, res) => {
    try {
        const colors = req.body.colors;
        const lights = await Lights.all();

        let time = 10;
        let delay = 10;
        let easing      = req.body.easing || "LinearInterpolation";

        let wait = parseInt(time + delay);
        let instructionSet = [];

        colors.map((color, i)=> {

            let instruction = LightMQTT(color, easing, time, delay);

            instructionSet.push({
                "lightID": lights[i].id,
                "address": lights[i].address,
                "color":    color,
                "instruction": instruction
            });
        });
        queue.add(wait, instructionSet);
        await Queue.insert(wait, JSON.stringify(instructionSet))

        return res.json("Success");

    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error || "Oops something went wrong");
    };
});


module.exports = router;