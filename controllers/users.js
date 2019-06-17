const pool = require('./../config/postgresql').pool;

module.exports = {
    user_list,
    user_detail
}

async function user_list(request, response, next) {
    console.log('List of users');

    try {
        const result = await pool.query('select user_id, user_name from users');

        response.status(200).json(result.rows);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

async function user_detail(request, response, next) {
    console.log('Detail information about user');

    const user_id = request.params.id;

    try {
        const result = await pool.query('select user_id, user_name from users where user_id = $1', [user_id]);

        response.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}
