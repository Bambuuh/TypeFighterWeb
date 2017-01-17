var Client;
(function (Client) {
    class UiHandler {
        constructor() {
            this.game = new Client.Game();
        }
        setContainer(container) {
            this.container = container;
        }
        setupStartState() {
            this.emptyContainer();
            const createButton = document.createElement('button');
            const joinButton = document.createElement('button');
            const quickplayButton = document.createElement('button');
            createButton.id = "create-game";
            createButton.onclick = () => this.setupCreateState();
            createButton.innerHTML = "CREATE GAME";
            joinButton.id = "join-game";
            joinButton.onclick = () => this.setupJoinState();
            joinButton.innerHTML = "JOIN GAME";
            quickplayButton.id = "quickplay";
            quickplayButton.onclick = () => console.log('quickplay');
            quickplayButton.innerHTML = "QUICKPLAY";
            this.container.appendChild(createButton);
            this.container.appendChild(joinButton);
            this.container.appendChild(quickplayButton);
        }
        setupCreateState() {
            this.emptyContainer();
            const inputNameField = document.createElement('input');
            const inputPasswordField = document.createElement('input');
            const createButton = document.createElement('button');
            inputNameField.id = 'game-name-input';
            inputNameField.className = "create-game-input";
            inputNameField.placeholder = 'GAME NAME';
            inputPasswordField.id = 'game-password-input';
            inputPasswordField.className = "create-game-input";
            inputPasswordField.placeholder = 'PASSWORD';
            createButton.innerHTML = 'CREATE GAME';
            createButton.onclick = () => this.createGame();
            this.container.appendChild(inputNameField);
            this.container.appendChild(inputPasswordField);
            this.container.appendChild(createButton);
        }
        createGame() {
            const nameInput = document.getElementById('game-name-input');
            const passwordInput = document.getElementById('game-password-input');
            const gameName = nameInput.value;
            const password = passwordInput.value;
            if (gameName.length > 0) {
                this.game.createGame(gameName, password);
            }
        }
        setupJoinState() {
            this.emptyContainer();
            const inputNameField = document.createElement('input');
            const inputPasswordField = document.createElement('input');
            const joinButton = document.createElement('button');
            inputNameField.id = 'game-name-input';
            inputNameField.className = "create-game-input";
            inputNameField.placeholder = 'GAME NAME';
            inputPasswordField.id = 'game-password-input';
            inputPasswordField.className = "create-game-input";
            inputPasswordField.placeholder = 'PASSWORD';
            joinButton.innerHTML = 'JOIN GAME';
            joinButton.onclick = () => this.joinGame();
            this.container.appendChild(inputNameField);
            this.container.appendChild(inputPasswordField);
            this.container.appendChild(joinButton);
        }
        joinGame() {
            const nameInput = document.getElementById('game-name-input');
            const passwordInput = document.getElementById('game-password-input');
            const gameName = nameInput.value;
            const password = passwordInput.value;
            if (gameName.length > 0) {
                this.game.joinGame(gameName, password);
            }
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
    Client.UiHandler = UiHandler;
})(Client || (Client = {}));
