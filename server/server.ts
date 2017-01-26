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

gameHandler.setupEventListner();

server.listen(8080);
