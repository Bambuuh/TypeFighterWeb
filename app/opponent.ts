class Opponent {

    private cps = 0;
    private score = 0;
    private font = '20pt Akashi';

    public getCps() {
        return this.cps;
    }

    public setCps(cps: number) {
        this.cps = cps;
    }

    public getScore() {
        return this.score
    }

    public setScore(score: number) {
        this.score = score;
    }

    public getFont() {
        return this.font;
    }
}