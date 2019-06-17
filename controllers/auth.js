const authLib = require('../libs/auth');
const pool = require('./../config/postgresql').pool;

module.exports = {
    login
}

async function login(request, response, next) {
    console.log('Registration for new users or login for existing ones');

    const { user_name, password } = request.body;

    let hashPassword = await authLib.hashPassword(password, next);

    const token = authLib.createJWToken({
        user_name: user_name,
        password: hashPassword
    });

    // compare created token and credentials from database

    try {
        let user_id;
        // check token (credentials) in database
        const checkUserName = await pool.query('select * from users where credentials = $1', [token]);
        if (checkUserName.rowCount === 0) {
            // registration
            const createUser = await pool.query('insert into users(user_name, password, credentials) values($1, $2, $3)',
                [user_name, hashPassword, token]);
            const getUserId = await pool.query('select user_id from users where credentials = $1', [token]);

            user_id = getUserId.rows[0].user_id;
            credentials = token;
        } else {
            // authorization
            user_id = checkUserName.rows[0].user_id;
            user_name = checkUserName.rows[0].user_name;
            credentials = checkUserName.rows[0].credentials;
        }

        let jsonResult = {
            user_id: user_id,
            user_name: user_name,
            credentials: credentials
        }

        response.status(200).json(jsonResult);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
