require('dotenv').config();
const express = require('express');
const app = express();
const WebSocketServer = require('ws');
const TelegramBot = require('node-telegram-bot-api');

require('./middleware')(app);
require('./routes')(app);
require('./config/postgresql');

/** WebSocket */

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

/** TelegramBot */

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Welcome to the Awesome Bot!');
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    let resp = `/start - start work with bot
/help - list of all commands
/echo - return your message
`;

    bot.sendMessage(chatId, resp);
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    console.log('Message: ' + match[1]);
    console.log(match[0]);

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg, match) => {
    console.log('New message for bot!');

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text;

    // console.log(messageText);

    if (checkGreeting(messageText)) {
        bot.sendMessage(chatId, 'Hi! Nice to meet you :)');
    } else if (checkSmile(messageText)) {
        bot.sendMessage(chatId, 'Ha-ha, you are so funny :D');
    } else if (messageText.toLowerCase().includes('how are you')) {
        bot.sendMessage(chatId, 'I\'m fine. And what about you? :)');
    } else if (messageText.toLowerCase().includes('who are you')) {
        bot.sendMessage(chatId, 'I\'m the most awesome bot, you have ever seen :)');
    } else if (checkGoodbye(messageText)) {
        bot.sendMessage(chatId, 'I hope to see you soon :)');
    } else if (checkGoodNews(messageText)) {
        bot.sendMessage(chatId, 'It\'s good :)');
    } else if (checkBadNews(messageText)) {
        bot.sendMessage(chatId, 'It\'s bad :(');
    } else {
        // bot.sendMessage(chatId, 'Sorry, I don\'t understand you...');
        bot.sendMessage(chatId, 'Hm...');
    }

    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, messageText);
});

function checkGreeting(text) {
    text = text.toLowerCase();
    if (text.includes('hi') || text.includes('hello') || text.includes('helo') || text.includes('aloha') || text.includes('hey')) {
        return true;
    }
    return false;
}

function checkSmile(text) {
    text = text.toLowerCase();
    if (text.includes('smile') || text.includes('ha-ha') || text.includes('ahah')) {
        return true;
    }
    return false;
}

function checkGoodNews(text) {
    text = text.toLowerCase();
    if (text.includes('good') || text.includes('fine') || text.includes('cool')) {
        return true;
    }
    return false;
}

function checkBadNews(text) {
    text = text.toLowerCase();
    if (text.includes('bad')) {
        return true;
    }
    return false;
}

function checkGoodbye(text) {
    text = text.toLowerCase();
    if (text.includes('goodbye') || text.includes('bye') || text.includes('see you')) {
        return true;
    }
    return false;
}

/** Error handlers */

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
