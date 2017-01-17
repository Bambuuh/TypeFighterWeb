const uiHandler = new Client.UiHandler();
const option = '';

window.onload = () => {
    uiHandler.setContainer(<HTMLDivElement>document.getElementById('content-container'))
    uiHandler.setupStartState();
}
