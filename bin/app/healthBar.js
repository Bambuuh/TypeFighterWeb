class HealthBar {
    constructor(health, width, playerTwo = false) {
        this.width = 10;
        this.height = 50;
        this.health = health;
        this.y = 50;
        this.x = playerTwo ? width - (this.health * this.width) - 50 : 50;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }
    draw(context) {
        for (let i = 0; i < this.health; i++) {
            const x = this.x + (i * (this.width + 5));
            context.beginPath();
            context.fillStyle = 'green';
            context.rect(x, this.y, this.width, this.height);
            context.fill();
            context.closePath();
        }
    }
}
//# sourceMappingURL=healthBar.js.map