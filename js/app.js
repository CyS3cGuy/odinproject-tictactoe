function GameBoard() {
    const { ROWS, COLS } = BoardDimension();
    let board = [];
    let availableCells = ROWS * COLS;

    // Closures
    const createBoard = () => {
        for (let i = 0; i < ROWS; i++) {
            board.push([]);
            for (let j = 0; j < COLS; j++) {
                board[i].push(BoardCell());
            }
        }

        availableCells = ROWS * COLS;
    }

    const get = () => board;
    const print = () => console.log(board.map(row => row.map(col => col.getMarker())));
    const getCell = (cellPosition) => board[cellPosition[0]][cellPosition[1]];
    const isCellEmpty = (cellPosition) => board[cellPosition[0]][cellPosition[1]].isCellEmpty();
    const isFull = () => availableCells === 0;
    const isOutOfBound = (cellPosition) => cellPosition[0] > ROWS - 1 ? true : cellPosition[1] > COLS - 1 ? true : false;
    const decreaseAvailableCells = () => availableCells--;
    const reset = () => {
        // Reset board 
        board.length = 0;
        createBoard();

    }

    // Call initialiser API
    createBoard();

    return {
        get,
        getCell,
        print,
        isCellEmpty,
        isOutOfBound,
        isFull,
        decreaseAvailableCells,
        reset,
    }
}

function BoardCell() {
    let marker = "";

    const getMarker = () => marker;
    const setMarker = (playerMarker) => marker = playerMarker;
    const isCellEmpty = () => marker === "" ? true : false;

    return {
        getMarker,
        setMarker,
        isCellEmpty,
    }
}

function Player(playerName) {
    let nickname = playerName;
    let marker = "";
    let score = 0;
    let color = "";

    const setMarker = (playerNum) => marker = playerNum === 0 ? "O" : "X"; // First player get "O", second player get "X"
    const setColor = (playerNum) => color = playerNum === 0 ? "green" : "blue";
    const getColor = () => color;
    const getMarker = () => marker;
    const getNickname = () => nickname;
    const win = () => score++;
    const getScore = () => score;
    const setScore = (playerScore) => score = playerScore;

    return {
        setMarker,
        setColor,
        getColor,
        getMarker,
        getNickname,
        getScore,
        setScore,
        win,
    }
}

function PlayersManager() {
    const players = [];
    let currentPlayerNum = 0;
    let startFrom = 0;
    let winnerRound = null;

    const addPlayer = (playerName) => {
        let nickname = playerName;
        if (isEnoughPlayers()) {
            console.log("Already have sufficient players");
            return;
        }

        if (!nickname) {
            console.log(nickname);
            console.log(players);
            nickname = askPlayerName();
        }

        players.push(Player(nickname));
        players.at(-1).setMarker(players.length - 1);
        players.at(-1).setColor(players.length - 1);
    }

    const getAllPlayers = () => players;
    const askPlayerName = () => prompt("What is your nickname?");
    const isEnoughPlayers = () => players.length === 2 ? true : false;
    const switchPlayerTurn = () => currentPlayerNum = (currentPlayerNum + 1) % 2;
    const getActivePlayer = () => players[currentPlayerNum];
    const getActivePlayerIndex = () => currentPlayerNum;
    const getPlayer = (index) => players[index] ? players[index] : null;
    const setWinner = (player) => winnerRound = player;
    const getWinner = () => winnerRound;
    const clearPlayers = () => {
        players.length = 0;
        currentPlayerNum = 0;
    }
    const getColorByMarker = (marker) => {
        let playerExist = getAllPlayers().find(player => player.getMarker() === marker);

        if (playerExist) {
            return playerExist.getColor();
        }
        return "";
    };

    const switchPlayerOrder = () => {

        // Every time we switch the order, we toggle the startFrom variable;
        // Then the currentPlayerNum will the startFrom variable initially
        startFrom = (startFrom + 1) % 2;
        currentPlayerNum = startFrom;

    }

    return {
        addPlayer,
        getPlayer,
        getAllPlayers,
        getColorByMarker,
        setWinner,
        getWinner,
        switchPlayerTurn,
        switchPlayerOrder,
        clearPlayers,
        getActivePlayer,
        getActivePlayerIndex,
    }
}

