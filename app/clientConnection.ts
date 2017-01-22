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

    public killAll() {
        this.socket.emit('kill all');
        // this.socket.removeEventListener('solo update');
    }

    public createSoloGame() {
        this.socket.emit('create solo game')
    }

    public stopSoloGame() {
        this.socket.emit('stop solo');
        // this.socket.removeEventListener('solo update');
    }

    public createMultiplayerGame(gameName: string, password: string) {
        this.socket.emit('create multiplayer', { gameName: gameName, password: password });
    }

    public joinMultiPlayerGame(gameName: string, password: string) {
        this.socket.emit('join multiplayer', { gameName: gameName, password: password });
    }

    public quickplay() {
        this.socket.emit('quickplay');
    }

    public requestNumberOfConnections() {
        this.socket.emit('get active connections');
    }
}