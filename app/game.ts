class Game {

    private static _instance = new Game()

    private connection = ClientConnection.getInstance();
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    private player: Player;
    private opponent: Player;

    constructor() { }

    public static getInstance() {
        return this._instance;
    }

    public init() {
        this.activeKeyListner();
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    public activeKeyListner() {
        window.onkeydown = (event) => {
            this.enterLetter(event.keyCode);
        }
    }

    public stopKeyListner() {
        window.onkeydown = null;
    }

    public createSoloGame() {
        this.player = new Player(this.width, this.height);
        this.connection.createSoloGame();
        this.connection.getSocket().on('init solo', (comboTexts: string[]) => {
            this.player.getCombatText().setCombatTexts(comboTexts);
            this.player.getCombatText().setCurrentCombatText(0);
        })
        this.connection.getSocket().on('solo update', (comboTexts: string[]) => {
            this.player.getCombatText().setCombatTexts(comboTexts);
            this.connection.getSocket().emit('solo update', this.player.getIndex());
        });

        this.init();
        this.player = new Player(this.width, this.height);
        this.start();
    }

    public stopGame() {
        this.connection.stopSoloGame();
        this.stopKeyListner();
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
