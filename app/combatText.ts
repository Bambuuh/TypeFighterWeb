interface CombatLetter {
    letter: string;
    done: boolean;
}

class CombatText {

    private combatText: CombatLetter[];
    private plainText: string;
    private currentIndex = 0;

    private oldY = 0;
    private newY = 0;

    private oldFontSize = 0;
    private newFontSize = 0;

    private oldOpacity = 0;
    private newOpacity = 0;

    private opacityIncrement = 0.1;
    private fontSizeIncrement = 4;
    private yIncrement;

    constructor(text: string, y: number, opacity: number, fontSize: number, height: number) {
        this.plainText = text;
        this.combatText = text.split('').map(char => ({ 
            letter: char,
            done: false ,
        }));
        this.oldY = y;
        this.newY = y;
        this.oldOpacity = opacity;
        this.newOpacity = opacity;
        this.oldFontSize = fontSize;
        this.newFontSize = fontSize;
        this.yIncrement = height / 10;
    }
    
    public getY() {
        return this.oldY;
    }

    public advanceY(height: number) {
        this.newY -= this.yIncrement;
    }

    public update(height: number) {
        if (this.oldY > this.newY) {
            this.oldY -= this.yIncrement * 0.1;
        }
        if (this.oldFontSize < this.newFontSize) {
            this.oldFontSize += this.fontSizeIncrement * 0.1;
        }
        if (this.oldOpacity < this.newOpacity) {
            this.oldOpacity += this.opacityIncrement * 0.1;
        }
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

    public getOpacity() {
        return this.oldOpacity;
    }

    public advanceOpacity() {
        this.newOpacity += this.opacityIncrement;
    }

    public getFontSize() {
        return this.oldFontSize;
    }

    public advanceFontSize() {
        this.newFontSize += this.fontSizeIncrement;
    }

    public advance(height: number) {
        this.advanceFontSize();
        this.advanceOpacity();
        this.advanceY(height);
    }
}
