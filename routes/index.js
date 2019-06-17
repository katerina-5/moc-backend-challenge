const homepage = require('./homepage');
const auth = require('./auth');
const users = require('./users');
const rooms = require('./rooms');
const messages = require('./messages');

module.exports = function (app) {
    app.use('/', homepage);
    app.use('/', auth);
    app.use('/users', users);
    app.use('/rooms', rooms);
    app.use('/', messages);
}