const uiHandler = new UiHandler();
const connection = ClientConnection.getInstance();
const game = Game.getInstance();

const option = '';

window.onload = () => {
    document.getElementById('home-arrow').onclick = () => {
        connection.killAll();
        game.stopGame();
        uiHandler.setupStartState()
    };
    uiHandler.setContainer(<HTMLDivElement>document.getElementById('content-container'))
    uiHandler.setupStartState();
}
