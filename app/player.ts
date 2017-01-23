class Player {

    private x: number;
    private y: number;

    private combatText = new CombatText();
    private currentIndex: 0;
    private cpm = 0;

    private font = '20pt Akashi';

    constructor(width: number, height: number) {
        this.init(width, height);
    }

    public init(width: number, height: number) {
    };

    public getIndex() {
        return this.combatText.getIndex();
    }

    public getCompletedCharacters() {
        return this.combatText.getcompletedCharacters();
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y
    }

    public getCPM() {
        return this.cpm;
    }

    public setCpm(timer: number) {
        const completed = this.combatText.getcompletedCharacters()
        this.cpm = completed > 0 ? Math.floor((60 / (30 - timer) * completed)): 0;
    }

    public getCombatText() {
        return this.combatText;
    }

    public enterLetter(letter: string) {
        this.combatText.enterLetter(letter);
    }

    public draw(context: CanvasRenderingContext2D, timer: number, width: number, height: number) {
        context.fillStyle = 'white';
        context.font = this.font;
        this.drawComboText(context, width, height);
        this.drawCompletedCharacters(context, timer, width);
        this.drawCharactersPerSecond(context, width);
    }

    public drawComboText(context: CanvasRenderingContext2D, width: number, height: number) {
        this.combatText.drawCombo(context, this.font, width, height);
    }

    public drawCompletedCharacters(context: CanvasRenderingContext2D, timer: number, width: number) {
        this.combatText.drawScore(context);
    }

    public drawCharactersPerSecond(context: CanvasRenderingContext2D, width:number) {
        const text = 'CPM';
        const textHeight = parseInt(context.font);
        let x = width - context.measureText(text).width - 32;
        let y = 16 + textHeight;

        context.fillText(text, x, y);

        x += context.measureText(text).width - context.measureText(this.cpm.toString()).width
        y += 32;

        context.fillText(this.cpm.toString(), x, y);
    }
}
