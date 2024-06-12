function randomIndex() {
    let rand = null;
    do {
        rand = Math.floor(Math.random() * 10);
    } while (rand > 8 || !g_BoardStates.playableCells.includes(rand));
    return rand;
}


const g_BoardStates = {
    get cellLayout() { return getBoard(); },
    playableCells: Array(9),
    players: {
        bot: null,
        playerOneSym: 'X',
        playerTwoSym: 'O',
        get maxPlayer() { return this.bot; },
        get minPlayer() { return this.playerOneSym; }
    },
    turnOfPlayer: this.playerOneSym,
    winner: null,
    gameRunning: false,
    hardDifficulty: true
}


function getBoard() {
    let board = [];
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            board.push(document.getElementById(`r${row}c${column}`));
        }
    }
    return board;
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
    let currState = [];
    g_BoardStates.cellLayout.forEach(cell => {
        currState.push(cell.textContent);
    });

    if (g_BoardStates.hardDifficulty === true) {
        let bestIndex = findBestMove(currState);
        return playCellAs(bestIndex, g_BoardStates.players.bot);
    }

    return playCellAs(randomIndex(), g_BoardStates.players.bot);
}


function findBestMove(currState) {
    const isMaxPlayer = (g_BoardStates.players.bot === g_BoardStates.players.maxPlayer) ? true : false;
    let bestMove = -1;

    if (isMaxPlayer)
        bestEval = -Infinity;
    else if (!isMaxPlayer)
        bestEval = +Infinity;

    const possibleMoves = getPossibleMoves(currState);
    possibleMoves.forEach(move => {
        let eval = miniMax(applyMove(move, currState), !isMaxPlayer, - Infinity, Infinity, possibleMoves.length - 1);
        if (isMaxPlayer && eval > bestEval) {
            bestEval = eval;
            bestMove = move;
        } else if (!isMaxPlayer && eval < bestEval) {
            bestEval = eval;
            bestMove = move;
        }
    });
    return bestMove;
}


function miniMax(currState, isMaxPlayer, alpha, beta, depth) {
    if (gameEnded(currState) || depth === 0) {
        return gameValue(currState, depth);
    }
    if (isMaxPlayer) {
        let maxEval = -Infinity;
        for (let possibleMove of getPossibleMoves(currState)) {
            let eval = miniMax(applyMove(possibleMove, currState), false, alpha, beta, depth - 1);
            if (eval > maxEval) {
                maxEval = eval;
            }
            alpha = Math.max(alpha, eval);
            if (beta <= alpha)
                break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let possibleMove of getPossibleMoves(currState)) {
            let eval = miniMax(applyMove(possibleMove, currState), true, alpha, beta, depth - 1);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha)
                break;
        }
        return minEval;
    }
}


function flipPlayerTurn(currentPlayer) {
    g_BoardStates.turnOfPlayer = currentPlayer === g_BoardStates.players.playerOneSym ?
        g_BoardStates.players.playerTwoSym : g_BoardStates.players.playerOneSym;

    elements.currentPlayer.textContent = `Playing: ${g_BoardStates.turnOfPlayer}`;
}


function playCellAs(cellIndex, playerSymbol) {
    if (g_BoardStates.playableCells.includes(cellIndex)) {
        if (g_BoardStates.turnOfPlayer === playerSymbol) {
            g_BoardStates.playableCells.playAt(cellIndex, playerSymbol);
            flipPlayerTurn(playerSymbol);
            return true;
        }
    }
    return false;
}


function playerTurn(state) {
    let maxPlayerCount = 0;
    let minPlayerCount = 0;

    for (let player of state) {
        if (player === g_BoardStates.players.maxPlayer)
            maxPlayerCount++;
        else if (player === g_BoardStates.players.minPlayer)
            minPlayerCount++;
    }
    return maxPlayerCount < minPlayerCount ? g_BoardStates.players.maxPlayer : g_BoardStates.players.minPlayer;
}


function gameValue(currState, depth) {
    if (gameEnded(currState)) {
        switch (g_BoardStates.winner) {
            case g_BoardStates.players.minPlayer:
                return -10 + depth;
            case g_BoardStates.players.maxPlayer:
                return 10 - depth;
            default:
                return 0;
        }
    }
}


