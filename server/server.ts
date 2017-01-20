const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
import { CombatTextGenerator } from './combatTextGenerator';


const app = express();
const server = http.Server(app);
export const io: SocketIO.Server = socketIO(server);

const combatTextGenerator = new CombatTextGenerator();

app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('connected');
    socket.on('join', (data: { gameName: string, password: string }) => {
        console.log('joining')
        if (!io.sockets.adapter.rooms[data.gameName]) {
            console.log('room doesnt exist');
            socket.emit('room doesnt exist');
        } else if (io.sockets.adapter.rooms[data.gameName].length < 2) {
            console.log('joining ' + data.gameName);
            socket.join(data.gameName);
            io.to(data.gameName).emit('joined', 'someone joined');
            io.to(data.gameName).on('disconnect', () => {
                io.to(data.gameName).emit('disconnect');
            })
        } else {
            console.log('room full');
            socket.emit('room full');
        }
    })

    socket.on('create', (data: { gameName: string, password: string }) => {
        console.log(data)
        if (!io.sockets.adapter.rooms[data.gameName]) {
            console.log('creating room');
            socket.join(data.gameName);
        } else {
            console.log('room exists');
            socket.emit('room exists');
        }
    })
});



function update() {
    // io.emit('update', {players: players, combatTexts: combatTextGenerator.getCombatTexts()});
}

// setInterval(update.bind(this), 1000 / 30);

server.listen(8080);