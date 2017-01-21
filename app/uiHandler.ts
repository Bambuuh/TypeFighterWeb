class UiHandler {

    private game = new Game();
    private connection = new ClientConnection();
    private container: HTMLDivElement;

    constructor() { }

    public setContainer(container: HTMLDivElement) {
        this.container = container;
        this.connection.getSocket().on('waiting for player', () => {
            this.setupWaitingForPlayerState();
        })
    }

    public setupStartState() {
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

    public setupCreateState() {
        this.emptyContainer();

        const inputNameField = document.createElement('input');
        const inputPasswordField = document.createElement('input');
        const createButton = document.createElement('button');

        inputNameField.id = 'game-name-input';
        inputNameField.className = "create-game-input"
        inputNameField.placeholder = 'GAME NAME'

        inputPasswordField.id = 'game-password-input';
        inputPasswordField.className = "create-game-input"
        inputPasswordField.placeholder = 'PASSWORD'

        createButton.innerHTML = 'CREATE GAME';
        createButton.onclick = () => this.createGame();

        this.container.appendChild(inputNameField);
        this.container.appendChild(inputPasswordField);
        this.container.appendChild(createButton);
    }

    public setupJoinState() {
        this.emptyContainer();

        const inputNameField = document.createElement('input');
        const inputPasswordField = document.createElement('input');
        const joinButton = document.createElement('button');

        inputNameField.id = 'game-name-input';
        inputNameField.className = "create-game-input"
        inputNameField.placeholder = 'GAME NAME'

        inputPasswordField.id = 'game-password-input';
        inputPasswordField.className = "create-game-input"
        inputPasswordField.placeholder = 'PASSWORD'

        joinButton.innerHTML = 'JOIN GAME';
        joinButton.onclick = () => this.joinGame();

        this.container.appendChild(inputNameField);
        this.container.appendChild(inputPasswordField);
        this.container.appendChild(joinButton);
    }

    public setupWaitingForPlayerState() {
        this.emptyContainer();
        const spinnerContainer = document.createElement('div');
        const waitingText = document.createElement('div');

        spinnerContainer.className = "spinner-container";

        waitingText.innerText = "WAITING FOR ANOTHER PLAYER";

        const squares = [];
        for (let i = 1; i <= 5; i++) {
            const square = document.createElement('div');
            square.className="spinner loading-bar" + i
            squares.push(square)
        }
        
        squares.forEach(square => spinnerContainer.appendChild(square));
        this.container.appendChild(spinnerContainer);
        this.container.appendChild(waitingText);
    }

    private createGame() {
        const nameInput = <HTMLInputElement>document.getElementById('game-name-input');
        const passwordInput = <HTMLInputElement>document.getElementById('game-password-input');
        const gameName = nameInput.value;
        const password = passwordInput.value;
        if (gameName.length > 0) {
            console.log(gameName, password);
            this.connection.createGame(gameName, password);
        }
    }

    private joinGame() {
        const nameInput = <HTMLInputElement>document.getElementById('game-name-input');
        const passwordInput = <HTMLInputElement>document.getElementById('game-password-input');
        const gameName = nameInput.value;
        const password = passwordInput.value;
        if (gameName.length > 0) {
            console.log(gameName, password);
            this.connection.joinGame(gameName, password);
        }
    }

    private chooseGame(element: HTMLDivElement) {
        const currentSelected = document.getElementById('selected-game');
        if (!!currentSelected) {
            currentSelected.removeAttribute('id');
        }
        element.id = 'selected-game';
    }

    public setupGameState() {
        this.emptyContainer();

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 500;
        canvas.id = 'canvas';

        this.container.appendChild(canvas);
    }

    private emptyContainer() {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    private startGame(option: string) {
        this.setupGameState();
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.game.init(canvas, option);
        this.game.start();

        window.onkeydown = (event) => {
            this.game.enterLetter(event.keyCode);
        }
    }
}
