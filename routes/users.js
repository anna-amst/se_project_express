const router = require("express").Router();
const { getUser, getCurrentUser, updateUser } = require("../controllers/users");

router.get('/:userId', getUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser);

module.exports = router;