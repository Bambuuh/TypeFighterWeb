class ClientConnection {

    private socket: SocketIOClient.Socket;

    constructor() {
        this.connectToServer();
    }

    public connectToServer() {
        console.log('creating')
        this.socket = io.connect('/');
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

    public createGame(gameName: string, password: string) {
        this.socket.emit('create', { gameName: gameName, password: password });
    }

    public joinGame(gameName: string, password: string) {
        this.socket.emit('join', { gameName: gameName, password: password });
    }

    public requestNumberOfConnections() {
        this.socket.emit('get active connections');
    }
}