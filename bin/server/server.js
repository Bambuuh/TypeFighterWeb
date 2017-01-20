"use strict";
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const combatTextGenerator_1 = require("./combatTextGenerator");
const app = express();
const server = http.Server(app);
exports.io = socketIO(server);
const combatTextGenerator = new combatTextGenerator_1.CombatTextGenerator();
app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));
exports.io.on('connection', (socket) => {
    console.log('connected');
    socket.on('join', (data) => {
        console.log('joining');
        if (!exports.io.sockets.adapter.rooms[data.gameName]) {
            console.log('room doesnt exist');
            socket.emit('room doesnt exist');
        }
        else if (exports.io.sockets.adapter.rooms[data.gameName].length < 2) {
            console.log('joining ' + data.gameName);
            socket.join(data.gameName);
            exports.io.to(data.gameName).emit('joined', 'someone joined');
            exports.io.to(data.gameName).on('disconnect', () => {
                exports.io.to(data.gameName).emit('disconnect');
            });
        }
        else {
            console.log('room full');
            socket.emit('room full');
        }
    });
    socket.on('create', (data) => {
        console.log(data);
        if (!exports.io.sockets.adapter.rooms[data.gameName]) {
            console.log('creating room');
            socket.join(data.gameName);
        }
        else {
            console.log('room exists');
            socket.emit('room exists');
        }
    });
});
function update() {
    // io.emit('update', {players: players, combatTexts: combatTextGenerator.getCombatTexts()});
}
// setInterval(update.bind(this), 1000 / 30);
server.listen(8080);
