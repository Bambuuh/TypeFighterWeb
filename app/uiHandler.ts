class UiHandler {

    private game = new Game();
    private container: HTMLDivElement;

    constructor() { }

    public setContainer(container: HTMLDivElement) {
        this.container = container;
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

    private createGame() {
        const nameInput = <HTMLInputElement>document.getElementById('game-name-input');
        const passwordInput = <HTMLInputElement>document.getElementById('game-password-input');
        const gameName = nameInput.value;
        const password = passwordInput.value;
        if (gameName.length > 0) {
            this.game.createGame(gameName, password);
        }
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

    private joinGame() {
        const nameInput = <HTMLInputElement>document.getElementById('game-name-input');
        const passwordInput = <HTMLInputElement>document.getElementById('game-password-input');
        const gameName = nameInput.value;
        const password = passwordInput.value;
        if (gameName.length > 0) {
            this.game.joinGame(gameName, password);
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
