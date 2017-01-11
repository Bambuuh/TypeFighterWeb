class HealthBar {

    private health: number;
    private width = 10;
    private height = 50;

    private x:number;
    private y: number;

    constructor(health: number, width: number, playerTwo = false) {
        this.health = health;
        this.y = 50;
        this.x = playerTwo ? width - (this.health * this.width) - 50 : 50;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getHeight() {
        return this.height;
    }

    public getWidth() {
        return this.width;
    }

    public draw(context: CanvasRenderingContext2D) {

        for (let i = 0; i < this.health; i++) {
            const x = this.x + (i * (this.width + 5));

            context.beginPath()
            context.fillStyle = 'green';
            context.rect(x, this.y, this.width, this.height);
            context.fill();
            context.closePath();
        }
    }
}