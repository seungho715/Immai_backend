const { pool } = require('util/db');
const argon2 = require('argon2');
const { USER_ENUMS } = require('util/enums');


const logger = require('util/logger')({ name: 'util/user_tools/users' });

async function getUserByEmail(email) {
    try {
        const query = `SELECT * FROM user_data.users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        if (result.rows.length == 0) {
            logger.info(`user email ${email} not found`);
            return { user: null, status: USER_ENUMS.USER_NOT_FOUND };
        }
        const user = result.rows.at(0);
        logger.debug(user)
        return { user, status: USER_ENUMS.SUCCESS };
    } catch (err) {
        logger.error(err);
        return { user: null, status: USER_ENUMS.BACKEND_ERROR };
    }

}

async function getUserByUsername(username) {
    try {
        const query = `SELECT * FROM user_data.users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        if (result.rows.length == 0) {
            logger.info(`user username ${username} not found`);
            return { user: null, status: USER_ENUMS.USER_NOT_FOUND };
        }
        const user = result.rows.at(0);
        logger.debug(user)
        return { user, status: USER_ENUMS.SUCCESS };
    } catch (err) {
        logger.error(err);
        return { user: null, status: USER_ENUMS.BACKEND_ERROR };
    }

}

async function getUserById(userId) {
    try {
        const query = `SELECT * FROM user_data.users WHERE id = $1`;
        const result = await pool.query(query, [userId]);
        if (result.rows.length == 0) {
            logger.info(`user userId ${userId} not found`);
            return { user: null, status: USER_ENUMS.USER_NOT_FOUND };
        }
        const user = result.rows.at(0);
        logger.debug(user)
        return { user, status: USER_ENUMS.SUCCESS };
    } catch (err) {
        logger.info(err);
        return { user: null, status: USER_ENUMS.BACKEND_ERROR };

    }
}

async function verifyUserPassword(usernameOrEmail, password) {
    try {
        const query = 'SELECT * FROM user_data.users WHERE username = $1 OR email = $1';
        const values = [usernameOrEmail];
        const result = await pool.query(query, values);
        if (result.rows.length == 0) {
            logger.info(`user username or email ${usernameOrEmail} not found`);
            return { user: null, status: USER_ENUMS.USER_NOT_FOUND };
        }
        const user = result.rows.at(0);
        if (user.password === "ssoOnly") {
            logger.info("user registered with sso, ignoring");
            return { user: null, status: USER_ENUMS.SSO_ONLY };
        }
        const match = await argon2.verify(user.password, password);
        if (match) {
            return { user, status: USER_ENUMS.SUCCESS };
        } else {
            logger.info(`user ${usernameOrEmail} password incorrect`);
            return { user: null, status: USER_ENUMS.PASSWORD_INCORRECT };
        }
    } catch (err) {
        logger.error(err);
        return { user: null, status: USER_ENUMS.BACKEND_ERROR };
    }
}

async function registerUser(firstName, lastName, username, password, email) {
    try {
        let hashedAndSaltedPassword = password;
        if (password != null) {
            hashedAndSaltedPassword = await argon2.hash(password);
        } else {
            hashedAndSaltedPassword = "ssoOnly";
        }
        logger.info(`${firstName} ${lastName} ${username} ${hashedAndSaltedPassword} ${email}`);
        const query = 'INSERT INTO user_data.users (id, first_name, last_name, username, password, email) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *';
        const values = [firstName, lastName, username, hashedAndSaltedPassword, email]
        const result = await pool.query(query, values);
        logger.info(`User ${username} created successfully`);
        return { user: result.rows.at(0), status: USER_ENUMS.SUCCESS };
    } catch (err) {
        logger.error(err);
        return { user: null, status: USER_ENUMS.BACKEND_ERROR };

    }
}


module.exports = {
    getUserByEmail,
    getUserByUsername,
    getUserById,
    verifyUserPassword,
    registerUser,
}