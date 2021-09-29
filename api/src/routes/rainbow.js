const lights = require('../persistence/lights');
import {timeValidator, delayValidator } from '../validators/validators';

var express = require('express'),
    router = express.Router(),
    Queue = require("../persistence/queue"),
    Lights = require("../persistence/lights");

import LightMQTT from "../lib/LightMQTT";

function intToHex(color){
    let char = color.toString(16);
    if(char.length == 1){
      char = "0"+char;
    }
    return char.toUpperCase();
  }

function RGBObjectToHex(colorObject){
    let hex = [];
    hex.push(intToHex(colorObject.r));
    hex.push(intToHex(colorObject.g));
    hex.push(intToHex(colorObject.b));
    return hex.join('');
}

function Wheel(WheelPos){
    WheelPos = 255 - WheelPos;
    if(WheelPos < 85) {
      return {
          "r":parseInt(255 - WheelPos * 3), 
          "g":0, 
          "b":parseInt(WheelPos * 3)
      };
    }
    if(WheelPos < 170) {
      WheelPos -= 85;
      return {
          "r":0, 
          "g":parseInt(WheelPos * 3), 
          "b":parseInt(255 - WheelPos * 3)
      };
    }
    WheelPos -= 170;
    return {
        "r":parseInt(WheelPos * 3), 
        "g":parseInt(255 - WheelPos * 3), 
        "b":0
    };
}

router.post('/', async (req, res) => {
    try {
        const lights = await Lights.all();
        lights.sort((a,b)=>{
            return a.x - b.x
        });

        let time =   timeValidator(req.body.time);
        let delay =  delayValidator(req.body.delay);
        let easing = req.body.easing || "LinearInterpolation";
        let method = req.body.method || "fill"

        let instructionSet = [];
        let wait = 0;
        lights.map((light, index)=>{

            let x = light.x;
            let value = 255 * x;
            let color = RGBObjectToHex(Wheel(value));

            wait = wait + (time + delay);
            instructionSet.push({
                "lightID": light.id,
                "address": light.address,
                "color":   color,
                "instruction": LightMQTT(color, easing, time, delay, method)
              });
        });
        await Queue.insert(wait, JSON.stringify(instructionSet))
        res.json("success");
    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});

module.exports = router;