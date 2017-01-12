const game = new Game();
window.onkeydown = (event) => {
    game.enterLetter(event.keyCode);
};
window.onload = () => {
    const canvas = document.getElementById('canvas');
    game.init(canvas);
    game.start();
};