function ErrorsManager() {
    const cellOutOfBound = "Cell position is out of bound.";
    const cellMarked = "Cell has been marked. Please select other cells.";
    const noPlayers = "Insufficient players. Create at least 2 players first";
    const exceedPlayers = "Too many players!"
    const emptyNameInput = "Did you forget to enter a name??"
    const duplicateName = "Name has been taken. Try another one?"

    let errorMessage = "";

    const getCellOutOfBoundError = () => cellOutOfBound;
    const getCellMarkedError = () => cellMarked;
    const getInsufficentPlayersError = () => noPlayers;
    const getEmptyNameInput = () => emptyNameInput;
    const getExceedPlayersError = () => exceedPlayers;
    const getDuplicateNameError = () => duplicateName;
    const set = (msg) => errorMessage = msg;
    const get = () => errorMessage;

    return {
        getCellOutOfBoundError,
        getCellMarkedError,
        getInsufficentPlayersError,
        getEmptyNameInput,
        getExceedPlayersError,
        getDuplicateNameError, 
        set,
        get,
    }
}

// MVC
function GameModel() {
    // For checking the win condition later
    const STRAIGHTS = {
        topHorizontal: [[0, 0], [0, 1], [0, 2]],
        midHorizontal: [[1, 0], [1, 1], [1, 2]],
        btmHorizontal: [[2, 0], [2, 1], [2, 2]],
        leftVertical: [[0, 0], [1, 0], [2, 0]],
        midVertical: [[0, 1], [1, 1], [2, 1]],
        rightVertical: [[0, 2], [1, 2], [2, 2]],
        l2rDiagonal: [[0, 0], [1, 1], [2, 2]],
        r2lDiagonal: [[0, 2], [1, 1], [2, 0]],
    }

    let endRound = false;
    let wantToContinue = false;
    let winOrientation = ""; 


    const gameBoard = GameBoard();
    const playersManager = PlayersManager();
    const errorsManager = ErrorsManager();

    const getPlayersManagerObj = () => playersManager;
    const getErrorsManagerObj = () => errorsManager;
    const hasRoundEnd = () => endRound;
    const setRoundEnd = (hasRoundEnd) => endRound = hasRoundEnd;

    const start = () => {
        playersManager.addPlayer();
        playersManager.addPlayer();
    }

    const getGameBoardObj = () => gameBoard;
    const getWinOrientation = () => winOrientation; 

    const markCell = (player, cellPosition) => {

        console.log(`Logger: ${player.getNickname()} plays ${player.getMarker()} at row ${cellPosition[0]}, column ${cellPosition[1]}....`);

        gameBoard.getCell(cellPosition).setMarker(player.getMarker());
        gameBoard.decreaseAvailableCells();
        gameBoard.print();
    }

    const isStraight = (playerMarker) => {
        let allSameMarker;

        // Check if the markers array are all the same as playerMarker forming a straight line
        for (key in STRAIGHTS) {
            allSameMarker = STRAIGHTS[key].map(cellPos => gameBoard.getCell(cellPos).getMarker()).every(marker => marker === playerMarker);

            if (allSameMarker) {
                winOrientation = key;  
                break;
            }
        }

        if (allSameMarker) {
            return true;
        }

        return false;
    }

    const askIfContinue = () => {
        let userInput;

        while (!userInput || (userInput && userInput !== "y" && userInput !== "n")) {
            userInput = prompt("Do you want to continue? (y/n)", "y");
        }
        return userInput === "y" ? true : false;
    }

    const reset = (chooseToContinue) => {
        gameBoard.reset();
        wantToContinue = chooseToContinue;
        if (chooseToContinue) {
            playersManager.switchPlayerOrder();
            return;
        }
        playersManager.clearPlayers();

    }

    const chooseContinue = () => wantToContinue;

    const win = (player) => {
        player.win();
        playersManager.setWinner(player);

        console.log(`Logger: ${player.getNickname()} WINS this round.`);
        console.log(`Logger: ${playersManager.getAllPlayers()[0].getNickname()} : ${playersManager.getAllPlayers()[0].getScore()}`);
        console.log(`Logger: ${playersManager.getAllPlayers()[1].getNickname()} : ${playersManager.getAllPlayers()[1].getScore()}`);
    }

    const draw = () => {
        playersManager.setWinner(null);
        console.log(`Logger: This round is a DRAW.`);
        console.log(`Logger: ${playersManager.getAllPlayers()[0].getNickname()} : ${playersManager.getAllPlayers()[0].getScore()}`);
        console.log(`Logger: ${playersManager.getAllPlayers()[1].getNickname()} : ${playersManager.getAllPlayers()[1].getScore()}`);
    }

    const endTurnTest = () => {
        let currentPlayer = playersManager.getActivePlayer();

        if (isStraight(currentPlayer.getMarker())) {
            win(currentPlayer);
            reset(askIfContinue());
            return;
        }

        if (gameBoard.isFull()) {
            draw();
            reset(askIfContinue());
            return;
        }

        playersManager.switchPlayerTurn();

    }

    const endTurn = () => {
        let currentPlayer = playersManager.getActivePlayer();
        if (isStraight(currentPlayer.getMarker())) {
            win(currentPlayer);
            setRoundEnd(true);
            return;
        }

        if (gameBoard.isFull()) {
            draw();
            setRoundEnd(true);
            return;
        }

        setRoundEnd(false);
        playersManager.switchPlayerTurn();
    }

    const play = (cellPosition) => {
        let currentPlayer = playersManager.getActivePlayer();

        if (!playersManager.getAllPlayers() || playersManager.getAllPlayers().length < 2) {
            errorsManager.set(errorsManager.getInsufficentPlayersError());
            console.log(errorsManager.getInsufficentPlayersError());
            return;
        }

        if (gameBoard.isOutOfBound(cellPosition)) {
            errorsManager.set(errorsManager.getCellOutOfBoundError());
            console.log(errorsManager.getCellOutOfBoundError());
            return;
        }

        if (!gameBoard.isCellEmpty(cellPosition)) {
            errorsManager.set(errorsManager.getCellMarkedError());
            console.log(errorsManager.getCellMarkedError());
            return;
        }

        markCell(currentPlayer, cellPosition);
        endTurn();
    }


    // Call initialiser API
    // start(); 

    return {
        play,
        start,
        endTurn,
        reset,
        chooseContinue,
        getPlayersManagerObj,
        getErrorsManagerObj,
        getGameBoardObj,
        hasRoundEnd,
        getWinOrientation, 
    }
}

