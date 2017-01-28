import { CombatTextGenerator } from './combatTextGenerator';

export interface GameData {
    gameID: string;
    password: string;
}

interface PlayerData {
    index: number;
    completedCharacters: number;
    cpm: number;
}

interface Game {
    active: boolean;
    players: { [id: string]: PlayerData };
    combatTextGenerator: CombatTextGenerator;
    loopInterval: any,
    highestIndex: number;
    timer: Date;
    sockets: SocketIO.Socket[];
    leaver?: boolean;
    quickplay?: boolean;
    password?: string;
    solo?: boolean,
}

export class GameHandler {

    private games: { [gameID: string]: Game } = {};
    // private playerGameMap: { [id: string]: { [id: string]: string } } = {};
    private tickRate = 1000 / 30;

    private combatTextGenerator = new CombatTextGenerator();

    constructor(private io: SocketIO.Server) {
        setInterval(this.emitPlayerCount.bind(this), 3000);
    }

    public getGames() {
        return this.games;
    }

    private emitPlayerCount() {
        this.io.emit('client count', this.io.engine.clientsCount);
    }

    public setupEventListner() {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.emit('client count', this.io.engine.clientsCount);

            socket.on('join multiplayer', (gameData: GameData) => this.joinNormalGame(socket, gameData));
            socket.on('create multiplayer', (gameData: GameData) => this.createCustomGame(socket, gameData));
            socket.on('quickplay', () => this.joinQuickplay(socket));
            socket.on('create solo game', () => this.playSolo(socket))
            socket.on('leaveAllGames', () => this.leaveAndRemoveGames(socket));
            socket.on('disconnect', () => this.leaveAndRemoveGames(socket));
        });
    }

    public joinNormalGame(socket: SocketIO.Socket, gameData: GameData) {
        const game = this.games[gameData.gameID]
        if (!game || game.solo) {
            socket.emit('room doesnt exist');
        } else if (Object.keys(game.players).length < 2) {
            if (game.password === gameData.password) {
                this.joinGame(socket, gameData.gameID);
                this.startMultiplayerGame(gameData.gameID);
            } else {
                socket.emit('wrong password');
            }
        } else {
            socket.emit('room full');
        }
    }

    public createCustomGame(socket: SocketIO.Socket, gameData: GameData) {
        if (!this.io.sockets.adapter.rooms[gameData.gameID]) {
            this.createGame(socket, gameData);
        } else {
            socket.emit('room exists');
        }
    }

    public joinQuickplay(socket: SocketIO.Socket) {
        let joined = false;
        let id = '';
        for (id in this.games) {
            const game = this.games[id];
            if (!!game && !game.active && Object.keys(game.players).length < 2) {
                this.joinGame(socket, id)
                socket.adapter.rooms
                this.startMultiplayerGame(id);
                joined = true;
                break;
            }
        }

        // No game found, creating game
        if (!joined) {
            const gameData = {
                gameID: new Date().getTime() + Math.random().toString(36).substring(7),
                password: undefined,
            }
            this.createGame(socket, gameData, true);
        }
    }

    public playSolo(socket: SocketIO.Socket) {
        const id = socket.id + new Date().getTime();
        socket.join(id);
        this.games[id] = this.getGameObj(socket);
        const game = this.games[id];
        game.active = true;
        game.solo = true;
        game.timer = new Date();
        game.loopInterval = this.getUpdateLoop(game, id);

        socket.emit('init solo', this.getInitObj(id));
        socket.on('update', (playerData: PlayerData) => this.updateGameData(id, playerData, socket));
        socket.on('stop', () => this.stopGameLoop(game));
    }

    public startMultiplayerGame(gameID: string) {
        const game = this.games[gameID];
        game.active = true;
        game.timer = new Date();
        game.loopInterval = this.getUpdateLoop(game, gameID);

        this.io.to(gameID).emit('initNormal', this.getInitObj(gameID));

        game.sockets.forEach(socket => {
            socket.on('update', (playerData: PlayerData) => this.updateGameData(gameID, playerData, socket));
            socket.on('gameEnd', () => this.endGame(gameID));
        });
    }

    private getUpdateLoop(game: Game, gameID: string) {
        return setInterval(() => {
            if (this.getCountDown(game.timer) <= 0 && game.active) {
                this.endGame(gameID);
                game.active = false;
            }
            this.io.to(gameID).emit('update', {
                combos: this.games[gameID].combatTextGenerator.getActiveCombos(),
                timer: this.getCountDown(this.games[gameID].timer),
            });
        }, this.tickRate);
    }

    private getInitObj(gameID) {
        return {
            combos: this.games[gameID].combatTextGenerator.getActiveCombos(),
            timer: this.getCountDown(this.games[gameID].timer),
        }
    }

    private updateGameData(gameID: string, playerData: PlayerData, socket: SocketIO.Socket) {
        const game = this.games[gameID];
        const player = game.players[socket.id];
        player.index = playerData.index;
        if (player.index > game.highestIndex) {
            game.highestIndex = player.index;
            game.combatTextGenerator.addCombatText();
        }
        player.completedCharacters = playerData.completedCharacters;
        player.cpm = playerData.cpm;
    }

    private stopGameLoop(game: Game) {
        if (game.loopInterval !== undefined) {
            clearInterval(game.loopInterval);
            game.loopInterval = undefined;
        }
    }

    private createGame(socket: SocketIO.Socket, gameData: GameData, quickplay = false) {
        this.games[gameData.gameID] = this.getGameObj(socket);
        const game = this.games[gameData.gameID]
        game.password = gameData.password;
        game.quickplay = quickplay;
        socket.join(gameData.gameID);
        socket.emit('waiting for player');
    }

    private joinGame(socket: SocketIO.Socket, gameID: string) {
        socket.join(gameID);
        const game = this.games[gameID];
        game.players[socket.id] = { index: 0, completedCharacters: 0, cpm: 0 };
        game.sockets.push(socket);
        game.active = true;
        this.io.to(gameID).emit('match found', gameID);
    }

    public leaveAndRemoveGames(socket: SocketIO.Socket) {
        this.removeGameListeners(socket);
        socket.leaveAll();
        for (const key in this.games) {
            const game = this.games[key];
            game.sockets = game.sockets.filter(gameSocket => gameSocket.id !== socket.id);
            if (game.sockets.length === 0) {
                this.stopGameLoop(this.games[key]);
                delete this.games[key];
            } else if (game.active && !game.solo && game.sockets.length < 2) {
                game.leaver = true;
                this.endGame(key);
            }
        }
        socket.emit('cleanupDone');
    }

    private endGame(gameID: string) {
        const game = this.games[gameID]
        this.stopGameLoop(game);
        this.io.sockets.in(gameID).emit('finalStats', { playerStats: game.players, leaver: game.leaver });
    }

    private removeGameListeners(socket: SocketIO.Socket) {
        socket.removeAllListeners('update');
    }

    private getGameObj(socket) {
        return {
            players: { [socket.id]: { index: 0, completedCharacters: 0, cpm: 0 } },
            sockets: [socket],
            highestIndex: 0,
            active: false,
            combatTextGenerator: new CombatTextGenerator(),
            loopInterval: undefined,
            timer: undefined,
        };
    }

    private getCountDown(timer: Date) {
        const countDown = 30.9 - (new Date().getTime() - timer.getTime()) / 1000;
        // const countDown = 2 - (new Date().getTime() - timer.getTime()) / 1000;
        return countDown >= 0 ? countDown : 0;
    }
}
