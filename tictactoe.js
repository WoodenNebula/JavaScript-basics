function randomNum() {
    let rand = null;
    do {
        rand = Math.floor(Math.random() * 10);
    } while (rand > 8 || !g_BoardStates.playableCells.includes(rand));
    return rand;
}


const g_BoardStates = {
    cellLayout: getBoard(),
    playableCells: Array(9),
    players: {
        bot: null,
        playerOneSym: 'X',
        playerTwoSym: 'O',
    },
    turnOfPlayer: this.playerOneSym,
    winner: null,
    gameRunning: false,
}


function getBoard() {
    let board = [];
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            board.push(document.getElementById(`r${row}c${column}`));
        }
    }
    return board;
};


function updateBoard() {
    g_BoardStates.cellLayout = getBoard();
}


function setPlayerOneSymbol(playerOneSymbol) {
    if (g_BoardStates.players.playerOneSym !== playerOneSymbol) {
        g_BoardStates.players.playerTwoSym = g_BoardStates.players.playerOneSym;
        g_BoardStates.players.playerOneSym = playerOneSymbol;
    }
}

function playPlayerOne(pos) {
    if (!g_BoardStates.pvp && g_BoardStates.players.playerOneSym === g_BoardStates.players.bot) {
        return playBot();
    } else {
        return playCellAs(pos, g_BoardStates.players.playerOneSym);
    }

}

function playPlayerTwo(pos) {
    if (!g_BoardStates.pvp && g_BoardStates.players.playerTwoSym === g_BoardStates.players.bot) {
        return playBot();
    } else if (g_BoardStates.playableCells.includes(pos)) {
        return playCellAs(pos, g_BoardStates.players.playerTwoSym);
    }
}

function playBot() {
    return playCellAs(randomNum(), g_BoardStates.players.bot);
}

function handleCellClick(pos) {
    switch (g_BoardStates.turnOfPlayer) {
        case g_BoardStates.players.playerOneSym:
            if (playPlayerOne(pos)) {
                if (gameEnded()) {
                    declareWinner();
                    resetGame();
                }
                else if (playPlayerTwo(pos)) {
                    if (gameEnded()) {
                        declareWinner();
                        resetGame();
                    }
                }
            }
            break;
        case g_BoardStates.players.playerTwoSym:
            if (playPlayerTwo(pos)) {
                if (gameEnded()) {
                    declareWinner();
                    resetGame();
                }
                else if (playPlayerOne(pos)) {
                    if (gameEnded()) {
                        declareWinner();
                        resetGame();
                    }
                }
            }
            break;
        default:
            break;
    }
}


function attachEvents(cell) {
    cell.addEventListener("click", () => {
        if (g_BoardStates.gameRunning) {
            const pos = parseInt(cell.id[1]) * 3 + parseInt(cell.id[3]);
            handleCellClick(pos);
        }
    });

    const originalBgColor = cell.style.background;
    cell.addEventListener("mouseover", () => {
        if (g_BoardStates.playableCells.includes(parseInt(cell.id[1]) * 3 + parseInt(cell.id[3]))) {
            cell.style.background = "#3f7898";
        }
    });

    cell.addEventListener("mouseout", () => {
        cell.style.background = originalBgColor;
    })
}

function flipPlayerTurn(currentPlayer) {
    g_BoardStates.turnOfPlayer = currentPlayer === g_BoardStates.players.playerOneSym ?
        g_BoardStates.players.playerTwoSym : g_BoardStates.players.playerOneSym;

    document.getElementById("current-player").textContent = `Playing: ${g_BoardStates.turnOfPlayer}`;
}


function playCellAs(cellIndex, playerSymbol) {
    if (g_BoardStates.playableCells.includes(cellIndex)) {
        if (g_BoardStates.turnOfPlayer === playerSymbol) {
            g_BoardStates.playableCells.playAt(cellIndex, playerSymbol);
            updateBoard();
            flipPlayerTurn(playerSymbol);
            return true;
        }
    }
    return false;
}


