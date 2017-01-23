interface CombatLetter {
    letter: string;
    done: boolean;
}

class CombatText {

    private combatTexts: string[] = [];
    private currentCombatText: CombatLetter[] = [];

    private currentIndex = 0;
    private completedCharacters = 0;

    constructor() { }

    public getIndex() {
        return this.currentIndex;
    }

    public setCombatTexts(texts: string[]) {
        this.combatTexts = texts;
    }

    public getCombatTexts() {
        return this.combatTexts
    }

    public getcompletedCharacters() {
        return this.completedCharacters;
    }

    public setCurrentCombatText(index: number) {
        this.currentCombatText = this.setNewCombatText(this.combatTexts[index]);
    }

    private setNewCombatText(comboText: string) {
        return comboText.split('').map(char => ({ letter: char, done: false }));
    }

    public enterLetter(letter: string) {
        const nextLetter = this.currentCombatText.find(combatLetter => !combatLetter.done);
        if (nextLetter.letter.toUpperCase() === letter.toUpperCase()) {
            nextLetter.done = true;
            this.completedCharacters++;
        }

        if (this.currentIndex < this.combatTexts.length - 1 && this.currentCombatText.every(combatLetter => combatLetter.done)) {
            this.currentIndex++;
            this.currentCombatText = this.setNewCombatText(this.combatTexts[this.currentIndex]);
        }
    }

    public drawCombo(context, font, width, height) {
        let textHeight = parseInt(context.font);
        let y = Math.floor((height / 2) + (textHeight / 2));
        let x = Math.floor((width / 2) - (context.measureText(this.combatTexts[this.currentIndex]).width / 2));

        let letterX = 0;
        
        this.currentCombatText.forEach(combatLetter => {
            context.fillStyle = combatLetter.done ? 'red' : 'white';
            context.fillText(combatLetter.letter, x + letterX, y);
            letterX += context.measureText(combatLetter.letter).width;
        });

        for (let i = this.currentIndex + 1; i <= this.combatTexts.length - 1 && i < this.currentIndex + 4; i++) {
            const text = this.combatTexts[i];
            textHeight = parseInt(context.font);
            y += Math.floor(textHeight + 20);
            x = Math.floor((width / 2) - (context.measureText(text).width / 2));
            context.fillText(text, x, y);
        }
    }

    public drawScore(context: CanvasRenderingContext2D) {
        const text = 'SCORE';
        const x = 32;
        let y = 16 + parseInt(context.font);
        context.fillText(text, x, y);

        y += 32;
        context.fillText(this.completedCharacters.toString(), x, y);
    }
}
