const express = require('express');
const app2 = express()
const port = 3000

app2.use(express.json())
const { npcInteraction, exerciseGen } = require('./api/pyifc/ollamatest');

app2.listen(port, () => {
    console.log(`ollama testing on port ${port}`);
})

app2.get('/', async(req, res) => {
    try{
        const result = await npcInteraction('hello how are you?', 'barista');
        res.send(`${result}`);
    }
    catch (error)
    {
        console.log(error);
    }
    
})