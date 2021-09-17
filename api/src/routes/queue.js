var express = require('express'),
    router = express.Router(),
    queue = require("../persistence/queue");
const auth = require("../lib/auth");

router.get('/', async (req, res) => {
    try {
        let count = await queue.count();
        let wait = await queue.wait();
        let total = await queue.total();
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
        await queue.clear();
        return res.json({});    
    } catch(error){
        res.status(error.status|| 400).json(error);
    };
});
 
module.exports = router;