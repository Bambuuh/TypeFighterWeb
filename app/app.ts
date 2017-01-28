const uiHandler = new UiHandler();
const connection = ClientConnection.getInstance();
const game = Game.getInstance();

const option = '';

window.onkeyup = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
        uiHandler.goHome()
    }
}

window.onload = () => {
    document.getElementById('home-arrow').onclick = uiHandler.goHome;
    uiHandler.setContainer(<HTMLDivElement>document.getElementById('content-container'))
    uiHandler.setupStartState();
}
