const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const players = {};
app.use(express.static('bin'));
app.use('/root', express.static(path.join(__dirname, '/../..')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));
io.on('connection', (client) => {
    players[client.id] = { combo: undefined };
    client.on('update', data => players[client.id].combo = data);
    client.on('disconnect', (data) => delete players[client.id]);
});
function update() {
    io.emit('update', players);
}
setInterval(update.bind(this), 1000 / 30);
server.listen(8080);
//# sourceMappingURL=server.js.map