class Game {
    constructor() {
        this.comboGenerator = new ComboGenerator();
        this.hitPlayer = (player) => {
            if (player === 'one') {
                this.playerOne.reduceHealth();
            }
            else {
                this.playerTwo.reduceHealth();
            }
        };
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
        this.playerOne = new Player(this.width, this.height, false);
        this.playerTwo = new Player(this.width, this.height, true);
        this.playerOneHealth = new HealthBar(this.playerOne.getHealth(), this.width);
        this.playerTwoHealth = new HealthBar(this.playerTwo.getHealth(), this.width, true);
        this.playerOneCombo = new Combo(this.width, this.height, '20pt Georgia', this.comboGenerator.getCurrentCombo(), this.context);
        this.playerTwoCombo = new Combo(this.width, this.height, '15pt Georgia', this.comboGenerator.getCurrentCombo(), this.context, true);
        this.socket = io.connect('/', { combo: this.playerOneCombo });
        this.socket.on('update', data => {
            for (let player in data) {
                if (player !== this.socket.id && data[player].combo) {
                    this.playerTwoCombo.setCombo(data[player].combo);
                }
            }
            this.socket.emit('update', this.playerOneCombo.getCombo());
        });
    }
    start() {
        this.loop();
    }
    getPlayerCombo() {
        return this.playerOneCombo;
    }
    render() {
        this.renderBackground();
        // this.drawPlayerHealth();
        this.drawCombo();
        // this.drawPlayers();
    }
    renderBackground() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }
    drawPlayerHealth() {
        this.playerOneHealth.draw(this.context);
        this.playerTwoHealth.draw(this.context);
    }
    drawCombo() {
        let letterX;
        letterX = 0;
        this.playerOneCombo.getCombo().combo.forEach(comboChar => {
            this.context.fillStyle = comboChar.done ? 'red' : 'white';
            this.context.font = this.playerOneCombo.getFont();
            this.context.fillText(comboChar.letter, this.playerOneCombo.getX() + letterX, this.playerOneCombo.getY());
            letterX += this.context.measureText(comboChar.letter).width;
        });
        letterX = 0;
        this.playerTwoCombo.getCombo().combo.forEach(comboChar => {
            this.context.fillStyle = comboChar.done ? 'red' : 'white';
            this.context.font = this.playerTwoCombo.getFont();
            this.context.fillText(comboChar.letter, this.playerTwoCombo.getX() + letterX, this.playerTwoCombo.getY());
            letterX += this.context.measureText(comboChar.letter).width;
        });
    }
    drawPlayers() {
        this.playerOne.draw(this.context);
        this.playerTwo.draw(this.context);
    }
    enterLetter(keycode) {
        // guaranteed to be a letter
        if (keycode === 32 || (keycode > 64 && keycode < 91)) {
            this.playerOneCombo.enterLetter(String.fromCharCode(keycode));
        }
    }
}
//# sourceMappingURL=game.js.map