function getPossibleMoves(state) {
    let possibleMoves = [];
    for (let i = 0; i < state.length; i++) {
        if (state[i] == '') {
            possibleMoves.push(i);
        }
    }
    return possibleMoves;
}


function applyMove(index, prevState) {
    let newState = [...prevState];
    newState[index] = playerTurn(prevState);
    return newState;
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


function initializeBoard() {
    if (elements.gameModeSelector.value === "pvp") {
        g_BoardStates.pvp = true;
    } else { g_BoardStates.pvp = false; }


    g_BoardStates.playableCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    g_BoardStates.hardDifficulty = true;

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

    elements.currentPlayer.hidden = false;

    elements.replayBtn.textContent = "Replay";
    elements.replayBtn.hidden = false;

    elements.replayBtn.addEventListener("click", () => {
        elements.winnerDisplayArea.hidden = true;
        elements.winnerDisplayArea.textContent = '';

        g_BoardStates.cellLayout.forEach(cell => { cell.textContent = ''; });
        g_BoardStates.winner = null;
        displayInitialScene();
    });
}


function gameEnded(gameState) {
    if (gameState == undefined) {
        gameState = [];
        g_BoardStates.cellLayout.forEach(cell => {
            gameState.push(cell.textContent);
        });
    }

    const gameVerifier = (matchPatterns) => {
        let gameFinished = matchPatterns.some((indices) => {
            let cellEntries = [];

            indices.forEach((index) => {
                cellEntries.push(gameState[index]);
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
        gameVerifier(diagonalIndices)) {
        return true;
    }
    else if (gameState.indexOf('') === -1) {
        g_BoardStates.winner = 'Draw';
        return true;
    }
    else {
        return false;
    }
}


function declareWinner() {
    elements.currentPlayer.textContent = '';
    elements.winnerDisplayArea.hidden = false;

    if (g_BoardStates.winner.toUpperCase() === "DRAW") {
        elements.winnerDisplayArea.style.color = "rgb(0, 255, 200)";
        elements.winnerDisplayArea.innerText = "DRAW";
    } else if (!g_BoardStates.pvp && g_BoardStates.winner == g_BoardStates.players.bot) {
        elements.winnerDisplayArea.style.color = g_BoardStates.players.bot === g_BoardStates.players.playerOneSym ? '#FFFFFF' : "#886464";
        elements.winnerDisplayArea.innerText = "Winner is BOT";
    } else if (g_BoardStates.winner === g_BoardStates.players.playerOneSym) {
        elements.winnerDisplayArea.style.color = '#FFFFFF'
        elements.winnerDisplayArea.innerText = "Winner is Player: ONE";
    } else {
        elements.winnerDisplayArea.style.color = "#886464";
        elements.winnerDisplayArea.innerText = "Winner is Player: TWO";
    }
}

function startGame() {
    // Hide stuffs
    elements.gameModeContainer.hidden = true;
    elements.symbolSelectionButtonContainer.style.display = "none";

    // Show stuffs
    elements.currentPlayer.hidden = false;
    elements.boardContainer.style.display = "grid";

    g_BoardStates.gameRunning = true;

    initializeBoard();

    elements.currentPlayer.textContent = `Playing: ${g_BoardStates.turnOfPlayer}`;

    g_BoardStates.cellLayout.forEach(cell => { attachEvents(cell); });
}

function displayInitialScene() {
    // Hide previous stuff
    elements.replayBtn.hidden = true;

    elements.winnerDisplayArea.textContent = '';
    elements.winnerDisplayArea.hidden = true;

    // Display current stuffs
    elements.gameModeContainer.hidden = false;
    elements.boardContainer.style.display = "grid";
    elements.symbolSelectionButtonContainer.style.display = "grid";

    g_BoardStates.cellLayout.forEach(cell => { cell.textContent = ''; });

    const symbolChoiceButtons = [elements.symbolXBtn, elements.symbolOBtn];
    symbolChoiceButtons.forEach(button => {
        button.addEventListener("click", () => {
            setPlayerOneSymbol(button.textContent[5]);
            startGame();
        })
    })
}

displayInitialScene();