var express = require('express'),
    router = express.Router(),
    Colors = require("../persistence/colors");
const auth = require("../lib/auth");
const { colorValidator } = require('../validators/validators');

router.get('/', async (req, res) => {
    try {
        let colors = await Colors.all();
        return res.json(colors);

    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});

router.post('/', auth, async (req, res) => {
    try {
        let color = colorValidator(req.body.color);
        let name = req.body.name
        let insert = await Colors.insert(name, color);
        return res.json(insert);
    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});
 
module.exports = router;