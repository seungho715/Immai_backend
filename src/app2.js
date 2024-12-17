const express = require('express');
const app2 = express()
const port = 3000

app2.use(express.json())
const { npcInteraction } = require('./api/pyifc/ollamatest');

app2.listen(port, () => {
    console.log(`ollama testing on port ${port}`);
})

app2.get('/', async(req, res) => {
    try{
        const result = await npcInteraction('write a sentence in french using the word poubelle');
        res.send(`${result}`);
    }
    catch (error)
    {
        console.log(error);
    }
    
})