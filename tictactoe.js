function RandomNum() {
    let rand = null;
    do {
        rand = Math.floor(Math.random() * 10);
    } while (rand > 8);
    return rand;
}

const Player = {
    bot: 0,
    user: 1
};


function GetBoard() {
    let board = [];
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            board.push(document.getElementById(`r${row}c${column}`));
        }
    }
    return board;
};

const Board = {
    boardState: GetBoard(),
    turnOfUser: true,
    playableCells: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    symbols: {
        user: 'X',
        bot: 'O'
    },
    gameFinished: false,

    UpdateBoard() {
        this.boardState = GetBoard();
    },

    SetUserSymbol(symbol) {
        if (this.symbols.user != symbol) {
            this.symbols.bot = this.symbols.user;
            this.symbols.user = symbol;
        }
    },

    PlayAsAt(player, pos) {
        if (this.playableCells.includes(pos)) {
            if (player === Player.user && this.turnOfUser) {
                this.boardState[pos].textContent = this.symbols.user;
            }
            else if (player === Player.bot && !this.turnOfUser) {
                this.boardState[pos].textContent = this.symbols.bot;
            }
            this.UpdateBoard();
            this.playableCells.remove(pos);
            this.turnOfUser = !this.turnOfUser;

            if ((winner = this.CheckWinner()) != null) {
                setTimeout(() => {
                    this.FinishGame(winner);
                }, 0);
            }

            return true;
        }
        return false;
    },

    PlayUser(pos) {
        return this.PlayAsAt(Player.user, pos);
    },

    PlayBot() {
        let randIndx;
        let playAttempt;
        do {
            randIndx = RandomNum(this.playableCells);
            playAttempt = this.PlayAsAt(Player.bot, randIndx);
        } while (!playAttempt && this.playableCells.length > 0);

        return playAttempt;
    },

    InitializeBoard() {
        this.gameFinished = false;
        this.playableCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.boardState.forEach(cell => {
            cell.textContent = '-';
            cell.addEventListener("click", handleUserClick);
        });

        this.playableCells.remove = (element) => {
            let index = this.playableCells.indexOf(element);
            if (index > -1) {
                this.playableCells.splice(index, 1);
            }
        }
    },

    CheckWinner() {
        const detWinningPlayer = (winnerSymbol) => {
            for (let prop in this.symbols) {
                if (this.symbols[prop] === winnerSymbol) {
                    return prop;
                }
            }
        }


        const winVerifier = (cellPattern) => {
            let winningPlayer = null;

            cellPattern.forEach((cells) => {
                let cellEntries = [];

                cells.forEach((cell) => {
                    cellEntries.push(this.boardState[cell].textContent);
                });

                if (cellEntries[0] == cellEntries[1] &&
                    cellEntries[1] == cellEntries[2] &&
                    cellEntries[1] != '-') {
                    winningPlayer = detWinningPlayer(cellEntries[1]);
                }
            });

            return winningPlayer;
        }

        const rowIndices = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
        const columnIndices = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
        const diagonalIndices = [[0, 4, 8], [2, 4, 6]];

        let winner = winVerifier(rowIndices) ?? winVerifier(columnIndices) ?? winVerifier(diagonalIndices);
        winner ??= this.playableCells.length === 0 ? "Draw" : null;
        return winner;
    },

    FinishGame(winner) {
        this.gameFinished = true;
        if (winner === "Draw")
            alert(winner);
        else
            alert(`Winner is ${winner}!`);

        this.InitializeBoard();
        location.reload();
    }

};


function handleUserClick(e) {
    const pos = parseInt(this.id[1]) * 3 + parseInt(this.id[3]);
    if (Board.gameFinished != true)
        if (Board.PlayUser(pos))
            Board.PlayBot();
}

Board.InitializeBoard();
Board.SetUserSymbol('X');