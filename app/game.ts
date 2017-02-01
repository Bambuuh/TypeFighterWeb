interface ClientGameData {
    combos: string[];
    timer: number;
    playerData?: { [id: string]: { score: number, cps: number } }
    solo?: boolean;
}

class Game {

    private static _instance = new Game()
    private renderer = new Renderer();

    private connection = ClientConnection.getInstance();

    private player: Player;
    private opponent: Opponent;

    private timer;
    private matchTime = 31;

    private running = false;
    private gameEnd = false;
    private solo = false;

    private finalScore: {
        playerStats: { [id: string]: { cps: number, score: number } },
        leaver: boolean;
    } = undefined;


    constructor() { }

    public static getInstance() {
        return this._instance;
    }

    public init() {
        this.gameEnd = false;
        this.player = new Player();
        this.opponent = new Opponent();
        this.timer = 33;
        this.activeKeyListner();
        this.renderer.init();
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
        this.connection.getSocket().on('init solo', (gameData: ClientGameData) => this.initGame(gameData))
        this.connection.getSocket().on('update', (gameData: ClientGameData) => this.onUpdate(gameData));
        this.start();
    }

    public createMultiplayerGame(gameData) {
        this.init();
        this.connection.getSocket().on('initNormal', (gameData: ClientGameData) => this.initGame(gameData));
        this.connection.getSocket().on('update', (gameData: ClientGameData) => this.onUpdate(gameData));
        this.start();
    }

    private onUpdate(gameData: ClientGameData) {
        const opponent = this.getOpponent(gameData, this.connection.getSocket().id);
        this.player.getCombatText().setCombatTexts(gameData.combos);
        this.timer = gameData.timer;
        if (!!opponent) {
            this.opponent.setCps(opponent.cps);
            this.opponent.setScore(opponent.score);
        }

        this.connection.getSocket().emit('update', {
            index: this.player.getIndex(),
            score: this.player.getScore(),
            cps: this.player.getCps(),
        });

        this.connection.getSocket().on('finalStats', finalScore => this.setFinalScore(finalScore));
    }

    private getOpponent(gameData: ClientGameData, id: string) {
        let opponent;
        for (const playerId in gameData.playerData) {
            if (playerId !== id) {
                opponent = gameData.playerData[playerId];
            }
        }
        return opponent;
    }

    private initGame(gameData: ClientGameData) {
        this.player.init(gameData);
        this.timer = gameData.timer;
        this.solo = gameData.solo;
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
        if (this.running) {
            this.player.setCps(this.timer);
        } else {
            this.connection.stopGame();
        }

        this.render();

        if (this.running) {
            requestAnimationFrame(this.loop);
        }
    }

    private render() {

        this.renderer.renderBackground();
        if (this.timer > this.matchTime) {
            this.renderer.drawPreparation(this.timer);
        } else if (!this.gameEnd) {
            if (this.solo) {
                this.renderer.drawSolo(this.player, this.timer);
            } else {
                this.renderer.drawMultiplayer(this.player, this.opponent, this.timer);
            }
        } else {
            this.drawScore();
        }
    }

    private drawScore() {
        if (Object.keys(this.finalScore.playerStats).length === 1) {
            this.renderer.drawSoloScore(this.player);
        } else {
            this.renderer.drawMultiplayerScore(this.finalScore, this.connection.getSocket().id);
        }
    }

    public enterLetter(keycode: number) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.player.enterLetter(String.fromCharCode(keycode));
        }
    }
}
