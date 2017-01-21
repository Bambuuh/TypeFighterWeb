const uiHandler = new UiHandler();
const connection = new ClientConnection();

const option = '';

window.onload = () => {
    uiHandler.setContainer(<HTMLDivElement>document.getElementById('content-container'))
    uiHandler.setupStartState();
}
