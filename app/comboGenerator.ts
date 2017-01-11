class ComboGenerator {

    private currentCombo: string;

    private combos = [
        'Pure blooded asian round house kick',
        'Chuck Norris influenced uppercut',
        'Over enthusiastic tryhard punch',
        'Sound barrier breaking stomach jab',
        'Bone cutting katana like karate chop'
    ];

    constructor() {
        this.setRandomCombo();
    }

    public setRandomCombo() {
        const comboIndex = Math.floor(Math.random() * this.combos.length);
        this.currentCombo = this.combos[comboIndex];
    }

    public getCurrentCombo() {
        return this.currentCombo;
    }
}