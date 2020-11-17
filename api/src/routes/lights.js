import express from 'express';
import {colorValidator, timeValidator, delayValidator, positionValidator} from '../validators/validators';
import {toRGBObject} from '../lib/color';

const basicAuth = require('express-basic-auth')
const username = process.env.username || "lantern";
const password = process.env.password || "password";
let user = {}
user[username] = password

const auth = basicAuth({users: user})

function createLightRoutes(lightingController) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        let lightData = await lightingController.getAllLightsData()        
        const response = {
          "lights": lightData
        };
        return res.json(response);    
       
    });


    router.put('/', auth, async (req, res) => {
      try {
        let color = colorValidator(req.body.color);
        let colorObject = toRGBObject(color);
        let time = timeValidator(req.body.time);
        let delay = delayValidator(req.body.delay);
        let easing = req.body.easing || "LinearInterpolation";
        let method = req.body.method || "fill"
        let position = req.body.position;

        let lightData = await lightingController.getAllLightsData();

        for(let i = 0; i < lightData.length; i++){
          let calculatedDelay = 0;
          if(position){

            let distanceX = lightData[i].position.x - position.x;
            let distanceY = lightData[i].position.y - position.y;
            let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
            calculatedDelay = delay * distance;
          } else {
            calculatedDelay = delay;
          }
          let light = await lightingController.updateLightColor(lightData[i].id, colorObject, time, calculatedDelay, easing, method);
        }
        
        return res.json({"message":"success"});

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.get('/:light', async (req, res) => {
      try {
        let light = await lightingController.getLightDataById(req.params.light)
        return res.json(light);
      } catch(error){
          res.status(error.status||400).json(error||"Generic error");
      };
    });

    router.put('/:light', auth, async (req, res) => {
      try {
        let color = colorValidator(req.body.color);
        let colorObject = toRGBObject(color);
        let time = timeValidator(req.body.time);
        let delay = delayValidator(req.body.delay);
        let easing = req.body.easing || "LinearInterpolation";
        let method = req.body.method || "fill"

        
        let light = await lightingController.updateLightColor(req.params.light, colorObject, time, delay, easing, method)

        return res.json(light);

      } catch(error){
          res.status(error.status|| 400).json(error);
      };
    });


    router.put('/:light/position', auth, async (req, res) => {
      try {
        let x = positionValidator(req.body.x);
        let y = positionValidator(req.body.y);
        let colorObject;
        if(req.body.color){
          let color = colorValidator(req.body.color);
          colorObject = toRGBObject(color);        
        }
        let light = await lightingController.updateLightPosition(req.params.light, x, y, colorObject)

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });

    router.put('/:light/update', auth, async (req, res) => {
      try {
        let light = await lightingController.updateLightFirmware(req.params.light)

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });


    router.put('/:light/config', auth, async (req, res) => {
      try {
        let data = JSON.stringify(req.body);
        let light = await lightingController.updateLightConfig(req.params.light, data)

        return res.json(light);

      } catch(error){
          console.log(error);
          res.status(error.status|| 400).json(error);
      };
    });


    return router;
}

export default createLightRoutes;
