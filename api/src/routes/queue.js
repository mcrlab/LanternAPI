var express = require('express'),
    router = express.Router();

    import queue from "../lib/redis";
const auth = require("../lib/auth");

router.get('/', async (req, res)=> {
    const length = await queue.len();
    return res.json(length);
});

router.post('/clear', auth, async (req, res) => {
    await queue.clear()
    return res.json("succss");
});
 
module.exports = router;