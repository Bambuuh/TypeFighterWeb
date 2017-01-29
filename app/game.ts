interface ClientGameData {
    combos: string[];
    timer: number;
}

class Game {

    private static _instance = new Game()

    private gameName = '';

    private connection = ClientConnection.getInstance();
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    private player: Player;
    private opponent: Player;

    private timer;
    private matchTime = 31;

    private running = false;
    private gameEnd = false;

    private finalScore: {
        playerStats: { [id: string]: { cpm: number, completedCharacters: number } },
        leaver: boolean;
    } = undefined;


    constructor() { }

    public static getInstance() {
        return this._instance;
    }

    public init() {
        this.gameEnd = false;
        this.player = new Player();
        this.timer = 33;
        this.activeKeyListner();
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    public activeKeyListner() {
        document.onkeydown = (event: KeyboardEvent) => {
            if (this.timer < this.matchTime) {
                this.enterLetter(event.keyCode);
            }
        }
    }

    private stopKeyListner() {
        document.onkeydown = null;
    }

    private stopGameLoop() {
        this.running = false;
    }

    public createSoloGame() {
        this.init();
        this.connection.createSoloGame();
        this.connection.getSocket().on('init solo', (gameData: ClientGameData) => {
            this.player.init(gameData);
            this.timer = gameData.timer;
        })
        this.connection.getSocket().on('update', (gameData: ClientGameData) => {
            this.player.getCombatText().setCombatTexts(gameData.combos);
            this.timer = gameData.timer;

            this.connection.getSocket().emit('update', {
                index: this.player.getIndex(),
                completedCharacters: this.player.getCompletedCharacters(),
            });

            this.connection.getSocket().on('finalStats', finalScore => this.setFinalScore(finalScore));
        });

        this.start();
    }

    public createMultiplayerGame(gameData) {
        this.gameName = gameData;
        this.init();

        this.connection.getSocket().on('initNormal', (gameData: ClientGameData) => {
            this.player.init(gameData);
            this.timer = gameData.timer;
        });
        this.connection.getSocket().on('update', (gameData: ClientGameData) => {
            this.player.getCombatText().setCombatTexts(gameData.combos);
            this.timer = gameData.timer;

            this.connection.getSocket().emit('update', {
                index: this.player.getIndex(),
                completedCharacters: this.player.getCompletedCharacters(),
                cpm: this.player.getCPM(),
            });

            this.connection.getSocket().on('finalStats', finalScore => this.setFinalScore(finalScore));
        })

        this.start();
    }

    private setFinalScore(finalScore) {
        this.running = false;
        this.gameEnd = true;
        this.finalScore = finalScore;
    }

    public stopGame() {
        this.connection.stopGame();
        this.stopKeyListner();
        this.stopGameLoop();
    }

    public start() {
        this.running = true;
        this.loop();
    }

    private loop = () => {
        console.log(this.running)
        if (this.running) {
            this.player.setCpm(this.timer);
        } else {
            this.connection.stopGame();
        }

        this.render();

        if (this.running) {
            requestAnimationFrame(this.loop);
        }
    }

    private render() {
        this.renderBackground();
        if (this.timer > this.matchTime) {
            this.drawPreparation();
        } else if (!this.gameEnd) {
            this.drawPlayer();
            this.drawTimer();
        } else {
            this.drawScore();
        }
    }

    private drawPreparation() {
        this.context.font = '150pt Akashi';
        this.context.fillStyle = 'white';
        const text = (Math.floor(this.timer - 30)).toString();
        const x = (this.width / 2) - (this.context.measureText(text).width / 2);
        const y = (this.height / 2) + (parseInt(this.context.font) / 2.5);
        this.context.fillText(text, x, y);
    }

    private drawScore() {
        if (Object.keys(this.finalScore.playerStats).length === 1) {
            this.drawSoloScore();
        } else {
            this.drawMultiplayerScore();
        }
    }

    private drawMultiplayerScore() {
        const socketID = this.connection.getSocket().id;
        let playerOneScore = this.finalScore.playerStats[socketID];
        let playerTwoScore;

        for (const key in this.finalScore.playerStats) {
            if (key !== socketID) {
                playerTwoScore = this.finalScore.playerStats[key];
            }
        }

        let result = '';
        if (this.finalScore.leaver || playerOneScore.completedCharacters > playerTwoScore.completedCharacters) {
            result = 'VICTORY';
        } else if (playerOneScore.completedCharacters < playerTwoScore.completedCharacters) {
            result = 'DEFEAT';
        } else {
            result = 'TIE';
        }

        this.context.font = '42pt Akashi';
        this.context.fillStyle = 'white';

        const halfWidth = (this.width / 2);
        const halfHeight = (this.height / 2);

        let x = halfWidth - (this.context.measureText(result).width / 2);
        let y = (this.height / 4) + (parseInt(this.context.font) / 2);
        this.context.fillText(result, x, y);



        const playerOneX = this.width / 4;
        const playerTwoX = (this.width / 4) * 3;
        this.drawPlayerScore(playerOneX, halfHeight, playerOneScore, 'YOU');
        this.drawPlayerScore(playerTwoX, halfHeight, playerTwoScore, 'THE OTHER GUY');



    }

    private drawPlayerScore(originX: number, originY: number, score: { completedCharacters: number, cpm: number }, name: string) {
        this.context.font = '28pt Akashi';

        let spacing = 64;

        let x = originX - (this.context.measureText(name).width / 2);
        let y = originY + (parseInt(this.context.font) / 2);
        this.context.fillText(name, x, y);

        let text = 'SCORE: ' + score.completedCharacters;
        x = originX - (this.context.measureText(text).width / 2);
        y = originY + (parseInt(this.context.font) / 2) + spacing;
        this.context.fillText(text, x, y);

        spacing += spacing;

        text = 'CPM: ' + score.cpm;
        x = originX - (this.context.measureText(text).width / 2);
        y = originY + (parseInt(this.context.font) / 2) + spacing;
        this.context.fillText(text, x, y);
    }

    private drawSoloScore() {
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
