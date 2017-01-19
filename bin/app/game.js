class Game {
    // private opponent: Player;
    constructor() {
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
    connect(action, channel) {
        let query = 'action=' + action;
        if (!!channel) {
            query += '&channel=' + channel.name + '&password=' + channel.password;
        }
        this.socket = io.connect('/', { query: query });
        // this.socket.on('channel', (data) => this.socket = io.connect(data));
        this.socket.on('joined', () => console.log('a player joined'));
        this.socket.on('disconnect', () => console.log('a player left'));
        this.socket.on('room busy', () => console.log('cant join room'));
        // this.socket.on('init', (data: string[]) => {
        //     this.player.getCombatText().setCombatTexts(data);
        //     this.player.getCombatText().setCurrentCombatText(0);
        // });
        // this.socket.on('update', (data: { player:{index: number}, combatTexts: string[] }) => {
        //     this.player.getCombatText().setCombatTexts(data.combatTexts);
        //     this.socket.emit('update', {index: this.player.getIndex()});
        // });
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
    createGame(gameName, password) {
        this.connect('create', { name: gameName, password: password });
    }
    joinGame(gameName, password) {
        this.connect('join', { name: gameName, password: password });
    }
    enterLetter(keycode) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.player.enterLetter(String.fromCharCode(keycode));
        }
    }
}
