const pool = require('./../config/postgresql').pool;

module.exports = {
    login
}

function login(req, res, next) {
    console.log('Registration for new users or login for existing ones');
}