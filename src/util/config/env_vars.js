const vars = {
    pg_user: process.env.PG_USER,
    pg_host: process.env.PG_HOST,
    pg_db: process.env.PG_DB,
    pg_password: process.env.PG_PASSWORD, //Some kind of password
    pg_port: process.env.PG_PORT,
    server_secret: process.env.SERVER_SECRET,
    server_port: process.env.SERVER_PORT,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    log_level: process.env.LOG_LEVEL
}

module.exports = vars;