function GameView() {
    const { scrollTowards } = MainView();
    const header = HeaderView();
    const playerInput = PlayerInputView();
    const error = ErrorView();
    const gameBoard = GameboardView();
    const endTurn = EndTurnView();

    return {
        header,
        error,
        gameBoard,
        playerInput,
        endTurn,
        scrollTowards,
    }
}

function MainView() {
    const dsMain = document.querySelector("#main");
    const dpSlide = Array.from(dsMain.querySelectorAll(".full-screen"));


    const scrollTowards = (scrollSnapIndex) => {
        dpSlide[scrollSnapIndex].scrollIntoView({ behavior: "smooth" });
    }

    return {
        dsMain,
        scrollTowards,
    }
}

function HeaderView() {
    const { dsMain, scrollTowards } = MainView();
    const order = 0;

    const dsHeaderBox = document.querySelector("#header");
    const dsVideo = dsHeaderBox.querySelector("video");
    const dsIntroContainer = dsHeaderBox.querySelector("#intro-container");
    const dsStartGameButton = dsIntroContainer.querySelector(".btn-container button");

    return {
        dsStartGameButton,
    }
}

function PlayerInputView() {
    const { dsMain, scrollTowards } = MainView();

    const dsWrapper = document.querySelector("#player-input");
    const dsLabel = dsWrapper.querySelector("label");
    const dsInput = dsWrapper.querySelector("input");
    const dsSubmitButton = dsWrapper.querySelector("button");
    const waitAgent = WaitAgent();
    const typeWriter = TypeWriter(40);  

    const order = 1;

    const getInputVal = () => dsInput.value;
    const resetInput = () => dsInput.value = "";
    const setInputColor = (color) => dsInput.style.color = color;
    const resetLabel = () => dsLabel.textContent = "";
    const getOrder = () => order;
    const setPlaceholder = (placeholder) => {
        dsInput.placeholder = placeholder;
    }
    const hideInputs = (hide) => {
        if (hide) {
            dsInput.classList.add("hide")
            dsSubmitButton.classList.add("hide");
            return;
        }

        dsInput.classList.remove("hide")
        dsSubmitButton.classList.remove("hide");
    }

    const prepareInputs = (numPlayers, firstPlayerName, secondPlayerName, callBack) => {
        waitAgent.wait(100, () => {
            hideInputs(true);
            resetLabel();
            resetInput();
            if (numPlayers === 0) {
                setPlaceholder("Enter first player's name");
                setInputColor("green");
                typeWriter.type("Hello there. Who are you?", dsLabel, () => {
                    waitAgent.wait(10, () => {
                        hideInputs(false);
                    })
                })
            }
            else if (numPlayers === 1) {
                setPlaceholder("Enter second player's name");
                setInputColor("blue");
                typeWriter.type(`Hello ${firstPlayerName ? firstPlayerName : ""}. Who dares to challenge you?`, dsLabel, () => {
                    waitAgent.wait(10, () => {
                        hideInputs(false);
                    })
                })
            }
            else {
                typeWriter.type(`Looks like we are all set! It's ${firstPlayerName ? firstPlayerName : "Error getting first name."} vs ${secondPlayerName ? secondPlayerName : "Error getting second name."}!!`, dsLabel, () => {
                    if (callBack) callBack();

                    waitAgent.wait(700, () => {
                        scrollTowards(getOrder() + 1); 
                    })
                })
            }
        })
    }

    const removeSubmitButtonListener = (callBackToRemove) => {
        dsSubmitButton.removeEventListener("click", callBackToRemove); 
    }

    const addSubmitButtonListener = (callBack) => {
        dsSubmitButton.addEventListener("click", callBack);
    }

    return {
        dsSubmitButton,
        dsLabel,
        getInputVal,
        prepareInputs,
        getOrder,
        scrollTowards,
        removeSubmitButtonListener,
        addSubmitButtonListener,  
    }
}

