const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

import { GameHandler, GameData } from './gameHandler';

const app = express();
const server = http.Server(app);
export const io: SocketIO.Server = socketIO(server);

const gameHandler = new GameHandler(io);

app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.use('/assets', express.static(path.join(__dirname, '/../../assets')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));

io.on('connection', (socket: SocketIO.Socket) => {
    socket.emit('client count', io.engine.clientsCount);

    socket.on('join multiplayer', (gameData: GameData) => gameHandler.joinNormalGame(socket, gameData));
    socket.on('create multiplayer', (gameData: GameData) => gameHandler.createCustomGame(socket, gameData));
    socket.on('quickplay', () => gameHandler.joinQuickplay(socket));
    socket.on('create solo game', () => gameHandler.playSolo(socket))
    socket.on('leaveAllGames', () => gameHandler.leaveAndRemoveGames(socket));
    socket.on('disconnect', () => gameHandler.leaveAndRemoveGames(socket));
});

function activePlayers() {
    io.emit('client count', io.engine.clientsCount);
}
setInterval(activePlayers.bind(this), 3000);

server.listen(8080);
