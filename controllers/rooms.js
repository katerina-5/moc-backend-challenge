const asyncLib = require('../libs/async');
const pool = require('./../config/postgresql').pool;

module.exports = {
    room_list,
    room_detail,
    room_create,
    room_delete,
    join_room,
    leave_room
}

async function room_list(request, response, next) {
    console.log('List of rooms');

    try {
        let jsonResult = [];

        const getRooms = await pool.query('select * from rooms');

        await asyncLib.asyncForEach(getRooms.rows, async (room) => {
            let jsonRoom = {
                room_id: room.room_id,
                room_name: room.room_name,
                creator_id: room.creator_id,
                created_at: room.created_at,
                users: []
            }

            const getUsers = await pool.query('select user_id, user_name from users inner join RoomHasUsers using(user_id) where room_id = $1',
                [room.room_id]);
            await asyncLib.asyncForEach(getUsers.rows, async (user) => {
                jsonRoom.users.push(user);
            });

            jsonResult.push(jsonRoom);
        });

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

async function room_detail(request, response, next) {
    console.log('Detail information about room');

    const room_id = request.params.id;

    try {

        const getRoom = await pool.query('select * from rooms where room_id = $1',
            [room_id]);

        let jsonResult = {
            room_id: getRoom.rows[0].room_id,
            room_name: getRoom.rows[0].room_name,
            creator_id: getRoom.rows[0].creator_id,
            created_at: getRoom.rows[0].created_at,
            users: []
        };

        const getUsers = await pool.query('select user_id, user_name from users inner join RoomHasUsers using(user_id) where room_id = $1',
            [room_id]);
        await asyncLib.asyncForEach(getUsers.rows, async (user) => {
            jsonResult.users.push(user);
        });

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

async function room_create(request, response, next) {
    console.log('Room create');

    const room_name = request.body.room_name;
    const creator_id = request.body.creator_id;

    const created_at = Date(Date.now()).substring(0, 24);
    console.log(created_at);

    try {
        const createRoom = await pool.query('insert into rooms(room_name, creator_id, created_at) values($1, $2, $3)',
            [room_name, creator_id, created_at]);

        const result = await pool.query('select * from rooms where room_name = $1 and creator_id = $2 and created_at = $3',
            [room_name, creator_id, created_at]);

        const addCreatorToRoomUsers = await pool.query('insert into RoomHasUsers(room_id, user_id) values($1, $2)',
            [result.rows[0].room_id, creator_id]);

        response.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

async function room_delete(request, response, next) {
    console.log('Room delete');

    const room_id = request.params.id;

    try {
        const checkUsers = await pool.query('select * from RoomHasUsers where room_id = $1', [room_id]);
        if (checkUsers.rowCount !== 0) {
            const deleteUsersFromRoom = await pool.query('delete from RoomHasUsers where room_id = $1', [room_id])
        }
        const result = await pool.query('delete from rooms where room_id = $1', [room_id]);

        let jsonResult = {
            result: "room removed successfully"
        }

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

async function join_room(request, response, next) {
    console.log('User join room');

    const { user_id, room_id } = request.body;

    try {
        const result = await pool.query('insert into RoomHasUsers(user_id, room_id) values($1, $2)',
            [user_id, room_id]);

        let jsonResult = {
            result: "user successfully joined the room"
        }

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

async function leave_room(request, response, next) {
    console.log('User leave room');

    const { user_id, room_id } = request.body;

    try {
        const result = await pool.query('delete from RoomHasUsers where user_id = $1 and room_id = $2',
            [user_id, room_id]);

        let jsonResult = {
            result: "user successfully left the room"
        }

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}