function GameboardView() {
    const { ROWS, COLS } = BoardDimension();
    const boardViewArr = [];
    const dsGameboard = document.querySelector("#gameboard");
    const dsStartButton = dsGameboard.querySelector("#actual-start");
    const dsActualBoard = dsGameboard.querySelector("#board .wrapper");
    const dsVersus = dsGameboard.querySelector(".versus");
    const dlVersusCols = Array.from(dsVersus.querySelectorAll(".col"));
    const dlPlayerNames = Array.from(dsVersus.querySelectorAll(".name"));
    const dlPlayerScores = Array.from(dsVersus.querySelectorAll(".score"));

    const straightLine = StraightLineView(dsActualBoard); 

    const clickStartButton = () => dsStartButton.click();

    const createBoard = () => {
        let i = 0;
        let j = 0;
        for (i = 0; i < ROWS; i++) {
            for (j = 0; j < COLS; j++) {
                boardViewArr.push(CellView(i, j, dsActualBoard));
            }
        }

        straightLine.create(); 
    }

    const getStraightLine = () => straightLine; 

    const getAllCells = () => boardViewArr;
    const getCell = (cellPosition) => boardViewArr.find(eachCell => eachCell.getRow() === cellPosition[0] && eachCell.getCol() === cellPosition[1]);
    const removeCellsListener = (callBackToRemove) => {
        boardViewArr.forEach(cell => {
            cell.getButton().removeEventListener("click", callBackToRemove); 
        })
    }
    const addCellsListener = (callBack) => {
        boardViewArr.forEach(cell => {
            cell.getButton().addEventListener("click", callBack); 
        })
    }
    const setVersusColsColor = (activePlayerNum, colors) => {
        dlVersusCols.forEach((eachCol, index) => {
            eachCol.className = "";
            eachCol.classList.add("col");

            if (index === activePlayerNum) {
                eachCol.classList.add(colors[index]);
                return;
            }

            eachCol.classList.add("disabled");
        })
    }

    const setVersusName = (names) => {
        dlPlayerNames.forEach((nameEl, index) => nameEl.textContent = names[index]);
    }

    const setVersusScores = (scores) => {
        dlPlayerScores.forEach((scoreEl, index) => scoreEl.textContent = scores[index]);
    }

    const renderVersusCols = (activePlayerNum, colors, names, scores) => {
        setVersusColsColor(activePlayerNum, colors);
        setVersusName(names);
        setVersusScores(scores);
    }

    const clearVersusCols = () => {
        setVersusName("");
        setVersusScores("");

        dlVersusCols.forEach(eachCol => {
            eachCol.className = "";
            eachCol.classList.add("col");
        })
    }

    const clearBoard = () => {
        // Clear all cells, including straight line 
        while (dsActualBoard.firstChild) {
            dsActualBoard.removeChild(dsActualBoard.firstChild); 
        }

        boardViewArr.length = 0;
    }

    const restart = () => {
        clearVersusCols();
        clearBoard();
    }

    const renderBoard = (modelBoard, activeColor, playersManagerObj) => {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                let cellPos = [i, j];
                let cell = modelBoard[i][j];
                let modelMarker = cell.getMarker();
                let markerColor = playersManagerObj.getColorByMarker(modelMarker);

                if (modelMarker === "") {
                    getCell(cellPos).render(modelMarker, activeColor);
                }
                else {
                    getCell(cellPos).render(modelMarker, markerColor);
                }

            }
        }
    }

    return {
        clickStartButton,
        getCell,
        getAllCells,
        removeCellsListener,
        addCellsListener, 
        getStraightLine,
        createBoard,
        renderVersusCols,
        renderBoard,
        restart,
        dsStartButton,
        dsActualBoard,
    }
}

