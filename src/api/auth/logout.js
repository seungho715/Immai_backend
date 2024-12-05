const express = require('express');

const logger = require('util/logger')({ name: 'api/auth/passwordlogin' })
const router = express.Router();

//Endpoint to handle user login for user data
router.get('/logout', async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({status: 200, message: "success"}).end();
})

module.exports = router;