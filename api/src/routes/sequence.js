var express = require('express'),
    router = express.Router(),
    sequence = require("../persistence/sequence");
const auth = require("../lib/auth");

router.get('/', async (req, res) => {
    try {
        let count = await sequence.count();
        let wait = await sequence.wait();
        let total = await sequence.total();
        return res.json({
            "count":parseInt(count),
            "wait": parseInt(wait),
            "total": parseInt(total)
        });    
    } catch(error){
        console.log(error);
        res.status(error.status|| 400).json(error);
    };
});

router.post('/clear', auth, async (req, res) => {
    try {
        await sequence.clear();
        return res.json({});    
    } catch(error){
        res.status(error.status|| 400).json(error);
    };
});
 
module.exports = router;