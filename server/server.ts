interface GameData {
    gameName: string;
    password: string;
}

interface PlayerData {
    index: number;
    completedCharacters: number;
}

interface Game {
    active: boolean;
    players: { [id: string]: PlayerData };
    combatTextGenerator: CombatTextGenerator;
    loopInterval: any,
    highestIndex: number;
    quickplay?: boolean;
    password?: string;
    solo?: boolean,
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

const games: { [gameID: string]: Game } = {};

app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.use('/assets', express.static(path.join(__dirname, '/../../assets')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));

io.on('connection', (socket: SocketIO.Socket) => {
    socket.emit('client count', io.engine.clientsCount);

    socket.on('join multiplayer', (gameData: GameData) => joinGame(socket, gameData));
    socket.on('create multiplayer', (gameData: GameData) => createGame(socket, gameData));
    socket.on('quickplay', () => quickPlay(socket));
    socket.on('create solo game', () => playSolo(socket))
    socket.on('kill all', () => killAll(socket));

    socket.on('disconnect', () => tryRemoveRooms(socket));
});

function joinGame(socket: SocketIO.Socket, gameData: GameData) {
    const game = games[gameData.gameName]
    if (!game || game.solo) {
        socket.emit('room doesnt exist');
    } else if (Object.keys(game.players).length < 2) {
        if (game.password === gameData.password) {
            socket.join(gameData.gameName);
            io.to(gameData.gameName).emit('match found');
            io.to(gameData.gameName).on('disconnect', () => {
                io.to(gameData.gameName).emit('disconnect');
            })
            console.log('joining');
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
            players: { [socket.id]: { index: 0, completedCharacters: 0 } },
            highestIndex: 0,
            active: false,
            combatTextGenerator: new CombatTextGenerator(),
            password: gameData.password,
            loopInterval: undefined,
        }
        socket.join(gameData.gameName);
        socket.emit('waiting for player');
        console.log('creating')
    } else {
        socket.emit('room exists');
    }
}

function quickPlay(socket: SocketIO.Socket) {
    let joined = false;
    let id = '';
    for (id in games) {
        const game = games[id];
        if (!!game && !game.active && Object.keys(game.players).length < 2) {
            console.log('joining');
            socket.join(id);
            game.active = true;
            game.players[socket.id] = { index: 0, completedCharacters: 0 };
            io.to(id).emit('match found');
            joined = true;
            break;
        }
    }

    if (!joined) {
        console.log('creating');
        id = new Date().getTime() + Math.random().toString(36).substring(7);
        games[id] = {
            players: { [socket.id]: { index: 0, completedCharacters: 0 } },
            highestIndex: 0,
            active: false,
            quickplay: true,
            combatTextGenerator: new CombatTextGenerator(),
            loopInterval: undefined,
        };
        socket.join(id);
        socket.emit('waiting for player');
    }
}

function playSolo(socket: SocketIO.Socket) {
    const tickRate = 100/30;
    games[socket.id] = {
        players: { [socket.id]: { index: 0, completedCharacters: 0 } },
        highestIndex: 0,
        active: true,
        combatTextGenerator: new CombatTextGenerator(),
        loopInterval: setInterval((activePlayers) => {
            if (!!games[socket.id]) {
                socket.emit('solo update', games[socket.id].combatTextGenerator.getActiveCombos());
            }
        }, tickRate),
    };

    socket.emit('init solo', games[socket.id].combatTextGenerator.getActiveCombos());

    socket.on('solo update', (playerData: PlayerData) => {
        const game = games[socket.id];
        const player = game.players[socket.id];
        player.index = playerData.index;
        if(player.index > game.highestIndex) {
            console.log('adding');
            game.highestIndex = player.index;
            game.combatTextGenerator.addCombatText();
        }
        player.completedCharacters = playerData.completedCharacters;
    });

    socket.on('stop solo', () => {
        socket.removeAllListeners('solo update');
        socket.leave(socket.id);
    });
}

function killAll(socket: SocketIO.Socket) {
    socket.leaveAll();
    tryRemoveRooms(socket);
}

function tryRemoveRooms(socket: SocketIO.Socket) {
    for (const id in games) {
        const game = games[id];
        const player = game.players[socket.id];
        if (typeof player !== 'undefined') {
            delete game.players[socket.id];
        }
        if (Object.keys(game.players).length === 0) {
            clearInterval(games[id].loopInterval);
            delete games[id];
        }
    }
}

function activePlayers() {
    io.emit('client count', io.engine.clientsCount);
}

setInterval(activePlayers.bind(this), 3000);

server.listen(8080);
