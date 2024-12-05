const { getUserByUsername, getUserById } = require('util/user_tools/users');
const { validateJwt } = require('util/user_tools/session');

const logger = require('util/logger')({ name: 'util/middleware/user_info' });

async function tempUsernameMiddleware(req, res, next) {
    const username = req.params.username;
    const {user, status} = await getUserByUsername(username);
    if (user) {
        req.params.uid = user.id;
        return next();
    } else {
        logger.error('Error retrieving data from the database: ');
        return res.status(500).send('Error retrieving data from the database: ');
    }
}

async function userInfoMiddleware(req, res, next) {
    logger.debug(`in user info middleware`);
    let token = req.cookies.jwt;
    logger.debug(`token: ${token}`);
    if (!token) {
        req.user = null;
        return next();
    }

    let decodedToken = await validateJwt(token);

    logger.debug(`decoded token ${JSON.stringify(decodedToken)}`);

    if (!decodedToken) {
        res.clearCookie('jwt');
        return next();
    }

    let userId = decodedToken.userId;

    logger.debug(`got userId: ${userId}`)
    let { user } = await getUserById(userId);
    
    logger.debug(`got user ${JSON.stringify(user)}`)
    if (user != null) {
        req.user = user;
    } else {
        req.user = null;
        res.clearCookie('jwt');
    }

    return next();

}

module.exports = {
    tempUsernameMiddleware,
    userInfoMiddleware
}