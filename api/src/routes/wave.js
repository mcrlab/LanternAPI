const lights = require('../persistence/lights');
import {timeValidator, delayValidator, colorValidator } from '../validators/validators';

var express = require('express'),
    router = express.Router(),
    Queue = require("../persistence/queue"),
    Lights = require("../persistence/lights");

import LightMQTT from "../lib/LightMQTT";

router.post('/', async (req, res) => {
    try {
        const lights = await Lights.all();
        lights.sort((a,b)=>{
            return a.x - b.x
        });
        let color  = colorValidator(req.body.color);
        let time   = 500;
        let delay  = 50;
        let easing = req.body.easing || "LinearInterpolation";
        let method = req.body.method || "fill"
        
        let instructionSet = [];
    
        for(let i = 0; i < lights.length; i++){

            instructionSet.push({
              "lightID": lights[i].id,
              "color":       "000000",
              "instruction": LightMQTT("000000", "LinearInterpolation", 1000, 50, "fill")
            })
        }
        await Queue.insert(time + delay, JSON.stringify(instructionSet))

        for(let i = 0; i < lights.length; i++){
            console.log(i);
            instructionSet = [];
  
            if(i > 0){

                instructionSet.push({
                    "lightID":     lights[i-1].id,
                    "color":       "000000",
                    "instruction":  LightMQTT("000000", easing, time, delay, method)
                });
                
            }

            instructionSet.push({
              "lightID":     lights[i].id,
              "color":       color,
              "instruction": LightMQTT(color, easing, time, delay, method)
            })

            await Queue.insert(parseInt(delay + time), JSON.stringify(instructionSet))
        }

        instructionSet = [];
        instructionSet.push({
            "lightID":     lights[lights.length -1 ].id,
            "color":       "000000",
            "instruction": LightMQTT("000000", easing, time, delay, method)
          })

          await Queue.insert(parseInt(delay + time), JSON.stringify(instructionSet))

        res.json("success");
    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});

module.exports = router;