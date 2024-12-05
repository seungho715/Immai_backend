const { Pool } = require('pg');
const config = require('util/config');

// const pool = new Pool({
//     user: 'postgres',
//     host: 'yellowtail.tplinkdns.com',
//     database: 'immai',
//     password: 'jerfy_truenas_db', //Some kind of password
//     port: '9543',
//   });

const pool = new Pool({
  user: config.pg_user,
  host: config.pg_host,
  database: config.pg_db,
  password: config.pg_password, //Some kind of password
  port: config.pg_port,
});

module.exports = pool;