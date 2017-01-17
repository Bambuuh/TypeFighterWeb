var Client;
(function (Client) {
    class Player {
        constructor(width, height) {
            this.combatText = new Client.CombatText();
            this.font = '20pt Georgia';
            this.init(width, height);
        }
        init(width, height) {
        }
        ;
        getIndex() {
            return this.combatText.getIndex();
        }
        getX() {
            return this.x;
        }
        getY() {
            return this.y;
        }
        getCombatText() {
            return this.combatText;
        }
        enterLetter(letter) {
            this.combatText.enterLetter(letter);
        }
        draw(context, width, height) {
            this.combatText.draw(context, this.font, width, height);
        }
    }
    Client.Player = Player;
})(Client || (Client = {}));