function StraightLineView (dsActualBoard) {
    const els = document.createElement("div");

    const create = () => {
        clearClass(); 
        hide(); 
        dsActualBoard.appendChild(els);  
        
    }

    const clearClass = () => {
        els.className = "";
        els.classList.add("long-straight"); 
    }

    const hide = () => {
        els.classList.add("hide"); 
    }

    const show = () => {
        els.classList.remove("hide"); 
    }

    const setOrientation = (orientation) => {
        els.classList.add(orientation);
    }

    const setColor = (color) => {
        els.classList.add(color); 
    }

    const renderWin = (orientation, color) => {
        if (!color) {
            return; 
        }

        if (orientation === "" || !orientation) {
            return; 
        }

        setOrientation(orientation);
        setColor(color);
        show(); 
    }

    const renderContinue = () => {
        clearClass();
        hide(); 
    }

    return {
        create, 
        renderWin,
        renderContinue, 
    }
}

function CellView(r, c, dsActualBoard) {
    const els = document.createElement("div");
    const row = r;
    const col = c;

    const createCellTemplate = () => {
        const playShapeButton = document.createElement("button");

        // For easier passing of data
        playShapeButton.dataset.row = row;
        playShapeButton.dataset.col = col;

        playShapeButton.classList.add("unset");
        playShapeButton.classList.add("green");
        els.appendChild(playShapeButton);
        els.classList.add("cell"); 
        dsActualBoard.appendChild(els);
    }

    const setMarker = (marker) => getButton().textContent = marker;
    const setCell = () => {
        getButton().classList.add("set");
    }
    const unsetCell = () => {
        getButton().classList.add("unset");
    }

    const setCellColor = (color) => {
        getButton().classList.add(color);
    }

    const resetCell = () => {
        getButton().textContent = "";
        getButton().className = "unset";
    }

    const removeClass = () => {
        getButton().className = "";
    }

    const render = (marker, color) => {
        if (marker === "") {
            setMarker(marker);
            removeClass();
            unsetCell();
            setCellColor(color);
            return;
        }

        setMarker(marker);
        removeClass();
        setCell();
        setCellColor(color);
    }


    const getButton = () => els.querySelector("button");
    const get = () => els;
    const getRow = () => row;
    const getCol = () => col;


    createCellTemplate();

    return {
        get,
        getButton,
        getRow,
        getCol,
        setMarker,
        setCell,
        unsetCell,
        setCellColor,
        resetCell,
        removeClass,
        render,
    }
}

