const express = require('express');
const { genJwt } = require('util/user_tools/session');
const { USER_ENUMS } = require('util/enums');
const { verifyUserPassword, getUserByUsername, getUserByEmail, registerUser } = require('util/user_tools/users');

const logger = require('util/logger')({ name: 'api/auth/passwordlogin' })
const router = express.Router();

//Endpoint to handle user login for user data
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const { user, status } = await verifyUserPassword(username, password);

    if (status === USER_ENUMS.SUCCESS) {
        const jwt = await genJwt(user.id);
        res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true });
        return res.status(200).json({ status: 200, message: 'success' }).end();
    } else {
        return res.status(401).json({ status: 401, message: 'Login Failed' }).end();
    }
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, email } = req.body;

    // Log the incoming request data
    logger.info("Received data: " + JSON.stringify({ firstName, lastName, username, password, email }));

    try {
        const { user: nameUser } = await getUserByUsername(username);
        const { user: emailUser } = await getUserByEmail(email);

        if (nameUser || emailUser) {
            logger.info(`Username or email exists: ${username} ${email}`);
            return res.status(409).json({ status: 409, message: `User ${username} ${email} already exists` });
        }

        const { user } = await registerUser(firstName, lastName, username, password, email);

        const jwt = await genJwt(user.id);
        res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true });
        return res.status(200).json({ status: 200, user, message: 'success' }).end();
    } catch (err) {
        logger.error("Error creating user: "+ err);
        return res.status(500).json({ status: 500, message: 'Error creating user: ' + err.message }).end();
    }
});

module.exports = router;