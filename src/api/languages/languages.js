const express = require('express');
const { pool } = require('util/db');

const logger = require('util/logger')({name: 'api/languages'});
const router = express.Router();


router.post('/', async (req, res) => {
    // console.log('Received a POST request on /languages');
    // const { learningLanguage, nativeLanguage } = req.body;
    // console.log('Learning Language: ', learningLanguage);
    // console.log('Native Language: ', nativeLanguage);
    // res.send("Languages received");

    const { lang_id = 1 } = req.body;

    try {
        const query = `SELECT * FROM language_data.languages WHERE lang_id = $1`;
        const result = await pool.query(query, [lang_id]);
        console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database: ' + err.message);
    }
});

module.exports = router;