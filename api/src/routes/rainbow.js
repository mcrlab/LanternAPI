const lights = require('../persistence/lights');

var express = require('express'),
    router = express.Router(),
    queue = require("../persistence/queue"),
    Lights = require("../persistence/lights");

import LightMQTT from "../lib/LightMQTT";

function Wheel(WheelPos){
    WheelPos = 255 - WheelPos;
    if(WheelPos < 85) {
      return [255 - WheelPos * 3, 0, WheelPos * 3];
    }
    if(WheelPos < 170) {
      WheelPos -= 85;
      return [0, WheelPos * 3, 255 - WheelPos * 3];
    }
    WheelPos -= 170;
    return [WheelPos * 3, 255 - WheelPos * 3, 0];
}

router.get('/', async (req, res) => {
    try {
        const lights = await Lights.all();
        lights.sort((a,b)=>{
            return a.position.x - b.position.x
        });
        let sequence = [];
        lights.map((light)=>{
            let x = light.position.x;
            let value = 255 * x;
            console.log(value);
        });
        res.json("success");
    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});

module.exports = router;