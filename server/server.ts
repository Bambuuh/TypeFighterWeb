interface GameData {
    gameName: string;
    password: string;
}

interface GameRoom {
    active: boolean;
    players: string[];
    combatTextGenerator: CombatTextGenerator;
    quickplay?: boolean;
    password?: string;
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

const games: {[gameID: string]: GameRoom} = {};

app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.use('/assets', express.static(path.join(__dirname, '/../../assets')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));

io.on('connection', (socket: SocketIO.Socket) => {
    socket.emit('total connected', Object.keys(io.sockets.sockets).length);

    socket.on('join', (gameData: GameData) => joinGame(socket, gameData));
    socket.on('create', (gameData: GameData) => {
        createGame(socket, gameData)
    });
    socket.on('quickplay', () => quickPlay(socket));
    socket.on('play solo', () => playSolo(socket))
    socket.on('kill all', () => killAll(socket));

    socket.on('disconnect', () => tryRemoveRooms(socket));
});

function joinGame(socket: SocketIO.Socket, gameData: GameData) {
    if (!io.sockets.adapter.rooms[gameData.gameName]) {
        socket.emit('room doesnt exist');
    } else if (io.sockets.adapter.rooms[gameData.gameName].length < 2) {
        if (games[gameData.gameName].password === gameData.password) {
            socket.join(gameData.gameName);
            io.to(gameData.gameName).emit('match found');
            io.to(gameData.gameName).on('disconnect', () => {
                io.to(gameData.gameName).emit('disconnect');
            })
        } else {
            socket.emit('wrong password');
        }
    } else {
        socket.emit('room full');
    }
}

function createGame(socket: SocketIO.Socket, gameData: GameData) {
    if (!io.sockets.adapter.rooms[gameData.gameName]) {
        games[gameData.gameName] = {
            players: [socket.id],
            active: false,
            combatTextGenerator: new CombatTextGenerator(),
            password: gameData.password,
        }
        socket.join(gameData.gameName);
        socket.emit('waiting for player');
    } else {
        socket.emit('room exists');
    }
}

function quickPlay(socket: SocketIO.Socket) {
    let joined = false;
    let id = '';
    for (id in games) {
        const game = games[id];
        if (!game.active && game.players.length < 2) {
            socket.join(id);
            game.active = true;
            game.players.push(socket.id);
            io.to(id).emit('match found');
            joined = true;
            break;
        }
    }

    if(!joined) {
        id = new Date().getTime() + Math.random().toString(36).substring(7);
        games[id] = {
            active: false,
            players: [socket.id],
            quickplay: true,
            combatTextGenerator: new CombatTextGenerator(),
        };
        socket.join(id);
        socket.emit('waiting for player');
    }
}

function playSolo(socket: SocketIO.Socket) {
    combatTextGenerator.getCombatTexts();
}

function killAll(socket: SocketIO.Socket) {
    socket.leaveAll();
    tryRemoveRooms(socket);
}

function tryRemoveRooms(socket: SocketIO.Socket) {
    for (const id in games) {
        const game = games[id];
        const index = game.players.indexOf(socket.id);
        if(index > -1) {
            game.players.splice(index, 1);
        }
        if (game.players.length === 0) {
            delete games[id];
        }
    }
}

function activePlayers() {
    io.emit('client count', io.engine.clientsCount);
}

// function update() {
// io.emit('update', {players: players, combatTexts: combatTextGenerator.getCombatTexts()});
// }

setInterval(activePlayers.bind(this), 1000);

server.listen(8080);