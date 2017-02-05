interface CombatLetter {
    letter: string;
    done: boolean;
}

class CombatText {

    private combatText: CombatLetter[];
    private plainText: string;
    private currentIndex = 0;
    private x = 0;

    constructor(text: string) {
        this.plainText = text;
        this.combatText = text.split('').map(char => ({ letter: char, done: false }));
    }
    
    public getX() {
        return this.x;
    }

    public setX(x: number) {
        this.x = x;
    }

    public getIndex() {
        return this.currentIndex;
    }

    public getCombatText() {
        return this.combatText;
    }

    public getPlainText() {
        return this.plainText;
    }
}
