import express from 'express';
import {colorValidator, timeValidator, delayValidator} from '../validators/validators';
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
        
        let light = await lightingController.updateLightColor(req.params.light, colorObject, time, delay)

        return res.json(light);

      } catch(error){
          res.status(error.status|| 400).json(error);
      };
    });

    return router;
}

export default createRoutes;
