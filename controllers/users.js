const pool = require('./../config/postgresql').pool;

module.exports = {
    user_list,
    user_detail
}

function user_list(req, res, next) {
    console.log('List of users');
}

function user_detail(req, res, next) {
    console.log('Detail information about user');
}