function initializeBoard() {
    const selectedGamemode = document.getElementById("gamemode-selection");


    if (selectedGamemode.value === "pvp") {
        g_BoardStates.pvp = true;
    } else { g_BoardStates.pvp = false; }


    g_BoardStates.playableCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    g_BoardStates.cellLayout.forEach(cell => { cell.textContent = ''; });

    g_BoardStates.turnOfPlayer = g_BoardStates.players.playerOneSym;
    if (!g_BoardStates.pvp) {
        g_BoardStates.players.bot = g_BoardStates.players.playerTwoSym;
    }
    g_BoardStates.turnOfPlayer = g_BoardStates.players.playerOneSym;

    g_BoardStates.playableCells.playAt = (cellIndex, playerSymbol) => {
        g_BoardStates.cellLayout[cellIndex].textContent = playerSymbol;
        g_BoardStates.cellLayout[cellIndex].style.color =
            (playerSymbol === g_BoardStates.players.playerOneSym) ? "#FFFFFF" : "#483434";
        g_BoardStates.playableCells.splice(g_BoardStates.playableCells.indexOf(cellIndex), 1);
    }
}


function resetGame() {
    g_BoardStates.gameRunning = false;

    document.getElementById("current-player").hidden = false;

    replayBtn.textContent = "Replay";
    replayBtn.hidden = false;

    replayBtn.addEventListener("click", () => {
        const winnerArea = document.getElementById("winner");
        winnerArea.hidden = true;
        winnerArea.textContent = '';
        g_BoardStates.winner = null;
        startGame();
    });
}

function gameEnded() {
    const gameVerifier = (matchPatterns) => {
        let gameFinished = matchPatterns.some((indices) => {
            let cellEntries = [];

            indices.forEach((index) => {
                cellEntries.push(g_BoardStates.cellLayout[index].textContent);
            });

            if (cellEntries[0] === cellEntries[1] &&
                cellEntries[1] === cellEntries[2] &&
                (cellEntries[1] === g_BoardStates.players.playerOneSym
                    || cellEntries[1] === g_BoardStates.players.playerTwoSym)) {
                g_BoardStates.winner = cellEntries[1];
                return true;
            } else {
                return false;
            }
        });

        return gameFinished;
    }

    const rowIndices = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const columnIndices = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    const diagonalIndices = [[0, 4, 8], [2, 4, 6]];

    if (gameVerifier(rowIndices) ||
        gameVerifier(columnIndices) ||
        gameVerifier(diagonalIndices) ||
        g_BoardStates.playableCells.length === 0) {
        return true;
    } else {
        return false;
    }
}

function declareWinner() {
    const declareArea = document.getElementById("winner");
    const gameModeSelector = document.getElementById("gamemode-container");
    const currentPlayer = document.getElementById("current-player");

    currentPlayer.textContent = ''
    gameModeSelector.hidden = false;
    declareArea.hidden = false;

    if (g_BoardStates.winner != null) {
        for (let player in g_BoardStates.players) {
            if (!g_BoardStates.pvp && g_BoardStates.winner == g_BoardStates.players.bot) {
                declareArea.style.color = g_BoardStates.players.bot === g_BoardStates.players.playerOneSym ? '#FFFFFF' : "#886464";
                declareArea.innerText = "Winner is BOT";
            } else if (g_BoardStates.players[player] === g_BoardStates.winner) {
                declareArea.style.color = g_BoardStates.players[player] === g_BoardStates.players.playerOneSym ? '#FFFFFF' : "#886464";
                declareArea.innerText = "Winner is Player: " + player.replace("Sym", "").replace("player", "").toUpperCase();
            }
        }
    }
    else if (g_BoardStates.playableCells.length === 0) {
        declareArea.style.color = "rgb(0, 255, 200)";
        declareArea.innerText = "DRAW";
    }
    else {
        alert("PANIK!");
    }
}

function startGame() {
    const winnerDisplay = document.getElementById("winner");
    const currentPlayer = document.getElementById("current-player");
    currentPlayer.hidden = false;
    replayBtn.hidden = true;


    winnerDisplay.textContent = '';
    winnerDisplay.hidden = true;
    document.getElementById("gamemode-container").hidden = true;

    g_BoardStates.gameRunning = true;

    setPlayerOneSymbol('O');
    initializeBoard();

    currentPlayer.textContent = `Playing: ${g_BoardStates.turnOfPlayer}`;

    g_BoardStates.cellLayout.forEach(cell => { attachEvents(cell); });
}


const replayBtn = document.getElementById("replay-button");
replayBtn.textContent = "Start Game";


replayBtn.addEventListener("click", () => {
    startGame();
})
