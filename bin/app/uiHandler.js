class UiHandler {
    constructor() {
        this.game = new Game();
    }
    setContainer(container) {
        this.container = container;
    }
    setupStartState() {
        this.emptyContainer();
        const createButton = document.createElement('button');
        const joinButton = document.createElement('button');
        createButton.id = "create-game";
        createButton.onclick = () => this.setupCreateState();
        createButton.innerHTML = "CREATE GAME";
        joinButton.id = "join-game";
        joinButton.onclick = () => this.setupJoinState();
        joinButton.innerHTML = "JOIN GAME";
        this.container.appendChild(createButton);
        this.container.appendChild(joinButton);
    }
    setupCreateState() {
        this.emptyContainer();
        const inputField = document.createElement('input');
        const createButton = document.createElement('button');
        inputField.id = 'game-name-input';
        inputField.placeholder = 'GAME NAME';
        createButton.innerHTML = 'CREATE GAME';
        createButton.onclick = () => this.createGame();
        this.container.appendChild(inputField);
        this.container.appendChild(createButton);
    }
    createGame() {
        const input = document.getElementById('game-name-input');
        const gameName = input.value;
        if (gameName.length > 0) {
            this.game.createGame(gameName);
        }
    }
    setupJoinState() {
        this.emptyContainer();
        const activeGameContainer = document.createElement('div');
        const joinButton = document.createElement('button');
        for (let i = 0; i < 10; i++) {
            const activeGame = document.createElement('div');
            activeGame.innerHTML = 'Game number: ' + i;
            activeGame.className = 'active-game';
            activeGameContainer.appendChild(activeGame);
            activeGame.onclick = () => this.chooseGame(activeGame);
        }
        joinButton.innerHTML = 'JOIN GAME';
        joinButton.id = "join-game";
        this.container.appendChild(activeGameContainer);
        this.container.appendChild(joinButton);
    }
    chooseGame(element) {
        const currentSelected = document.getElementById('selected-game');
        if (!!currentSelected) {
            currentSelected.removeAttribute('id');
        }
        element.id = 'selected-game';
    }
    setupGameState() {
        this.emptyContainer();
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 500;
        canvas.id = 'canvas';
        this.container.appendChild(canvas);
    }
    emptyContainer() {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild);
        }
    }
    startGame(option) {
        uiHandler.setupGameState();
        const canvas = document.getElementById('canvas');
        this.game.init(canvas, option);
        this.game.start();
        window.onkeydown = (event) => {
            this.game.enterLetter(event.keyCode);
        };
    }
}
