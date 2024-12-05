const express = require('express');

const logger = require('util/logger')({name: 'api/proficiencies'});
const router = express.Router();

let proficiencies = {};

router.post('/', (req, res) => {
    // console.log('Received a POST request on /proficiencies');
    // const { selectedLanguage, currentProficiency, targetFluency} = req.body;
    // console.log('selected Language: ', selectedLanguage);
    // console.log('Current Proficiency: ', currentProficiency);
    // console.log('Target Fluency: ', targetFluency);
    // res.send("Proficiencies received and stored");
})

router.get('/:languages', (req, res) => {
    const language = req.params.language;
    const proficiency = proficiencies[language];

    if (proficiency) {
        res.json(proficiency);
    }
    else {
        res.status(404).send("Proficiency not found for the specified language");
    }
})

module.exports = router;