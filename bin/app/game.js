class Game {
    // private opponent: Player;
    constructor() {
        this.socket = io.connect('/');
        this.loop = () => {
            this.render();
            requestAnimationFrame(this.loop);
        };
    }
    init(canvas, option) {
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this.width, this.height);
        // this.opponent = new Player(this.width, this.height);
    }
    setupListeners() {
        this.socket.on('init', (data) => {
            this.player.getCombatText().setCombatTexts(data);
            this.player.getCombatText().setCurrentCombatText(0);
        });
        this.socket.on('update', (data) => {
            this.player.getCombatText().setCombatTexts(data.combatTexts);
            this.socket.emit('update', { index: this.player.getIndex() });
        });
        this.socket.on('joined', () => console.log('a player joined'));
        this.socket.on('disconnect', () => console.log('a player left'));
        this.socket.on('room busy', () => console.log('cant join room'));
    }
    joinServer() {
        this.socket = io.connect('/');
        this.setupListeners();
    }
    createGame(gameName, password) {
        this.socket.emit('create', { gameName: gameName, password: password });
    }
    joinGame(gameName, password) {
        this.socket.emit('join', { gameName: gameName, password: password });
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
    enterLetter(keycode) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.player.enterLetter(String.fromCharCode(keycode));
        }
    }
}
