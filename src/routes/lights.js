import express from 'express';
import {colorValidator, timeValidator, delayValidator} from '../validators/validators';
import {toRGBObject} from '../lib/color';

function createRoutes(lightingController) {
    const router = express.Router();

    router.get('/', (req, res) => {
        lightingController.getAllLightsData()
          .then((lights)=>{
            const response = {
              "lights": lights
            };
            res.json(response);    
          })
          .catch((e)=> {
            console.log(e);
            res.status(e.status|| 400).json("Failed to fetch lights");
          })
    });
    
    router.get('/:light', (req, res) => {
      lightingController
        .getLightDataById(req.params.light)
        .then((light)=>{
          res.json(light);
        })
        .catch((error)=> {
          res.status(error.status||400).json(error||"Generic error");
        });
    });

    router.post('/:light', (req, res) => {
      let color = colorValidator(req.body.color);
      let colorObject = toRGBObject(color);
      let time = timeValidator(req.body.time);
      let delay = delayValidator(req.body.delay);
      lightingController
        .updateLightColor(req.params.light, colorObject, time, delay)
        .then((light)=>{
          res.json(light);
        })
        .catch((error)=> {
          console.log(error);
          res.status(error.status|| 400).json(error);
        });
      });

    return router;
}

export default createRoutes;
