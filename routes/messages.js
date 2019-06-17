const express = require('express');
const router = express.Router();
const controller = require('./../controllers/messages');

router.post('/message', controller.message_create);

module.exports = router;