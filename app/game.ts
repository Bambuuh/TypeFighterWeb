class Game {

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    private player: Player;
    private opponent: Player;

    constructor() { }

    public init() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        window.onkeydown = (event) => {
            this.enterLetter(event.keyCode);
        }
    }

    public kill() {
        window.onkeydown = null;
    }

    public createSoloGame() {
        this.init();
        this.player = new Player(this.width, this.height);
        this.start();
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
