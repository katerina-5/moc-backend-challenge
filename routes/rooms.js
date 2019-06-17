const express = require('express');
const router = express.Router();
const controller = require('./../controllers/rooms');

router.get('/', controller.room_list);
router.get('/:id', controller.room_detail);
router.post('/', controller.room_create);
router.delete('/:id', controller.room_delete);

router.post('/:id/join', controller.join_room);
router.post('/:id/leave', controller.leave_room);

module.exports = router;