class Player {
    private health = 10;

    private avatarWidth = 50;
    private avatarHeight = 100;

    private x: number;
    private y: number;

    constructor(width: number, height: number, playerTwo: boolean) {
        this.init(width, height, playerTwo);
    }

    public init(width: number, height: number, playerTwo: boolean)  {
        this.x = playerTwo ? width - (this.avatarWidth + 300) : 300;
        this.y = height - this.avatarHeight - 50;
    };

    public getHealth() {
        return this.health;
    }

    public reduceHealth() {
        this.health--;
    }

    public getAvatarX() {
        return this.x;
    }

    public getAvatarY() {
        return this.y
    }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.fillStyle = 'blue';
        context.rect(this.x, this.y, this.avatarWidth, this.avatarHeight);
        context.fill();
    }
}