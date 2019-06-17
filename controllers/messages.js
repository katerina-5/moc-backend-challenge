const pool = require('./../config/postgresql').pool;

module.exports = {
    message_create
}

async function message_create(request, response, next) {
    console.log('Message create');

    const { user_id, room_id, message } = request.body;
    const sent_date = Date(Date.now()).substring(0, 24);

    try {
        const result = await pool.query('insert into messages(sent_date, user_id, room_id, message) values($1, $2, $3, $4)',
            [sent_date, user_id, room_id, message]);

        let jsonResult = {
            result: "message successfully sent"
        }

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
