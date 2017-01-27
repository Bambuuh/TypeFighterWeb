const socketIO = require('socket.io');
const clientSocket = require('socket.io-client')

import { GameHandler, GameData } from './../server/gameHandler';

let app;
let server;
let io: any;
let handler: GameHandler;

const baseUrl = 'http://localhost:8080';

let clients = [];

describe("Server", () => {

	describe('joining custom game', () => {

		beforeEach(done => {
			io = socketIO.listen(8080);
			handler = new GameHandler(io);
			handler.setupEventListner();
			done();
		});

		afterEach(done => {
			io.close();
			done();
		});

		it('non-existing game', done => {
			const client = getNewClient();
			client.once('room doesnt exist', () => {
				expect(getGameCount(handler)).toBe(0);
				clearClients();
				done();
			});
			client.emit('join multiplayer', { gameID: 'test', password: 'test' });
		});

		it('existing game valid data', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			const gameData = { gameID: 'test', password: 'test' };
			client2.once('match found', () => {
				const game = getGameFromKey(handler, 'test');
				expect(getGameCount(handler)).toBe(1);
				expect(game.sockets.length).toBe(2);
				expect(game.active).toBe(true);
				clearClients();
				done();
			});
			client.once('waiting for player', () => client2.emit('join multiplayer', gameData));
			client.emit('create multiplayer', gameData);
		});

		it('existing game wrong password', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			const gameData = { gameID: 'test', password: 'test' };
			client2.once('wrong password', () => {
				const game = getGameFromKey(handler, 'test');
				expect(getGameCount(handler)).toBe(1);
				expect(game.sockets.length).toBe(1);
				expect(game.active).toBe(false);
				clearClients();
				done();
			});
			client.once('waiting for player', () => client2.emit('join multiplayer', { gameID: 'test', password: 'wrong'}));
			client.emit('create multiplayer', gameData);
		});

		it('existing game wrong gameID', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			const gameData = { gameID: 'test', password: 'test' };
			client2.once('room doesnt exist', () => {
				const game = getGameFromKey(handler, 'test');
				expect(getGameCount(handler)).toBe(1);
				expect(game.sockets.length).toBe(1);
				expect(game.active).toBe(false);
				clearClients();
				done();
			});
			client.once('waiting for player', () => client2.emit('join multiplayer', { gameID: 'test123', password: 'wrong'}));
			client.emit('create multiplayer', gameData);
		});

		it('full room', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			const client3 = getNewClient();
			const gameData = { gameID: 'test', password: 'test' };
			client3.once('room full', () => {
				const game = getGameFromKey(handler, 'test');
				expect(getGameCount(handler)).toBe(1);
				expect(game.sockets.length).toBe(2);
				expect(game.active).toBe(true);
				expect(game.players[client.id]).not.toBe(undefined);
				expect(game.players[client2.id]).not.toBe(undefined);
				expect(game.players[client3.id]).toBe(undefined);
				clearClients();
				done();
			});
			client2.once('match found', () => client3.emit().emit('join multiplayer', { gameID: 'test', password: 'test'}));
			client.once('waiting for player', () => client2.emit('join multiplayer', { gameID: 'test', password: 'test'}));
			client.emit('create multiplayer', gameData);
		});

		it('leaving game', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			const gameData = { gameID: 'test', password: 'test' };
			client.once('finalStats', data => {
				const game = getGameFromIndex(handler, 0);
				expect(getGameCount(handler)).toBe(1)
				expect(game.loopInterval).toBe(undefined);
				expect(game.sockets.length).toBe(1);
				expect(game.leaver).toBe(true);
				expect(Object.keys(data.playerStats).length).toBe(2);
				clearClients();
				done();
			});
			client2.once('match found', () => client2.emit('leaveAllGames'));
			client.once('waiting for player', () => client2.emit('join multiplayer', { gameID: 'test', password: 'test'}));
			client.emit('create multiplayer', gameData);
		});

		it('cleanup on both leave', done => {
			const client = getNewClient()
			const client2 = getNewClient();
			const gameData = { gameID: 'test', password: 'test' };
			client.once('cleanupDone', () => {
				expect(getGameCount(handler)).toBe(0);
				clearClients();
				done();
			})
			client.once('finalStats', data => client.emit('leaveAllGames'))
			client2.once('match found', () => client2.emit('leaveAllGames'));
			client.once('waiting for player', () => client2.emit('join multiplayer', { gameID: 'test', password: 'test'}));
			client.emit('create multiplayer', gameData);
		});
	});

	describe('quickplay', () => {

		beforeEach(done => {
			io = socketIO.listen(8080);
			handler = new GameHandler(io);
			handler.setupEventListner();
			done();
		});

		afterEach(done => {
			io.close();
			done();
		});

		it('joining with no game active', done => {
			const client = getNewClient();
			client.once('waiting for player', () => {
				expect(getGameCount(handler)).toBe(1);
				clearClients();
				done();
			});
			client.emit('quickplay', { gameID: 'test', password: 'test' });
		});

		it('joining with game active', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			client2.once('match found', () => {
				const game = getGameFromIndex(handler, 0);
				const amountOfSockets = game.sockets.length;
				expect(getGameCount(handler)).toBe(1);
				expect(amountOfSockets).toBe(2);
				expect(game.active).toBe(true);
				clearClients();
				done();
			})				
			client.once('waiting for player', () => client2.emit('quickplay'));
			client.emit('quickplay', { gameID: 'test', password: 'test' });
		});

		it('joining with another game active', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			const client3 = getNewClient();
			client3.once('waiting for player', () => {
				const game = getGameFromIndex(handler, 1);
				const amountOfSockets = game.sockets.length;
				expect(getGameCount(handler)).toBe(2);
				expect(amountOfSockets).toBe(1);
				expect(game.active).toBe(false);
				clearClients();
				done();
			});
			client2.once('match found', () => {
				client3.emit('quickplay');
			});				
			client.once('waiting for player', () => {
				client2.emit('quickplay');
			});
			client.emit('quickplay', { gameID: 'test', password: 'test' });
		});
	})

	describe('client connection', () => {

		beforeEach(done => {
			io = socketIO.listen(8080);
			handler = new GameHandler(io);
			handler.setupEventListner();
			done();
		});

		afterEach(done => {
			io.close();
			done();
		});

		it('client count amitted', done => {
			const client = getNewClient();
			const client2 = getNewClient();
			client2.once('client count', data => {
				expect(data).toBe(2);
				clearClients();
				done();				
			})
			client.once('client count', data => client2.emit('connection'));
			client.emit('connection');
		});
	});

	function getGameCount(gameHandler) {
		return Object.keys(gameHandler.getGames()).length
	}

	function clearClients() {
		clients.forEach(client => client.disconnect(true));
		clients = [];
	} 

	function getGameFromKey(gameHandler: GameHandler, id: string) {
		return gameHandler.getGames()[id];
	}

	function getGameFromIndex(gameHandler: GameHandler, index: number) {
		const keys = Object.keys(gameHandler.getGames())
		return getGameFromKey(gameHandler, keys[index]);
	}

	function getNewClient() {
		const newClient = clientSocket.connect(baseUrl, {
				'reconnection delay': 0
				, 'reopen delay': 0
				, 'force new connection': true
			});
		clients.push(newClient);
		return newClient;
	}

	function getMockSocket() {
		return {
			id: 'mock',
			emit() { },
			join() { },
		}
	}
});