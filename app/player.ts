namespace Client {
    export class Player {

        private x: number;
        private y: number;

        private combatText = new CombatText();
        private currentIndex: 0;

        private font = '20pt Georgia';

        constructor(width: number, height: number) {
            this.init(width, height);
        }

        public init(width: number, height: number)  {
        };

        public getIndex() {
            return this.combatText.getIndex();
        }

        public getX() {
            return this.x;
        }

        public getY() {
            return this.y
        }

        public getCombatText() {
            return this.combatText;
        }

        public enterLetter(letter: string) {
            this.combatText.enterLetter(letter);
        }

        public draw(context: CanvasRenderingContext2D, width: number, height: number) {
            this.combatText.draw(context, this.font, width, height);
        }
    }
}
    