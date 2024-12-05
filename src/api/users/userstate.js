const express = require('express');
const { STATE_ENUMS } = require('util/enums');
const { getUserState, setUserState } = require('util/user_tools/user_states');
const { tempUsernameMiddleware } = require('util/middleware/user_info')
const logger = require('util/logger')({ name: 'api/users/userstate' });
const router = express.Router();

// This, with the username path param, should be for admins
// There should be an endpoint with a user login middleware that automatically gets the logged in user's stuff (not just all the params at once either, could be multiple functions)
router.get('/:username/states', tempUsernameMiddleware, async (req, res) => {
  const { states, status } = await getUserState(req.params.uid);

  if (states)
    return res.status(200).json(states).end();
  else
    return res.status(500).json({ status: 500, message: 'Error retrieving data from the database: ' + err.message });

})

router.post('/:username/states', tempUsernameMiddleware, async (req, res) => {

  const uid = req.params.uid;
  const result = [];
  for (let elem of req.body.body) {
    logger.debug(elem);
    const { states, status } = await setUserState(uid, elem.name, elem.value);
    result.push(status === STATE_ENUMS.SUCCESS);
  }
  if (result.reduce((a,b) => a+b, 0) === req.body.body.length)
    return res.json(result);
  else
    return res.status(500).json({ message: 'Error retrieving data from the database: ' + err.message }).end();
})

module.exports = router;