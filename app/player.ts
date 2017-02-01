class Player {

    private combatText = new CombatText();
    private cps = 0;

    private font = '20pt Akashi';

    constructor() {}

    public init(gameData: ClientGameData) {
        this.getCombatText().setCombatTexts(gameData.combos);
        this.getCombatText().setCurrentCombatText(0);
    };

    public getFont() {
        return this.font;
    }

    public getIndex() {
        return this.combatText.getIndex();
    }

    public getScore() {
        return this.combatText.getcompletedCharacters();
    }

    public getCps() {
        return this.cps;
    }

    public setCps(timer: number) {
        const completed = this.combatText.getcompletedCharacters()
        this.cps = completed > 0 ? Math.floor((60 / (30 - timer) * completed)): 0;
    }

    public getCombatText() {
        return this.combatText;
    }

    public enterLetter(letter: string) {
        this.combatText.enterLetter(letter);
    }
}
