class Game {
    private socket: SocketIOClient.Socket = io.connect('/');

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    private player: Player;
    // private opponent: Player;

    constructor() { }

    public init(canvas: HTMLCanvasElement, option: string) {
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.player = new Player(this.width, this.height);
        // this.opponent = new Player(this.width, this.height);
        
    }

    private setupListeners() {
        this.socket.on('init', (data: string[]) => {
            this.player.getCombatText().setCombatTexts(data);
            this.player.getCombatText().setCurrentCombatText(0);
        });

        this.socket.on('update', (data: { player: { index: number }, combatTexts: string[] }) => {
            this.player.getCombatText().setCombatTexts(data.combatTexts);
            this.socket.emit('update', { index: this.player.getIndex() });
        });

        this.socket.on('joined', () => console.log('a player joined'));
        this.socket.on('disconnect', () => console.log('a player left'));
        this.socket.on('room busy', () => console.log('cant join room'));
    }

    private joinServer() {
        this.socket = io.connect('/');
        this.setupListeners();
    }

    public createGame(gameName: string, password: string) {
        this.socket.emit('create', { gameName: gameName, password: password });
    }

    public joinGame(gameName: string, password: string) {
        this.socket.emit('join', { gameName: gameName, password: password });
    }

    public start() {
        this.loop();
    }

    private loop = () => {
        this.render();
        requestAnimationFrame(this.loop);
    }

    private render() {
        this.renderBackground();
        this.drawCombo();
    }

    private renderBackground() {
        this.context.beginPath()
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }

    private drawCombo() {
        this.player.draw(this.context, this.width, this.height);
    }

    public enterLetter(keycode: number) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.player.enterLetter(String.fromCharCode(keycode));
        }
    }
}
