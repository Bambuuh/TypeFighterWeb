const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const ct = require('./combatTextGenerator');


const app = express();
const server = http.Server(app);
const io = socketIO(server);

const combatTextGenerator = new ct.CombatTextGenerator();
const players = {};
const clients = {};
combatTextGenerator.getCombatTexts();

let highestIndex = 0;

app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));
app.get('/game', (req, res) => res.sendFile(path.join(__dirname + '/../../game.html')));


io.on('connection', (client) => {
    clients[client.id] = client;
    players[client.id] = {
        index: 0,
    };
    client.emit('init', combatTextGenerator.getCombatTexts());
    client.on('update', data => {
        players[client.id].index = data.index
        if (data.index > highestIndex) {
            highestIndex++;
            combatTextGenerator.addCombatText();
        }
    });
    client.on('disconnect', (data) => delete players[client.id]);
})

function update() {
    io.emit('update', {players: players, combatTexts: combatTextGenerator.getCombatTexts()});
}

setInterval(update.bind(this), 1000 / 30);

server.listen(8070);