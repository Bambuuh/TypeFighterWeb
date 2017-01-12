"use strict";
class CombatTextGenerator {
    constructor() {
        this.nextToAddIndex = 0;
        this.combatTexts = [
            'Pure blooded asian round house kick',
            'Chuck Norris influenced uppercut',
            'Over enthusiastic tryhard punch',
            'Sound barrier breaking stomach jab',
            'Bone cutting katana like karate chop',
            'testing testing testing testing',
        ];
        this.activeCombos = this.combatTexts;
    }
    addCombatText() {
        this.activeCombos.push(this.combatTexts[this.nextToAddIndex]);
        this.nextToAddIndex = this.nextToAddIndex >= this.combatTexts.length - 1 ? 0 : this.nextToAddIndex += 1;
    }
    getCombo(index) {
        return this.activeCombos[index];
    }
    getCombatTexts() {
        return this.combatTexts;
    }
}
exports.CombatTextGenerator = CombatTextGenerator;
