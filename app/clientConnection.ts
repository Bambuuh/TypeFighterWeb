class ClientConnection {

    private socket: SocketIOClient.Socket;
    private static _instance = new ClientConnection();

    constructor() {
        this.connectToServer();
    }

    public static getInstance() {
        return this._instance;
    }

    public connectToServer() {
        this.socket = io();
    }

    public getSocket() {
        return this.socket;
    }

    public leaveAll() {
        this.socket.emit('leaveAllGames');
    }

    public createSoloGame() {
        this.socket.emit('create solo game')
    }

    public createNormalGame() {
        this.socket.emit('createNormalGame')
    }

    public stopGame() {
        this.socket.emit('stop');
    }

    public createMultiplayerGame(gameID: string, password: string) {
        this.socket.emit('create multiplayer', { gameID: gameID, password: password });
    }

    public joinMultiPlayerGame(gameID: string, password: string) {
        this.socket.emit('join multiplayer', { gameID: gameID, password: password });
    }

    public quickplay() {
        this.socket.emit('quickplay');
    }

    public requestNumberOfConnections() {
        this.socket.emit('get active connections');
    }
}