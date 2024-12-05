const express = require('express');
const { STATE_ENUMS } = require('util/enums');
const { getUserState, setUserState } = require('util/user_tools/user_states');
const { tempUsernameMiddleware } = require('util/middleware/user_info')
const logger = require('util/logger')({ name: 'api/users/users' });
const router = express.Router();

router.get('/', async (req, res) => {
    if (req.user)
        return res.status(200).end(JSON.stringify({username: req.user.username, email: req.user.email}));
    else
        return res.status(200).end(JSON.stringify({}));
})

module.exports = router;