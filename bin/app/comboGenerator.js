class ComboGenerator {
    constructor() {
        this.combos = [
            'Pure blooded asian round house kick',
            'Chuck Norris influenced uppercut',
            'Over enthusiastic tryhard punch',
            'Sound barrier breaking stomach jab',
            'Bone cutting katana like karate chop'
        ];
        this.setRandomCombo();
    }
    setRandomCombo() {
        const comboIndex = Math.floor(Math.random() * this.combos.length);
        this.currentCombo = this.combos[comboIndex];
    }
    getCurrentCombo() {
        return this.currentCombo;
    }
}
//# sourceMappingURL=comboGenerator.js.map