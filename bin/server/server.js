const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const ct = require('./combatTextGenerator');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const combatTextGenerator = new ct.CombatTextGenerator();
app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));
io.on('connection', (socket) => {
    const action = socket.handshake.query.action;
    const channel = socket.handshake.query.channel;
    const password = socket.handshake.query.password;
    console.log(action);
    if (action === 'create') {
        if (!io.sockets.adapter.rooms[channel]) {
            console.log('creating room');
            socket.join(channel);
        }
        else {
            console.log('room exists');
            socket.emit('room exists');
        }
    }
    if (action === 'join') {
        if (!io.sockets.adapter.rooms[channel]) {
            console.log('room doesnt exist');
            socket.emit('room doesnt exist');
        }
        else if (io.sockets.adapter.rooms[channel].length < 2) {
            console.log('joining channel');
            socket.join(channel);
            io.to(channel).emit('joined', 'someone joined');
            io.to(channel).on('disconnect', () => {
                io.to(channel).emit('disconnect');
            });
        }
        else {
            console.log('room full');
            socket.emit('room full');
        }
    }
});
function update() {
    // io.emit('update', {players: players, combatTexts: combatTextGenerator.getCombatTexts()});
}
// setInterval(update.bind(this), 1000 / 30);
server.listen(8070);
