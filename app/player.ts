class Player {

    private combatTexts: CombatText[] = [];
    private cps = 0;
    private score = 0;
    private completedCharacters = 0;
    private currentIndex = 0;

    private font = 'Akashi';

    constructor() {}

    public init(gameData: ClientGameData, height: number) {
        this.addCombatTexts(gameData.combos, height);
        this.setCurrentIndex(0);
    };

    public setCurrentIndex(index: number) {
        this.currentIndex = index;
    }

    public getCurrentCombatText() {
        return this.combatTexts[this.currentIndex];
    }

    public addCombatTexts(texts: string[], height: number) {
        const currentTextAmount = this.combatTexts.length;
        for (let i = currentTextAmount; i < texts.length; i++) {
            const y = Math.floor(this.generateY(i) * height);
            this.combatTexts.push(new CombatText(texts[i], y, this.generateOpacity(i), this.generatFontSize(i), height));
        }
    }

    private generateY(i){
        const pruposedY = 0.5 + ((i - this.currentIndex) / 10);
        return pruposedY > 0 ? pruposedY : 0;
    }

    private generateOpacity(i) {
        const pruposedOpacity = 1 - ((i - this.currentIndex) / 5);
        return pruposedOpacity > 0 ? pruposedOpacity : 0;
    }

    private generatFontSize(i) {
        const pruposedFontSize = 26 - ((i - this.currentIndex) * 4);
        return pruposedFontSize > 0 ? pruposedFontSize : 0;
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

    public enterLetter(letter: string, height: number) {
        const currentCombatText = this.combatTexts[this.currentIndex];
        const nextLetter = currentCombatText.getCombatText().find(combatLetter => !combatLetter.done);
        if (nextLetter.letter.toUpperCase() === letter.toUpperCase()) {
            nextLetter.done = true;
            this.completedCharacters++;
            this.increaseScore();
        }

        if (currentCombatText.getIndex() < this.combatTexts.length - 1 && currentCombatText.getCombatText().every(combatLetter => combatLetter.done)) {
            this.currentIndex++;
            this.advanceTexts();
        }
    }
    
    private advanceTexts() {
        for (let i = this.currentIndex; i < this.currentIndex + 5; i ++) {
            const combatText = this.combatTexts[i];
            combatText.advance();
        }
    }
}
