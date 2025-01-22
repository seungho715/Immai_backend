const express = require('express');
const app2 = express()
const port = 3000

app2.use(express.json())
const { npcInteraction, exerciseGen, init } = require('./api/pyifc/ollamatest');

app2.listen(port, () => {
    console.log(`ollama testing on port ${port}`);
})

app2.get('/', async(req, res) => {
    try{
        var history = init('barista');
        history = await npcInteraction('hello how are you?', history);
        res.send(`${result}`);
    }
    catch (error)
    {
        console.log(error);
    }
    
})