import express from 'express';
import {colorValidator, timeValidator, delayValidator, positionValidator} from '../validators/validators';
import {toRGBObject} from '../lib/color';

function createRoutes(lightingController) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        let lightData = await lightingController.getAllLightsData()        
        const response = {
          "lights": lightData
        };
        return res.json(response);    
       
    });


    router.put('/', async (req, res) => {
      try {
        let lights = req.body.lights;
        let response = {
          lights: []
        };
        
        for(let i = 0; i < lights.length; i++){
          let id = lights[i].id;
          let color = colorValidator(lights[i].color);
          let colorObject = toRGBObject(color);
          let time = timeValidator(lights[i].time);
          let delay = delayValidator(lights[i].delay);
          let easing = req.body.easing || "LinearInterpolation";
          let method = req.body.method || "fill"
          
          let light = await lightingController.updateLightColor(id, colorObject, time, delay, easing, method);
          response.lights.push(light);
        }
        
        return res.json(response);   
      } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
      };
    })
    
    router.get('/:light', async (req, res) => {
      try {
        let light = await lightingController.getLightDataById(req.params.light)
        return res.json(light);
      } catch(error){
          res.status(error.status||400).json(error||"Generic error");
      };
    });

    router.put('/:light', async (req, res) => {
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


    router.put('/position/:light', async (req, res) => {
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

    return router;
}

export default createRoutes;
