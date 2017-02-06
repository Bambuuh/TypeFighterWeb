class Renderer {

    private context: CanvasRenderingContext2D;
    private height: number;
    private width: number;

    private baseLine = 16;
    private baseFont = 20;

    constructor() {}

    public setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public drawSolo(player: Player, timer: number) {
        this.drawCurrentText(player);
        this.drawComingTexts(player);
        this.context.fillStyle = 'white';
        this.drawScore(player);
        this.drawCps(player);
        this.drawTimer(timer);
    }

    private drawTexts(player: Player) {
        this.drawCurrentText(player);
        this.drawComingTexts(player);
    }

    private drawCurrentText(player: Player) {
        const combatText = player.getCurrentCombatText();
        this.context.font = `${combatText.getFontSize()}pt ${player.getFont()}`;
        this.context.fillStyle = `rgba(255,255,255,${combatText.getOpacity()})`;
        const x = Math.floor((this.width / 2) - (this.context.measureText(combatText.getPlainText()).width / 2));
        let letterX = 0;
        combatText.getCombatText().forEach(combatLetter => {
            this.context.fillStyle = combatLetter.done ? 'red' : 'white';
            this.context.fillText(combatLetter.letter, x + letterX, combatText.getY());
            letterX += this.context.measureText(combatLetter.letter).width;
        });
    }

    private drawComingTexts(player: Player) {
        const font = player.getFont();
        for (let i = player.getIndex() + 1; i <= player.getCombatTexts().length - 1 && i < player.getIndex() + 6; i++) {
            const combatText = player.getCombatTexts()[i];
            this.context.font = `${combatText.getFontSize()}pt ${font}`;
            this.context.fillStyle = `rgba(255,255,255,${combatText.getOpacity()})`;
            const text = combatText.getPlainText();
            const textHeight = parseInt(this.context.font);
            const x = Math.floor((this.width / 2) - (this.context.measureText(text).width / 2));
            this.context.fillText(text, x, combatText.getY());
        }
    }

    private drawScore(player: Player | Opponent, opponent = false) {
        const font = player.getFont();
        this.context.fillStyle = 'white';
        this.context.font = `${this.baseFont}pt ${font}`;
        const text = 'SCORE';
        const textHeight =  parseInt(this.context.font);
        let x;
        let y;

        if (opponent) {
            x = this.width - this.context.measureText(text).width - (this.baseLine * 2);
        } else {
            x = this.baseLine * 2;
        }
        
        y = this.baseLine + textHeight;

        this.context.fillText(text, x, y);

        y += this.baseLine * 2;
        if (opponent) {
            x += this.context.measureText(text).width - this.context.measureText(player.getScore().toString()).width
        }

        this.context.fillText(player.getScore().toString(), x, y);

        return y + textHeight;
    }

    private drawCps(player: Player | Opponent, multiplayer = false, opponent = true, startY = this.baseLine) {
        const font = player.getFont();
        this.context.font = `${this.baseFont}pt ${font}`;
        this.context.fillStyle = 'white';
        const textHeight = parseInt(this.context.font);
        const text = 'CPM';

        let x;
        let y;

        y = startY + textHeight;

        if (opponent) {
            x = this.width - this.context.measureText(text).width - (this.baseLine * 2);
        } else {
            x = this.baseLine * 2;
        }

        this.context.fillText(text, x, y);

        if (opponent) {
            x += this.context.measureText(text).width - this.context.measureText(player.getCps().toString()).width
        }

        y += this.baseLine * 2;

        this.context.fillText(player.getCps().toString(), x, y);
    }

    public drawMultiplayer(player: Player, opponent: Opponent, timer: number) {
        this.drawCurrentText(player);
        this.drawComingTexts(player, );
        const y = this.drawScore(player);
        this.drawScore(opponent, true);
        this.drawCps(player, true, false, y);
        this.drawCps(opponent, true, true, y);
        this.drawTimer(timer)
    }

    public drawPreparation(timer: number) {
        this.context.font = '150pt Akashi';
        this.context.fillStyle = 'white';
        const text = (Math.floor(timer - 30)).toString();
        const x = (this.width / 2) - (this.context.measureText(text).width / 2);
        const y = (this.height / 2) + (parseInt(this.context.font) / 2.5);
        this.context.fillText(text, x, y);
    }

    public drawSoloScore(player: Player) {
        this.context.font = '42pt Akashi';
        this.context.fillStyle = 'white';

        const halfWidth = (this.width / 2);
        const halfHeight = (this.height / 2);

        let text = 'GAME OVER';
        let x = halfWidth - (this.context.measureText(text).width / 2);
        let y = (this.height / 4) + (parseInt(this.context.font) / 2);
        this.context.fillText(text, x, y);

        this.context.font = '28pt Akashi';
        text = 'SCORE: ' + player.getScore();
        x = halfWidth - (this.context.measureText(text).width / 2);
        y = halfHeight + (parseInt(this.context.font) / 2);
        this.context.fillText(text, x, y);

        text = 'CPM: ' + player.getCps();
        x = halfWidth - (this.context.measureText(text).width / 2);
        y = halfHeight + (parseInt(this.context.font) / 2) + 64;
        this.context.fillText(text, x, y);
    }

    public drawMultiplayerScore(score, id: string) {
        this.context.font = '42pt Akashi';
        this.context.fillStyle = 'white';

        const socketID = id;
        let playerOneScore = score.playerStats[socketID];
        let playerTwoScore;

        for (const key in score.playerStats) {
            if (key !== socketID) {
                playerTwoScore = score.playerStats[key];
            }
        }

        let result = '';
        if (score.leaver || playerOneScore.score > playerTwoScore.score) {
            result = 'VICTORY';
        } else if (playerOneScore.score < playerTwoScore.score) {
            result = 'DEFEAT';
        } else {
            result = 'TIE';
        }


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

    public drawPlayerScore(originX: number, originY: number, score: { score: number, cps: number }, name: string) {
        this.context.font = '28pt Akashi';
        this.context.fillStyle = 'white';

        let spacing = 64;

        let x = originX - (this.context.measureText(name).width / 2);
        let y = originY + (parseInt(this.context.font) / 2);
        this.context.fillText(name, x, y);

        let text = 'SCORE: ' + score.score;
        x = originX - (this.context.measureText(text).width / 2);
        y = originY + (parseInt(this.context.font) / 2) + spacing;
        this.context.fillText(text, x, y);

        spacing += spacing;

        text = 'CPS: ' + score.cps;
        x = originX - (this.context.measureText(text).width / 2);
        y = originY + (parseInt(this.context.font) / 2) + spacing;
        this.context.fillText(text, x, y);
    }

    public renderBackground() {
        this.context.beginPath()
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }

    public drawTimer(timer: number) {
        this.context.font = '36pt Akashi';
        this.context.fillStyle = 'white';
        const displayTimer = Math.floor(timer);
        const x = (this.width / 2) - (this.context.measureText(displayTimer.toString()).width / 2);
        const y = 16 + parseInt(this.context.font);
        this.context.fillText(displayTimer.toString(), x, y);
    }
}