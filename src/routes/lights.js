import express from 'express';
import {colorValidator, timeValidator, delayValidator} from '../validators/validators';
import {toRGBObject} from '../lib/color';

function createRoutes(lightingController) {
    const router = express.Router();

    router.get('/', (req, res) => {
        const lights = lightingController.getAllLightsData();
        const response = {
          "lights": lights
        };
        res.json(response);
    });

    router.post('/', (req, res) => {
      try {
        let response = [];
        let lights = req.body.lights;

        lights.forEach((light)=> {
          let color = colorValidator(light.color);
          let colorObject = toRGBObject(color);
          let time = timeValidator(light.time);
          let delay = delayValidator(light.delay);
          response.push(lightingController.updateLightColor(light.id, colorObject, time, delay));
        })
        res.json({"lights": response});
            
      } catch (error){
        res.status(error.status|| 400).json(error);
      }
    });
    
    router.get('/:light', (req, res) => {
        try {
            const response = lightingController.getLightDataById(req.params.light);
            res.json(response);
        } catch (error) {
            res.status(error.status).json(error);
        }
    });

    router.post('/:light', (req, res) => {
        try {
          let color = colorValidator(req.body.color);
          let colorObject = toRGBObject(color);
          let time = timeValidator(req.body.time);
          let delay = delayValidator(req.body.delay);
          let response = lightingController.updateLightColor(req.params.light, colorObject, time, delay);
          res.json(response);
        } catch (error){
          res.status(error.status).json(error);
        }
      });

    return router;
}

export default createRoutes;
