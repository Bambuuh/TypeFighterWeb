class Player {
    constructor(width, height, playerTwo) {
        this.health = 10;
        this.avatarWidth = 50;
        this.avatarHeight = 100;
        this.init(width, height, playerTwo);
    }
    init(width, height, playerTwo) {
        this.x = playerTwo ? width - (this.avatarWidth + 300) : 300;
        this.y = height - this.avatarHeight - 50;
    }
    ;
    getHealth() {
        return this.health;
    }
    reduceHealth() {
        this.health--;
    }
    getAvatarX() {
        return this.x;
    }
    getAvatarY() {
        return this.y;
    }
    draw(context) {
        context.beginPath();
        context.fillStyle = 'blue';
        context.rect(this.x, this.y, this.avatarWidth, this.avatarHeight);
        context.fill();
    }
}
//# sourceMappingURL=player.js.map