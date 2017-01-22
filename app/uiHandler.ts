class UiHandler {

    private game = new Game();
    private connection = ClientConnection.getInstance();
    private container: HTMLDivElement;

    private fadeInInterval;
    private fadeOutInterval;
    private fadeOutTimeout;

    private count = 0;

    constructor() { }

    public setContainer(container: HTMLDivElement) {
        this.container = container;
        this.connection.getSocket().on('client count', count => {
            if (this.count !== count) {
                this.count = count
                this.setPlayerCount();
            }
        });
        this.connection.getSocket().on('waiting for player', () => this.setupWaitingForPlayerState())
        this.connection.getSocket().on('match found', () => this.startGame())
        this.connection.getSocket().on('room doesnt exist', () => this.showMessage("ROOM DOESN'T EXIST"));
        this.connection.getSocket().on('room exists', () => this.showMessage("ROOM NAME ALREADY EXISTS"));
        this.connection.getSocket().on('wrong password', () => this.showMessage("INCORRECT PASSWORD"));
    }

    public setupStartState() {
        this.clearUIState();

        const quickplayButton = document.createElement('button');
        const createButton = document.createElement('button');
        const joinButton = document.createElement('button');
        const soloPlayButton = document.createElement('button')

        quickplayButton.id = "quickplay";
        quickplayButton.onclick = () => this.connection.quickplay();
        quickplayButton.innerHTML = "QUICKPLAY";

        createButton.id = "create-game";
        createButton.onclick = () => this.setupCreateState();
        createButton.innerHTML = "CREATE GAME";

        joinButton.id = "join-game";
        joinButton.onclick = () => this.setupJoinState();
        joinButton.innerHTML = "JOIN GAME";


        soloPlayButton.id = "solo-game";
        soloPlayButton.onclick = () => this.createSoloGame();
        soloPlayButton.innerHTML = "PLAY SOLO";

        this.container.appendChild(quickplayButton);
        this.container.appendChild(createButton);
        this.container.appendChild(joinButton);
        this.container.appendChild(soloPlayButton);
    }

    public setupCreateState() {
        this.clearUIState();

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
        this.clearUIState();

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

    private setPlayerCount() {
        console.log(this.count);
    }

    public setupWaitingForPlayerState() {
        this.clearUIState();
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

    private showMessage(message: string) {
        clearTimeout(this.fadeOutTimeout)
        const messageContainer = document.getElementById('message-container');
        messageContainer.style.display = 'block';
        messageContainer.innerHTML = message;
        this.fadeIn(messageContainer);
        this.fadeOutTimeout = setTimeout(() => {
            this.fadeOut(messageContainer);
        }, 3000);
    }

    private fadeOut(element: HTMLElement) {
        clearInterval(this.fadeOutInterval);
        let opacity = 1;
        this.fadeOutInterval = setInterval(() => {
            if (opacity <= 0.0) {
                clearInterval(this.fadeOutInterval);
                element.style.display = 'none';
            }

            element.style.opacity = opacity.toString();
            element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity -= 0.1;
        }, 50);
    }

    private fadeIn(element: HTMLElement) {
        clearInterval(this.fadeInInterval)
        element.style.opacity = '0';
        element.style.filter = 'alpha(opacity= 0)';
        let opacity = 0;
        this.fadeInInterval = setInterval(() => {
            if (opacity >= 1) {
                clearInterval(this.fadeInInterval);
            }

            element.style.opacity = opacity.toString();
            element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity += 0.1;
        }, 50);
    }

    private createSoloGame() {
        this.setupGameState();
        this.game.createSoloGame();
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
        this.clearUIState();

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 500;
        canvas.id = 'canvas';

        this.container.appendChild(canvas);
    }

    private clearUIState() {
        document.getElementById('message-container').innerHTML = '';
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    private startGame() {
        // this.setupGameState();
        // const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        // this.game.init(canvas);
        // this.game.start();

        // window.onkeydown = (event) => {
        //     this.game.enterLetter(event.keyCode);
        // }
    }
}
