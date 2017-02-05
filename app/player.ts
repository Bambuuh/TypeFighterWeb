class Player {

    private combatTexts: CombatText[] = [];
    private cps = 0;
    private score = 0;
    private completedCharacters = 0;
    private currentIndex = 0;

    private font = 'Akashi';

    constructor() {}

    public init(gameData: ClientGameData) {
        this.combatTexts = this.createCombatTexts(gameData.combos);
        this.setCurrentIndex(0);
    };

    public setCurrentIndex(index: number) {
        this.currentIndex = index;
    }

    public getCurrentCombatText() {
        return this.combatTexts[this.currentIndex];
    }

    public addCombatTexts(texts: string[]) {
        const currentTextAmount = this.combatTexts.length;
        const amountToAdd = texts.length - currentTextAmount;

        for (let i = currentTextAmount; i < texts.length; i++) {
            this.combatTexts.push(new CombatText(texts[i]));
        }
    }

    private createCombatTexts(texts: string[]) {
        return texts.map(text => new CombatText(text))
    }

    public getFont() {
        return this.font;
    }

    public getIndex() {
        return this.currentIndex;
    }

    public getScore() {
        return this.score;
    }

    public getCps() {
        return this.cps;
    }

    public setCps(timer: number) {
        this.cps = this.completedCharacters > 0 ? Math.floor((60 / (30 - timer) * this.completedCharacters)): 0;
    }

    public getCombatTexts() {
        return this.combatTexts;
    }

    private increaseScore() {
        this.score++;
    }

    public enterLetter(letter: string) {
        const currentCombatText = this.combatTexts[this.currentIndex];
        const nextLetter = currentCombatText.getCombatText().find(combatLetter => !combatLetter.done);
        if (nextLetter.letter.toUpperCase() === letter.toUpperCase()) {
            nextLetter.done = true;
            this.completedCharacters++;
            this.increaseScore();
        }

        if (currentCombatText.getIndex() < this.combatTexts.length - 1 && currentCombatText.getCombatText().every(combatLetter => combatLetter.done)) {
            this.currentIndex++;
        }
    }
}
