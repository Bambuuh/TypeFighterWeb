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
        console.log('creating')
        this.socket = io();
        this.socket.on('active connections', data => {
            console.log('reciving')
            console.log(data)
        });
    }

    public log() {
        console.log('cme')
    }

    public getSocket() {
        return this.socket;
    }

    public killAll() {
        this.socket.emit('kill all');
    }

    public createGame(gameName: string, password: string) {
        this.socket.emit('create', { gameName: gameName, password: password });
    }

    public joinGame(gameName: string, password: string) {
        this.socket.emit('join', { gameName: gameName, password: password });
    }

    public quickplay() {
        this.socket.emit('quickplay');
    }

    public requestNumberOfConnections() {
        this.socket.emit('get active connections');
    }
}