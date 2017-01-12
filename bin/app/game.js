class Game {
    // private opponent: Player;
    constructor() {
        this.loop = () => {
            this.render();
            requestAnimationFrame(this.loop);
        };
    }
    init(canvas) {
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this.width, this.height);
        // this.opponent = new Player(this.width, this.height);
        this.socket = io.connect('/');
        this.socket.on('init', (data) => {
            this.player.getCombatText().setCombatTexts(data);
            this.player.getCombatText().setCurrentCombatText(0);
        });
        this.socket.on('update', (data) => {
            this.player.getCombatText().setCombatTexts(data.combatTexts);
            this.socket.emit('update', { index: this.player.getIndex() });
        });
    }
    start() {
        this.loop();
    }
    render() {
        this.renderBackground();
        this.drawCombo();
    }
    renderBackground() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }
    drawCombo() {
        this.player.draw(this.context, this.width, this.height);
    }
    drawPlayers() {
    }
    enterLetter(keycode) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.player.enterLetter(String.fromCharCode(keycode));
        }
    }
}
