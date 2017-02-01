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

    public getCurrentCombatText() {
        return this.currentCombatText;
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
}
