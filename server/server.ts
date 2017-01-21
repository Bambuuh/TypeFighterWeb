interface GameData {
    gameName: string;
    password: string;
}

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
import { CombatTextGenerator } from './combatTextGenerator';

const app = express();
const server = http.Server(app);
export const io: SocketIO.Server = socketIO(server);

const combatTextGenerator = new CombatTextGenerator();

const quickplayGames: {[key: string]: {active: boolean, players: number}} = {};

app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.use('/assets', express.static(path.join(__dirname, '/../../assets')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));

io.on('connection', (socket: SocketIO.Socket) => {
    socket.emit('total connected', Object.keys(io.sockets.sockets).length);

    socket.on('join', (gameData: GameData) => joinGame(socket, gameData));
    socket.on('create', (gameData: GameData) => createGame(socket, gameData));
    socket.on('quickplay', () => quickPlay(socket));
});

function quickPlay(socket) {
    console.log('quickplay');
    let joined = false;
    let roomName = '';
    for (roomName in quickplayGames) {
        const game = quickplayGames[roomName];
        if (!game.active && game.players < 2) {
            socket.join(roomName);
            game.active = true;
            game.players++;
            io.to(roomName).emit('match found');
            joined = true;
            break;
        }
    }

    if(!joined) {
        roomName = new Date().getTime() + Math.random().toString(36).substring(7);
        quickplayGames[roomName] = {active: false, players: 1};
        socket.join(roomName);
        socket.emit('waiting for player');
    }

    socket.on('disconnect', () => {
        const game = quickplayGames[roomName];
        game.players--;
        if(!game.active || game.players === 0) {
            delete quickplayGames[roomName];
        }
    })

}


function joinGame(socket, gameData: GameData) {
    console.log('joining')
    if (!io.sockets.adapter.rooms[gameData.gameName]) {
        console.log('room doesnt exist');
        socket.emit('room doesnt exist');
    } else if (io.sockets.adapter.rooms[gameData.gameName].length < 2) {
        console.log('joining ' + gameData.gameName);
        socket.join(gameData.gameName);
        io.to(gameData.gameName).emit('match found');
        io.to(gameData.gameName).on('disconnect', () => {
            io.to(gameData.gameName).emit('disconnect');
        })
    } else {
        console.log('room full');
        socket.emit('room full');
    }
}

function createGame(socket, gameData: GameData) {
    console.log(gameData)
    if (!io.sockets.adapter.rooms[gameData.gameName]) {
        console.log('creating room');
        socket.join(gameData.gameName);
        socket.emit('waiting for player');
    } else {
        console.log('room exists');
        socket.emit('room exists');
    }
}

// function update() {
// io.emit('update', {players: players, combatTexts: combatTextGenerator.getCombatTexts()});
// }

// setInterval(update.bind(this), 1000 / 30);

server.listen(8080);