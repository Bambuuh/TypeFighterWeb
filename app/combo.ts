interface ComboContainer {
    fullText: string;
    combo: ComboLetter[];
}

interface ComboLetter {
    letter: string;
    done: boolean;
}

class Combo {

    private x: number;
    private y: number;
    private combo: ComboContainer = { fullText: '', combo: [] };
    private font = '';

    constructor(width: number, height: number, font: string, combo: string, context: CanvasRenderingContext2D, playerTwo = false) {
        this.setNewCombo(combo);
        this.font = font;

        context.font = this.font;
        const textHeight = parseInt(context.font);

        if (!playerTwo) {
            this.y = Math.floor((height / 2) + (textHeight / 2));
            this.x = Math.floor((width / 2) - (context.measureText(this.combo.fullText).width / 2));
        } else {
            this.y = Math.floor(((height / 4) * 3) + (textHeight / 2));
            this.x = Math.floor((width / 2) - (context.measureText(this.combo.fullText).width / 2));
        }
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getFont() {
        return this.font;
    }

    public getCombo() {
        return this.combo;
    }

    public setCombo(combo) {
        this.combo = combo;
    }

    private setNewCombo(comboText: string) {
        this.combo.fullText = comboText;
        this.combo.combo = comboText
                        .split('')
                        .map(char => ({letter: char, done: false}));
    }

    public enterLetter(letter: string) {
        const nextLetter = this.combo.combo.find(comboLetter => !comboLetter.done);
        nextLetter.done = nextLetter.letter.toUpperCase() === letter.toUpperCase();
    }

    public draw(context: CanvasRenderingContext2D) {
        let x = 0;
        this.combo.combo.forEach(comboChar => {
            context.fillStyle = comboChar.done ? 'red' : 'white';
            context.font = this.font;
            context.fillText(comboChar.letter, this.x + x, this.y);
            x += context.measureText(comboChar.letter).width;
        });
    }
}