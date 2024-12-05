const express = require('express');
const { getUserByEmail, registerUser } = require('util/user_tools/users')
const { OAuth2Client } = require('google-auth-library');
const { genJwt } = require('util/user_tools/session');
const config = require('util/config');

const logger = require('util/logger')({ name: 'api/auth/googleoauth' })
const router = express.Router();


const client = new OAuth2Client();

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.google_client_id,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
    return {
        payload,
        userid
    }
}


router.post('/googletoken', async (req, res) => {
    return await verify(req.body.token)
        .then(async ({ payload, userid }) => {
            logger.debug(JSON.stringify(payload))
            const email = payload.email;
            const { user } = await getUserByEmail(email);
            logger.debug(JSON.stringify(user))
            if (user) {
                const jwt = await genJwt(user.id);
                res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true });
                return res.status(200).json({ status: 200, message: 'success' }).end();
            } else {
                const { user } = await registerUser(payload.name, payload.name, payload.email, null, payload.email);
                const jwt = await genJwt(user.id);
                res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true });
                return res.status(200).json({ status: 200, message: 'success' }).end();
            }
        })
        .catch(() => {
            return res.status(401).json({ status: 401, message: 'Google Authorization Failed' }).end();
        });
});

module.exports = router;