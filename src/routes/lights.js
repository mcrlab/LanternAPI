import express from 'express';
import {colorValidator} from '../validators/validators';
import {toRGBObject} from '../lib/color';

function createRoutes(lightingController) {
    const router = express.Router();

    router.get('/', (req, res) => {
        const response = lightingController.getAllLightsData();
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
          let response = lightingController.updateLightColor(req.params.light, colorObject)
          res.json(response);
        } catch (error){
          res.status(error.status).json(error);
        }
      });

    return router;
}

export default createRoutes;
