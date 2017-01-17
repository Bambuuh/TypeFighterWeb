const uiHandler = new Client.UiHandler();
const option = '';
window.onload = () => {
    uiHandler.setContainer(document.getElementById('content-container'));
    uiHandler.setupStartState();
};
