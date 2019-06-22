require('dotenv').config();
const express = require('express');
const app = express();
const WebSocketServer = require('ws');

require('./middleware')(app);
require('./routes')(app);
require('./config/postgresql');

let clients = {};

const webSocketPort = process.env.WEB_SOCKET_PORT;
const webSocketServer = new WebSocketServer.Server({
    port: webSocketPort, path: `localhost:${webSocketPort}/message`
});

webSocketServer.on('connection', function (ws) {
    let id = Math.random();
    clients[id] = ws;
    console.log("New connection - " + id);

    ws.on('message', function (user_id, room_id, message) {
        console.log('New message: ' + message);

        let sentResult = {
            user_id: user_id,
            room_id: room_id,
            message: message
        }

        for (let key in clients) {
            clients[key].send(sentResult);
        }
    });

    ws.on('close', function () {
        console.log('Connection was closed - ' + id);
        delete clients[id];
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({ error: err.message });
});

module.exports = app;
