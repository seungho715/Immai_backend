const jwt = require('jsonwebtoken');
const { server_secret } = require('util/config');

async function genJwt(userId, expiresIn = '1d') {
    return jwt.sign({ userId }, server_secret, {
        expiresIn,
        algorithm: 'HS512'
    })
}

async function validateJwt(token) {
    try {
        return jwt.verify(token, server_secret, {
            algorithms: ['HS512']
        })
    } catch {
        return null;
    }
}

module.exports = {
    genJwt,
    validateJwt,
}