function ErrorView() {
    const dsError = document.querySelector("#error");
    const dsErrorMsg = dsError.querySelector(".msg");
    const dsErrorCloseBtn = dsError.querySelector("button");

    const closeModal = () => dsError.classList.add("hide");
    const showModal = () => dsError.classList.remove("hide");
    const setMessage = (errorMessage) => dsErrorMsg.textContent = errorMessage;

    dsErrorCloseBtn.addEventListener("click", closeModal);

    return {
        showModal,
        setMessage,
    }
}

function EndTurnView() {
    const dsEndTurn = document.querySelector("#endturn");
    const dsContinueButton = dsEndTurn.querySelector(".continue button");
    const dsRestartButton = dsEndTurn.querySelector(".restart button");
    const dsWinnerName = dsEndTurn.querySelector("#winner-round");
    const dsMessage = dsEndTurn.querySelector(".round-message .message");

    const MESSAGES = {
        WIN: " WINS this round! Wanna continue?",
        DRAW: "This round is a DRAW. Wanna continue?"
    }

    const closeModal = () => dsEndTurn.classList.add("hide");
    const showModal = () => dsEndTurn.classList.remove("hide");
    const renderRoundMessage = (winner) => {
        if (!winner) {
            dsWinnerName.textContent = "";
            dsWinnerName.className = "";

            dsMessage.textContent = MESSAGES.DRAW;
            return;
        }
        dsWinnerName.textContent = winner.getNickname();
        dsWinnerName.className = "";
        dsWinnerName.classList.add(winner.getColor());

        dsMessage.textContent = MESSAGES.WIN;
    }

    return {
        dsContinueButton,
        dsRestartButton,
        showModal,
        closeModal,
        renderRoundMessage,
    }
}



