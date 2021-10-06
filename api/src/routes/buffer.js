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
        res.status(error.status|| 400).json(error);
    };
});


router.post('/', async (req, res) => {
    try {
        const colors = req.body.colors;
        const lights = await Lights.all();

        let time = 10;
        let delay = 10;
        let easing      = req.body.easing || "LinearInterpolation";
        let method      = req.body.method || "fill"
        let wait = parseInt(time + delay);
        let instructionSet = [];

        colors.map((color, i)=> {

            let instruction = LightMQTT(color, easing, time, delay, method);

            instructionSet.push({
                "lightID": lights[i].id,
                "address": lights[i].address,
                "color":    color,
                "instruction": instruction
            });

            console.log(color)
        });
        queue.add(wait, instructionSet);
        await Queue.insert(wait, JSON.stringify(instructionSet))

        return res.json("hello world");

    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error || "Oops something went wrong");
    };
});


module.exports = router;