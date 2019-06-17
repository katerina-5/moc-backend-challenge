const pool = require('./../config/postgresql').pool;

module.exports = {
    room_list,
    room_detail,
    room_create,
    room_delete,
    join_room,
    leave_room
}

function room_list(req, res, next) {
    console.log('List of rooms');
}

function room_detail(req, res, next) {
    console.log('Detail information about room');
}

function room_create(req, res, next) {
    console.log('Room create');
}

function room_delete(req, res, next) {
    console.log('Room delete');
}

function join_room(req, res, next) {
    console.log('User join room');
}

function leave_room(req, res, next) {
    console.log('User leave room');
}