const gameController = (function GameController() {
    const gameModel = GameModel();
    const gameView = GameView();
    const typeWriter = TypeWriter(50);
    const waitAgent = WaitAgent();
    const { ROWS, COLS } = BoardDimension();

    const performLogic = [];
    const render = [];

    // Error 
    const performErrorLogic = (errorMessage) => {
        gameModel.getErrorsManagerObj().set(errorMessage);
    }
    const renderError = () => {
        if (gameModel.getErrorsManagerObj().get() === "") {
            return;   
        }
        
        gameView.error.setMessage(gameModel.getErrorsManagerObj().get());
        gameView.error.showModal();
        gameModel.getErrorsManagerObj().set(""); 
    }

    // Listener
    const _startGame = (event) => {

        gameView.scrollTowards(1); // scroll to next slide  
        gameView.playerInput.prepareInputs(0);

    }

    const _addPlayer = (event) => {
        let varName = Object.keys({ _addPlayer })[0].slice(1); // Get the variable name  
        let playerName = gameView.playerInput.getInputVal();

        // Validation 
        if (playerName === "") {
            performErrorLogic(gameModel.getErrorsManagerObj().getEmptyNameInput());
            renderError();
            return;
        }

        if (gameModel.getPlayersManagerObj().getAllPlayers().length === 2) {
            performErrorLogic(gameModel.getErrorsManagerObj().getExceedPlayersError());
            renderError();
            return;
        }

        if (gameModel.getPlayersManagerObj().getAllPlayers().length > 0) {
            if (playerName === gameModel.getPlayersManagerObj().getPlayer(0).getNickname()) {
                performErrorLogic(gameModel.getErrorsManagerObj().getDuplicateNameError());
                renderError();
                return;
            }
        }

        performLogic.find(obj => obj.name === varName).logic(playerName);
        render.find(obj => obj.name === varName).logic(playerName);
    }

    const _startTTT = (event) => {
        console.log("starting ttt");  
        let activePlayerIndex = gameModel.getPlayersManagerObj().getActivePlayerIndex();
        let playerColors = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getColor());
        let playerNames = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getNickname());
        let playerScores = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getScore());

        if (gameView.gameBoard.getAllCells().length > 0) {
            return;
        }

        // Create the board, then add the listener
        gameView.gameBoard.renderVersusCols(activePlayerIndex, playerColors, playerNames, playerScores);
        gameView.gameBoard.createBoard();
        gameView.gameBoard.addCellsListener(_play); 
    }

    const _play = (event) => {
        let varName = Object.keys({ _play })[0].slice(1); // Get the variable name  
        
        performLogic.find(obj => obj.name === varName).logic(event);

        if (gameModel.getErrorsManagerObj().get() !== "") {
            renderError(); 
            return; 
        }
        
        render.find(obj => obj.name === varName).logic();
    }

    const _continue = (event) => {
        let varName = Object.keys({ _continue })[0].slice(1); // Get the variable name  
        performLogic.find(obj => obj.name === varName).logic(event);
        render.find(obj => obj.name === varName).logic();
    }

    const _restart = (event) => {
        let varName = Object.keys({ _restart })[0].slice(1); // Get the variable name  
        performLogic.find(obj => obj.name === varName).logic(event);
        render.find(obj => obj.name === varName).logic();
    }

    // Logic and render
    performLogic.push({
        name: "addPlayer",
        logic: function (playerName) {
            gameModel.getPlayersManagerObj().addPlayer(playerName);
        }
    });

    performLogic.push({
        name: "play",
        logic: function (event) {
            // Get the row and col from button click
            let buttonClicked = event.currentTarget;
            let row = buttonClicked.dataset.row;
            let col = buttonClicked.dataset.col;

            gameModel.play([row, col]);
        }
    })

    performLogic.push({
        name: "continue",
        logic: function (event) {
            gameModel.reset(true);
        }
    })

    performLogic.push({
        name: "restart",
        logic: function (event) {
            gameModel.reset(false);
        }
    })

    render.push({
        name: "addPlayer",
        logic: function () {

            if (gameModel.getPlayersManagerObj().getAllPlayers().length === 1) {
                gameView.playerInput.prepareInputs(1, gameModel.getPlayersManagerObj().getActivePlayer().getNickname());
            }
            else {
                gameView.playerInput.prepareInputs(2, gameModel.getPlayersManagerObj().getAllPlayers()[0].getNickname(), gameModel.getPlayersManagerObj().getAllPlayers()[1].getNickname(), gameView.gameBoard.clickStartButton);
            }
        }
    })

    render.push({
        name: "play",
        logic: function () {
            let board = gameModel.getGameBoardObj().get();
            let activeColor = gameModel.getPlayersManagerObj().getActivePlayer().getColor();
            let activePlayerIndex = gameModel.getPlayersManagerObj().getActivePlayerIndex();
            let playerColors = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getColor());
            let playerNames = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getNickname());
            let playerScores = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getScore());
            let playersManagerObj = gameModel.getPlayersManagerObj();
            let winner = gameModel.getPlayersManagerObj().getWinner();
            let winOrientation = gameModel.getWinOrientation(); 

            // Render the board
            gameView.gameBoard.renderBoard(board, activeColor, playersManagerObj);


            // Render versus columns
            gameView.gameBoard.renderVersusCols(activePlayerIndex, playerColors, playerNames, playerScores);

            // Check if round truly ends. If yes, show the endturn modal
            if (gameModel.hasRoundEnd()) {
                if (winner) {
                    gameView.gameBoard.getStraightLine().renderWin(winOrientation, winner.getColor()); 
                }
                gameView.gameBoard.removeCellsListener(_play); // Remove all listeners to prevent further clicking 

                waitAgent.wait(1000, () =>  {
                    gameView.endTurn.renderRoundMessage(gameModel.getPlayersManagerObj().getWinner());
                    gameView.endTurn.showModal();
                })
            }
        }
    })

    render.push({
        name: "continue",
        logic: function () {
            let board = gameModel.getGameBoardObj().get();
            let activeColor = gameModel.getPlayersManagerObj().getActivePlayer().getColor();
            let playersManagerObj = gameModel.getPlayersManagerObj();
            let activePlayerIndex = gameModel.getPlayersManagerObj().getActivePlayerIndex();
            let playerColors = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getColor());
            let playerNames = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getNickname());
            let playerScores = gameModel.getPlayersManagerObj().getAllPlayers().map(player => player.getScore());

            gameView.endTurn.closeModal();
            gameView.gameBoard.renderBoard(board, activeColor, playersManagerObj);
            gameView.gameBoard.getStraightLine().renderContinue(); 
            gameView.gameBoard.renderVersusCols(activePlayerIndex, playerColors, playerNames, playerScores);

            gameView.gameBoard.addCellsListener(_play); // Add back the event listener
        }
    })

    render.push({
        name: "restart",
        logic: function () {
            gameView.endTurn.closeModal();
            gameView.gameBoard.restart(); 
            gameView.scrollTowards(0);
        }
    })

    gameView.header.dsStartGameButton.addEventListener("click", _startGame);
    gameView.playerInput.dsSubmitButton.addEventListener("click", _addPlayer);
    gameView.gameBoard.dsStartButton.addEventListener("click", _startTTT);
    gameView.endTurn.dsContinueButton.addEventListener("click", _continue);
    gameView.endTurn.dsRestartButton.addEventListener("click", _restart);
})();

// Utilities

function TypeWriter(speed) {
    const typeSpeed = speed;

    const type = (messageToType, domElement, callBackUponCompleteTyping) => {
        let i = 0;
        if (messageToType === "") {
            return;
        }

        const interval = setInterval(() => {
            if (i < messageToType.length) {
                domElement.textContent += messageToType.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                if (callBackUponCompleteTyping) callBackUponCompleteTyping();
            }
        }, typeSpeed);
    }

    return {
        type,
    }
}

function WaitAgent() {
    const wait = (waitHowLong, callBackUponWait) => {
        let id = setTimeout(() => {
            clearInterval(id);
            callBackUponWait();
        }, waitHowLong);
    }

    return {
        wait,
    }
}

function BoardDimension() {
    const ROWS = 3;
    const COLS = 3;

    return {
        ROWS,
        COLS,
    }
}
 