import express from 'express';
import {colorValidator, timeValidator} from '../validators/validators';
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
          let response = lightingController.updateLightColor(req.params.light, colorObject, time);
          res.json(response);
        } catch (error){
          res.status(error.status).json(error);
        }
      });

    return router;
}

export default createRoutes;
