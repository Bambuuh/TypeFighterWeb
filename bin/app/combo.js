class Combo {
    constructor(width, height, font, combo, context, playerTwo = false) {
        this.combo = { fullText: '', combo: [] };
        this.font = '';
        this.setNewCombo(combo);
        this.font = font;
        context.font = this.font;
        const textHeight = parseInt(context.font);
        if (!playerTwo) {
            this.y = Math.floor((height / 2) + (textHeight / 2));
            this.x = Math.floor((width / 2) - (context.measureText(this.combo.fullText).width / 2));
        }
        else {
            this.y = Math.floor(((height / 4) * 3) + (textHeight / 2));
            this.x = Math.floor((width / 2) - (context.measureText(this.combo.fullText).width / 2));
        }
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getFont() {
        return this.font;
    }
    getCombo() {
        return this.combo;
    }
    setCombo(combo) {
        this.combo = combo;
    }
    setNewCombo(comboText) {
        this.combo.fullText = comboText;
        this.combo.combo = comboText
            .split('')
            .map(char => ({ letter: char, done: false }));
    }
    enterLetter(letter) {
        const nextLetter = this.combo.combo.find(comboLetter => !comboLetter.done);
        nextLetter.done = nextLetter.letter.toUpperCase() === letter.toUpperCase();
    }
}
//# sourceMappingURL=combo.js.map