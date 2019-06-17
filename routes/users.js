const express = require('express');
const router = express.Router();
const controller = require('./../controllers/users');

router.get('/', controller.user_list);
router.get('/:id', controller.user_detail);

module.exports = router;