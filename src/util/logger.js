const pino = require('pino');
const config = require('util/config');

function logger(opts) {
    return pino({
        level: config.log_level || 'info',
        ...opts
    });
}

module.exports = logger