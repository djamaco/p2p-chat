"use strict";

const _ = require('lodash');
const express = require('express');

const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);
const p2pServer = require('socket.io-p2p-server').Server;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
    res.render('index');
});

io.use(p2pServer);

const clients = {};

io.on('connection', socket => {
    console.log('socket ' + socket.id + ' has been connected');
    clients[socket.id] = socket;

    socket.emit('socket connected', {message: 'socket connected with id ' + socket.id});

    socket.on('p2p-message', data => {
        console.log(socket.id, JSON.stringify(data, null, 2));
        sendMessageToAll(data.message, socket.id);
    });

    socket.on('set all private', () => {
        _.forEach(clients, (socket, id) => {
            socket.emit('p2p-private');
            console.log(id + ' goes private connection');
        });
    });

    socket.on('disconnect', () => {
        delete clients[socket.id];
        console.log('socket ' + socket.id + ' has been disconnected');
    });
});

http.listen(8080, (err) => {
    if (err) {
        throw err;
    }
    console.log('server created');
});

function sendMessageToAll(message, id) {
    _.forEach(clients, (socket, socketId) => {
        if (socketId !== id) {
            socket.emit('p2p-message', message);
        }
    });
}