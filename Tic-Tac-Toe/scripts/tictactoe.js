const g_BoardStates = {
    isGameRunning: false,
    winner: null,
    hardDifficulty: true,
    get boardState() {
        let board = [];
        elements.cellLayout.forEach(cell => {
            board.push(cell.textContent);
        });
        return board;
    },
    // All player related properties and functionality
    players: {
        options: ['O', 'X'],
        get playerOne() { return this.options[0]; },
        get playerTwo() { return this.options[1]; },
        set playerOne(symbol) {
            if (this.playerOne !== symbol) {
                this.options[1] = this.options[0];
                this.options[0] = symbol;
            }
        },
        // Assumption: bot is always the second player and User is always the first one
        get bot() { return this.playerTwo; },
        get user() { return this.playerOne; },
    },
    // Return empty cells' array
    possibleMoves(currState = this.boardState) {
        let possibleMoves = [];
        for (let i = 0; i < currState.length; i++) {
            if (currState[i] == '') {
                possibleMoves.push(i);
            }
        }
        return possibleMoves;
    },

    turnOfPlayer(currState = this.boardState) {
        if (this.pvp) {
            let playerOneCount = 0, playerTwoCount = 0;

            for (const player of currState) {
                if (player === this.players.playerOne)
                    playerOneCount++;
                else if (player === this.players.playerTwo)
                    playerTwoCount++;
            }
            if (playerOneCount === playerTwoCount)
                return this.players.playerOne;
            else
                return playerOneCount < playerTwoCount ? this.players.playerOne : this.players.playerTwo;
        }
        // Useful for minimax algorithm as well
        else if (!this.pvp) {
            let botPlayCount = 0, userPlayCount = 0;

            for (let player of currState) {
                if (player === this.players.bot)
                    botPlayCount++;
                else if (player === this.players.user)
                    userPlayCount++;
            }
            if (botPlayCount === userPlayCount)
                return this.players.user;
            else
                return botPlayCount < userPlayCount ? this.players.bot : this.players.user;
        }
    }
}


function playCellAs(cellIndex, playerSymbol) {
    // Handle Bot's turn
    if (!g_BoardStates.pvp && playerSymbol === g_BoardStates.players.bot) {

        cellIndex = g_BoardStates.hardDifficulty ? Minimax.findBestMove() : Minimax.getRandomMove();
    }

    // Validate and make move
    if (g_BoardStates.possibleMoves().includes(cellIndex)) {
        elements.cellLayout[cellIndex].textContent = playerSymbol;
        elements.cellLayout[cellIndex].style.color = (playerSymbol === g_BoardStates.players.playerOne) ? "#FFFFFF" : "#483434";

        elements.displayCurrentPlayer(g_BoardStates.turnOfPlayer());
        return true;
    }
    return false;
}


function handleCellClick(pos) {
    // Helper function
    const playSequentially = (playerFirst, playerSecond) => {
        let success = playCellAs(pos, playerFirst);
        if (!success)
            return;
        let gameEnded = checkGameEnded();

        if (!gameEnded) {
            success = playCellAs(pos, playerSecond);
            if (!success)
                return;
            gameEnded = checkGameEnded();
        }

        if (gameEnded) {
            g_BoardStates.isGameRunning = false;
            declareWinner();
            resetGame();
        }
        return;
    }

    if (g_BoardStates.pvp) {
        switch (g_BoardStates.turnOfPlayer()) {
            case g_BoardStates.players.playerOne:
                playSequentially(g_BoardStates.players.playerOne, g_BoardStates.players.playerTwo);
                break;
            case g_BoardStates.players.playerTwo:
                playSequentially(g_BoardStates.players.playerTwo, g_BoardStates.players.playerOne);
                break;
        }
    } else if (!g_BoardStates.pvp) {
        switch (g_BoardStates.turnOfPlayer()) {
            case g_BoardStates.players.user:
                playSequentially(g_BoardStates.players.user, g_BoardStates.players.bot);
                break;
            case g_BoardStates.players.bot:
                playSequentially(g_BoardStates.players.bot, g_BoardStates.players.user);
                break;
        }
    }
}


function checkGameEnded(gameState = g_BoardStates.boardState) {
    //Actual game ending logic
    const gameVerifier = (matchPatterns) => {
        let gameFinished = matchPatterns.some((indices) => {
            let cellEntries = [];

            indices.forEach((index) => {
                cellEntries.push(gameState[index]);
            });

            if (cellEntries[0] === cellEntries[1] &&
                cellEntries[1] === cellEntries[2] &&
                (cellEntries[1] === g_BoardStates.players.playerOne
                    || cellEntries[1] === g_BoardStates.players.playerTwo)) {
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
    return false;
}


function declareWinner() {
    elements.displayCurrentPlayer(null);
    elements.winnerDisplayArea.hidden = false;

    if (g_BoardStates.winner.toUpperCase() === "DRAW") {
        elements.winnerDisplayArea.style.color = "rgb(0, 255, 200)";
        elements.winnerDisplayArea.innerText = "DRAW";
    } else if (!g_BoardStates.pvp && g_BoardStates.winner === g_BoardStates.players.bot) {
        elements.winnerDisplayArea.style.color = g_BoardStates.players.bot === g_BoardStates.players.playerOne ? '#FFFFFF' : "#886464";
        elements.winnerDisplayArea.innerText = "Winner is BOT";
    } else if (g_BoardStates.winner === g_BoardStates.players.playerOne) {
        elements.winnerDisplayArea.style.color = '#FFFFFF'
        elements.winnerDisplayArea.innerText = "Winner is Player: ONE";
    } else {
        elements.winnerDisplayArea.style.color = "#886464";
        elements.winnerDisplayArea.innerText = "Winner is Player: TWO";
    }
}


function resetGame() {
    // Reveal Replay Button
    elements.replayBtn.textContent = "Replay";
    elements.replayBtn.hidden = false;

    elements.replayBtn.addEventListener("click", () => {
        elements.winnerDisplayArea.hidden = true;
        elements.winnerDisplayArea.textContent = '';

        g_BoardStates.winner = '';

        elements.cellLayout.forEach(cell => { cell.textContent = ''; });

        displayInitialScene();
    });
}


function startGame(playerOneSymbol) {
    g_BoardStates.isGameRunning = true;
    g_BoardStates.players.playerOne = playerOneSymbol;

    switch (elements.gameMode) {
        case "PvP":
            g_BoardStates.pvp = true;
            break;
        case "PvE":
            g_BoardStates.pvp = false;
            g_BoardStates.hardDifficulty = false;
            break;
        case "Hard":
            g_BoardStates.pvp = false;
            g_BoardStates.hardDifficulty = true;
    }

    elements.initializeBoardElements();
    elements.displayCurrentPlayer(g_BoardStates.turnOfPlayer());
}


function displayInitialScene() {
    elements.readyHTMLPreStart();

    // Initialize Starting buttons
    const symbolChoiceButtons = [elements.symbolXBtn, elements.symbolOBtn];
    symbolChoiceButtons.forEach(button => { button.addEventListener("click", () => { startGame(button.textContent[5]); }); });
}

// Game Entry Point
displayInitialScene();