class Renderer {

    private context: CanvasRenderingContext2D;
    private height: number;
    private width: number;

    constructor() {}

    public init() {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
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
        text = 'SCORE: ' + player.getCompletedCharacters();
        x = halfWidth - (this.context.measureText(text).width / 2);
        y = halfHeight + (parseInt(this.context.font) / 2);
        this.context.fillText(text, x, y);

        text = 'CPM: ' + player.getCPM();
        x = halfWidth - (this.context.measureText(text).width / 2);
        y = halfHeight + (parseInt(this.context.font) / 2) + 64;
        this.context.fillText(text, x, y);
    }

    public drawMultiplayerScore(score, id: string) {
        const socketID = id;
        let playerOneScore = score.playerStats[socketID];
        let playerTwoScore;

        for (const key in score.playerStats) {
            if (key !== socketID) {
                playerTwoScore = score.playerStats[key];
            }
        }

        let result = '';
        if (score.leaver || playerOneScore.completedCharacters > playerTwoScore.completedCharacters) {
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

    public drawPlayerScore(originX: number, originY: number, score: { completedCharacters: number, cpm: number }, name: string) {
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

    public renderBackground() {
        this.context.beginPath()
        this.context.fillStyle = 'black';
        this.context.rect(0, 0, this.width, this.height);
        this.context.fill();
        this.context.closePath();
    }

    public drawPlayer(player: Player, timer: number) {
        player.draw(this.context, timer, this.width, this.height);
    }

    public drawTimer(timer: number) {
        this.context.font = '36pt Akashi';
        const displayTimer = Math.floor(timer);
        const x = (this.width / 2) - (this.context.measureText(displayTimer.toString()).width / 2);
        const y = 16 + parseInt(this.context.font);
        this.context.fillText(displayTimer.toString(), x, y);
    }
}