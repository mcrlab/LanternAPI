var express = require('express'),
    router = express.Router();

import easings from '../lib/easings';


router.get('/', async (req, res) => {
    try {
        return res.json(easings);
    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});

 
module.exports = router;