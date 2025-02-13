// MVC
function GameModel() {
    // For checking the win condition later
    const STRAIGHTS = {
        topHorizontal: [[0,0],[0,1],[0,2]],
        midHorizontal: [[1,0],[1,1],[1,2]],
        btmHorizontal: [[2,0],[2,1],[2,2]],
        topVertical:   [[0,0],[1,0],[2,0]],
        midVertical:   [[0,1],[1,1],[2,1]],
        btmVertical:   [[0,2],[1,2],[2,2]],
        l2rDiagonal:   [[0,0],[1,1],[2,2]],
        r2lDiagonal:   [[0,2],[1,1],[2,0]],
    }


    const gameBoard = GameBoard();
    const playersManager = PlayersManager();
    const errorsManager = ErrorsManager(); 

    const start = () => {
        playersManager.addPlayer();
        playersManager.addPlayer(); 
    }

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
        return userInput === "y"? true : false; 
    }

    const reset = (chooseToContinue) => {
        gameBoard.reset();
        if (chooseToContinue) {
            playersManager.switchPlayerOrder();
            return; 
        }
        playersManager.clearPlayers(); 

    }

    const win = (player) => {
        player.win(); 

        console.log(`Logger: ${player.getNickname()} WINS this round.`);
        console.log(`Logger: ${playersManager.getAllPlayers()[0].getNickname()} : ${playersManager.getAllPlayers()[0].getScore()}`);
        console.log(`Logger: ${playersManager.getAllPlayers()[1].getNickname()} : ${playersManager.getAllPlayers()[1].getScore()}`);
    }

    const draw = () => {
        console.log(`Logger: This round is a DRAW.`);
        console.log(`Logger: ${playersManager.getAllPlayers()[0].getNickname()} : ${playersManager.getAllPlayers()[0].getScore()}`);
        console.log(`Logger: ${playersManager.getAllPlayers()[1].getNickname()} : ${playersManager.getAllPlayers()[1].getScore()}`); 
    }

    const endTurn = () => {
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

    const play = (cellPosition) => {
        let currentPlayer = playersManager.getActivePlayer();

        if (!playersManager.getAllPlayers() || playersManager.getAllPlayers().length < 2) { 
            console.log(errorsManager.getInsufficentPlayersError());  
            return; 
        }

        if (gameBoard.isOutOfBound(cellPosition)) {
            console.log(errorsManager.getCellOutOfBoundError());
            return;
        }

        if (!gameBoard.isCellEmpty(cellPosition)) {
            console.log(errorsManager.getCellMarkedError()); 
            return;
        }
        
        markCell(currentPlayer, cellPosition);
        endTurn(); 
    }


    // Call initialiser API
    // start(); 

    return {
        gameBoard,
        playersManager,
        play,
        start,
    }
}

function GameView() {

}


function GameBoard() {
    const DIMENSION = {
        ROWS: 3,
        COLS: 3,
    }
    let board = [];
    let availableCells = DIMENSION.ROWS * DIMENSION.COLS; 

    // Closures
    const createBoard = () => {
        for (let i = 0; i < DIMENSION.ROWS; i++) {
            board.push([]);
            for (let j = 0; j < DIMENSION.ROWS; j++) {
                board[i].push(BoardCell());
            }
        }

        availableCells = DIMENSION.ROWS * DIMENSION.COLS; 
    }

    const get = () => board;
    const print = () => console.log(board.map(row => row.map(col => col.getMarker())));
    const getDimension = () => DIMENSION;
    const getCell = (cellPosition) => board[cellPosition[0]][cellPosition[1]];
    const isCellEmpty = (cellPosition) => board[cellPosition[0]][cellPosition[1]].isCellEmpty();
    const isFull = () => availableCells === 0; 
    const isOutOfBound = (cellPosition) => cellPosition[0] > getDimension().ROWS - 1 ? true : cellPosition[1] > getDimension().COLS - 1 ? true : false;
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

    const setMarker = (playerNum) => marker = playerNum === 0 ? "O" : "X"; // First player get "O", second player get "X"
    const getMarker = () => marker;
    const getNickname = () => nickname;
    const win = () => score++;
    const getScore = () => score;
    const setScore = (playerScore) => score = playerScore; 

    return {
        setMarker,
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
 
    const addPlayer = (playerName) => {
        let nickname = playerName; 
        if (isEnoughPlayers()) {
            console.log("Already have sufficient players");
            return;
        }

        if (!nickname) {
            nickname = askPlayerName();
        }

        players.push(Player(nickname));
        players.at(-1).setMarker(players.length - 1);
    }
 
    const getAllPlayers = () => players;
    const askPlayerName = () => prompt("What is your nickname?");
    const isEnoughPlayers = () => players.length === 2 ? true : false;
    const switchPlayerTurn = () => currentPlayerNum = (currentPlayerNum + 1) % 2;  
    const getActivePlayer = () => players[currentPlayerNum];
    const clearPlayers = () => {
        players.length = 0;
        currentPlayerNum = 0; 
    }

    const switchPlayerOrder = () => {
        // Store name and score in the temporary variables
        let player0Name = players[0].getNickname();
        let player1Name = players[1].getNickname(); 
        let player0Score = players[0].getScore();
        let player1Score = players[1].getScore();

        clearPlayers(); 

        // Swap the players. now player 0 will become the second player 
        addPlayer(player1Name);
        addPlayer(player0Name);

        // Assign score
        players[0].setScore(player1Score);
        players[1].setScore(player0Score); 

    }

    return {
        addPlayer,
        getAllPlayers,
        switchPlayerTurn,
        switchPlayerOrder, 
        clearPlayers,
        getActivePlayer, 
    }
}

function ErrorsManager() {
    const cellOutOfBound = "Cell position is out of bound.";
    const cellMarked = "Cell has been marked. Please select other cells."; 
    const noPlayers = "Insufficient players. Create at least 2 players first";

    const getCellOutOfBoundError = () => "ERROR: " + cellOutOfBound;
    const getCellMarkedError = () => "ERROR: " + cellMarked; 
    const getInsufficentPlayersError = () => "ERROR: " + noPlayers;

    return {
        getCellOutOfBoundError,
        getCellMarkedError,
        getInsufficentPlayersError,  
    }
}

const gameController = (function GameController() {
    const gameModel = GameModel();
    const gameView = GameView();

    return {
        gameModel,
    }
})();

console.log(gameController);  