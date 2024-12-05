const pool = require('util/db/pgpool');
const { STATE_ENUMS } = require('util/enums');

const logger = require('util/logger')({ name: 'util/user_tools/user_states' });

async function getUserState(userId) {
    try {
        const query = `SELECT t3.name, t2.value, t3.max_value
                        from user_data.users t1
                          right join user_data.user_state t2
                            on t1.id = t2.user_id
                          join user_data.user_state_info t3
                            on t2.state_id = t3.id
                        where t1.id = $1`;
        const result = await pool.query(query, [userId]);
        return { states: result.rows, status: STATE_ENUMS.SUCCESS };
    } catch (err) {
        logger.error(err);
        return { states: null, status: STATE_ENUMS.BACKEND_ERROR };
    }
}

async function setUserState(userId, stateKey, stateValue) {
    try {
        const query = `
      update user_data.user_state as us
      set value = $1
      from (select id from user_data.user_state_info as t where t.name = $2) as t
      where us.userId = $3 and us.state_id = t.id RETURNING *;
      `;
        const queryResult = await pool.query(query, [stateValue, stateKey, userId]);
        logger.debug(queryResult);
        return { states: queryResult, status: STATE_ENUMS.SUCCESS };
    } catch (err) {
        logger.error(err);
        return { states: { stateKey, StateValue }, status: STATE_ENUMS.BACKEND_ERROR };
    }
}

module.exports = {
    getUserState,
    setUserState
}