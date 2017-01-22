const uiHandler = new UiHandler();
const connection = ClientConnection.getInstance();

const option = '';

window.onload = () => {
    document.getElementById('home-arrow').onclick = () => {
        connection.killAll();
        uiHandler.setupStartState()
    };
    uiHandler.setContainer(<HTMLDivElement>document.getElementById('content-container'))
    uiHandler.setupStartState();
}
