export class CombatTextGenerator {

    private nextToAddIndex = 0;

    private activeCombos: string[];

    private combatTexts = [
        'Pure blooded asian round house kick',
        'Chuck Norris influenced uppercut',
        'Over enthusiastic tryhard punch',
        'Sound barrier breaking stomach jab',
        'Bone cutting katana like karate chop',
        'testing testing testing testing',
    ];

    constructor() {
        this.activeCombos = this.combatTexts;
    }

    public addCombatText() {
        this.activeCombos.push(this.combatTexts[this.nextToAddIndex]);
        this.nextToAddIndex = this.nextToAddIndex >= this.combatTexts.length - 1 ? 0 : this.nextToAddIndex += 1;
    }

    public getCombo(index: number) {
        return this.activeCombos[index];
    }

    public getCombatTexts() {
        return this.combatTexts;
    }
}
