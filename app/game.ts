class Game {

    private socket;


    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    private comboGenerator = new ComboGenerator();

    private playerOne: Player;
    private playerTwo: Player;

    private playerOneHealth: HealthBar;
    private playerTwoHealth: HealthBar;

    private playerOneCombo: Combo;
    private playerTwoCombo: Combo;

    constructor() { }

    public init(canvas: HTMLCanvasElement) {

        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.playerOne = new Player(this.width, this.height, false);
        this.playerTwo = new Player(this.width, this.height, true);

        this.playerOneHealth = new HealthBar(this.playerOne.getHealth(), this.width);
        this.playerTwoHealth = new HealthBar(this.playerTwo.getHealth(), this.width, true);

        this.playerOneCombo = new Combo(this.width, this.height, '20pt Georgia', this.comboGenerator.getCurrentCombo(), this.context);
        this.playerTwoCombo = new Combo( this.width, this.height, '15pt Georgia', this.comboGenerator.getCurrentCombo(), this.context, true);

        this.socket = io.connect('/', {combo: this.playerOneCombo});
        this.socket.on('update', data => {
            for (let player in data) {
                if (player !== this.socket.id && data[player].combo) {
                    this.playerTwoCombo.setCombo(data[player].combo);
                }
            }
            this.socket.emit('update', this.playerOneCombo.getCombo());
        });
    }

    public hitPlayer = (player: string) => {
        if (player === 'one') {
            this.playerOne.reduceHealth();
        } else {
            this.playerTwo.reduceHealth();
        }
    }

    public start() {
        this.loop();
    }

    public getPlayerCombo() {
        return this.playerOneCombo;
    }

    private loop = () => {
        this.render();
        requestAnimationFrame(this.loop);
    }

    private render() {
        this.renderBackground();
        // this.drawPlayerHealth();
        this.drawCombo();
        // this.drawPlayers();
    }

    private renderBackground() {
        this.context.beginPath()
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }

    private drawPlayerHealth() {
        this.playerOneHealth.draw(this.context);
        this.playerTwoHealth.draw(this.context);
    }

    private drawCombo() {
        this.playerOneCombo.draw(this.context);
        this.playerTwoCombo.draw(this.context);
    }

    private drawPlayers() {
        this.playerOne.draw(this.context);
        this.playerTwo.draw(this.context);
    }

    public enterLetter(keycode: number) {
        // guaranteed to be a letter
        if(keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.playerOneCombo.enterLetter(String.fromCharCode(keycode));
        }
    }
}
