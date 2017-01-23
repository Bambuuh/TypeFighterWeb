class Game {

    private static _instance = new Game()

    private connection = ClientConnection.getInstance();
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    private player: Player;
    private opponent: Player;

    private running = false;

    private timer = 30;

    constructor() { }

    public static getInstance() {
        return this._instance;
    }

    public init() {
        this.player = new Player(this.width, this.height);
        this.timer = 30;
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
        this.connection.createSoloGame();
        this.connection.getSocket().on('init solo', (gameData: { combos: string[], timer: number }) => {
            this.player.getCombatText().setCombatTexts(gameData.combos);
            this.player.getCombatText().setCurrentCombatText(0);
            this.timer = gameData.timer;
        })
        this.connection.getSocket().on('solo update', (gameData: { combos: string[], timer: number }) => {
            this.player.getCombatText().setCombatTexts(gameData.combos);
            this.timer = gameData.timer;

            this.connection.getSocket().emit('solo update', {
                index: this.player.getIndex(),
                completedCharacters: this.player.getCompletedCharacters(),
            });
        });

        this.init();
        this.start();
    }

    public stopGame() {
        this.connection.stopSoloGame();
        this.stopKeyListner();
    }

    public start() {
        this.running = true;
        this.loop();
    }

    private loop = () => {
        if (this.timer >= 1) {
            this.player.setCpm(this.timer);
        } else {
            this.running = false;
            this.connection.stopSoloGame();
        }

        this.render();

        if (this.running) {
            requestAnimationFrame(this.loop);
        }
    }

    private render() {
        this.renderBackground();
        if (this.timer >= 1) {
            this.drawPlayer();
            this.drawTimer();
        } else {
            this.drawScore();
        }
    }

    private drawScore() {
        this.context.font = '42pt Akashi';
        this.context.fillStyle = 'white';

        const halfWidth = (this.width / 2);
        const halfHeight = (this.height / 2);
        
        let text = 'GAME OVER';
        let x = halfWidth - (this.context.measureText(text).width / 2);
        let y = (this.height / 4) + (parseInt(this.context.font) / 2);
        this.context.fillText(text, x, y);

        this.context.font = '28pt Akashi';
        text = 'SCORE: ' + this.player.getCompletedCharacters();
        x = halfWidth - (this.context.measureText(text).width / 2);
        y = halfHeight + (parseInt(this.context.font) / 2);
        this.context.fillText(text, x, y);

        text = 'CPM: ' + this.player.getCPM();
        x = halfWidth - (this.context.measureText(text).width / 2);
        y = halfHeight + (parseInt(this.context.font) / 2) + 64;
        this.context.fillText(text, x, y);
    }

    private renderBackground() {
        this.context.beginPath()
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }

    private drawTimer() {
        this.context.font = '36pt Akashi';
        const displayTimer = Math.floor(this.timer);
        const x = (this.width / 2) - (this.context.measureText(displayTimer.toString()).width / 2);
        const y = 16 + parseInt(this.context.font);
        this.context.fillText(displayTimer.toString(), x, y);
    }

    private drawPlayer() {
        this.player.draw(this.context, this.timer, this.width, this.height);
    }

    public enterLetter(keycode: number) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.player.enterLetter(String.fromCharCode(keycode));
        }
    }
}
