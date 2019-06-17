const pool = require('./../config/postgresql').pool;

module.exports = {
    message_create
}

function message_create(req, res, next) {
    console.log('Message create');
}
