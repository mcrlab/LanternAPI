import express from 'express';
import {colorValidator, timeValidator, delayValidator, positionValidator} from '../validators/validators';
const Queue = require('../persistence/queue');
const Lights = require('../persistence/lights');
import LightMQTT from '../lib/LightMQTT';
import LightJSON from '../lib/LightJSON';
import LightNotFoundError from '../exceptions/LightNotFoundError';
const auth = require("../lib/auth");


function createLightRoutes(lightingController) {
    const router = express.Router();

    router.get('/', async (req, res) => {
      const lights = await Lights.all();
      let data = lights.map((light)=>{
        return LightJSON(light);
      })
      return res.json(data);;
    });


    router.post('/', async (req, res) => {
      try {
        let color       = colorValidator(req.body.color);
        let time        = timeValidator(req.body.time);
        let delay       = delayValidator(req.body.delay);
        let easing      = req.body.easing || "LinearInterpolation";
        let method      = req.body.method || "fill"
        let position    = req.body.position;

        let lightData   = await lightingController.getAllLightsData();
        let instructionSet = [];

        let wait = 0;

        for(let i = 0; i < lightData.length; i++){
          let calculatedDelay = 0;
          if(position){

            let distanceX = lightData[i].position.x - position.x;
            let distanceY = lightData[i].position.y - position.y;
            let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
            calculatedDelay = parseInt(delay * distance);
            if((calculatedDelay + time) > wait) {
              wait = parseInt(calculatedDelay + time);
            }
          } else {
            calculatedDelay = delay;
            wait = parseInt(time + delay);
          }
          
          let instruction = LightMQTT(color, easing, time, delay, method);

          instructionSet.push({
            "lightID": lightData[i].id,
            "color":       color,
            "instruction": instruction
          })
        }
        await Queue.insert(wait, JSON.stringify(instructionSet))
        
        lightData = await lightingController.getAllLightsData()  
        return res.json(lightData);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.get('/:lightID', async (req, res) => {
      try {
        const light = await Lights.find(req.params.lightID);
        if(light){
          return res.json(LightJSON(light));
        } else {
          throw new LightNotFoundError()
        }
      } catch(error){
        console.log(error);
          return res.status(error.status||400).json(error||"Generic error");
      };
    });

    router.post('/:lightID', async (req, res) => {
      try {
        let color =  colorValidator(req.body.color);
        let time =   timeValidator(req.body.time);
        let delay =  delayValidator(req.body.delay);
        let easing = req.body.easing || "LinearInterpolation";
        let method = req.body.method || "fill"
        
        let wait = parseInt(delay + time);
        let light = await lightingController.getLightDataById(req.params.lightID)

        let instructionSet = [];

        instructionSet.push({
          "lightID": req.params.lightID,
          "color":   color,
          "instruction": LightMQTT(color, easing, time, delay, method)
        });

        await Queue.insert(wait, JSON.stringify(instructionSet))
        
        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });


    router.post('/:lightID/position', auth, async (req, res) => {
      try {
        let x = positionValidator(req.body.x);
        let y = positionValidator(req.body.y);

        let light = await Lights.updatePosition(req.params.lightID, x, y);

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.post('/:lightID/update', auth, async (req, res) => {
      try {
        let light = await lightingController.updateLightFirmware(req.params.lightID)

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.post('/:lightID/sleep', auth, async (req, res) => {
      try {
        let light = await lightingController.sleepLight(req.params.lightID, req.body.seconds);

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.post('/:lightID/restart', auth, async (req, res) => {
      try {
        let light = await lightingController.restartLight(req.params.lightID);

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });


    router.post('/:lightID/config', auth, async (req, res) => {
      try {
        let data = JSON.stringify(req.body);
        let light = await lightingController.updateLightConfig(req.params.lightID, data)

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.post('/:lightID/delete', auth, async (req, res) => {
      try {
        let light = await lightingController.deleteLight(req.params.lightID)
        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });


    return router;
}

export default createLightRoutes;
