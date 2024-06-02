function RandomNum(avoidList) {
    let rand = Math.floor(Math.random() * 10);
    while (!(rand < 9) && rand in avoidList) {
        rand = Math.floor(Math.random() * 10);
    }
    return rand;
}

const Player = {
    bot: 0,
    user: 1
};

const Board = {
    turnOfUser: true,
    filled: [],
    symbols: {
        user: 'X',
        bot: 'O'
    },

    _GetBoard() {
        let board = [];
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                board.push(document.getElementById(`r${row}c${column}`));
            }
        }
        return board;
    },

    SetUserSymbol(symbol) {
        if (this.symbols.user != symbol) {
            this.symbols.bot = this.symbols.user;
            this.symbols.user = symbol;
        }
    },


    
    PlayAt(player, pos) {
        if (!(pos in this.filled)) {
            if (this.turnOfUser && player === Player.user) {
                this._GetBoard()[pos].textContent = this.symbols.user;
                this.turnOfUser = !this.turnOfUser;
                this.filled.push(pos);
                return true;
            }
            else if (!this.turnOfUser && player === Player.bot) {
                this._GetBoard()[pos].textContent = this.symbols.bot;
                this.turnOfUser = !this.turnOfUser;
                this.filled.push(pos);
                return true;
            }
        } else {
            console.log("POSITION ALREADY TAKEN!");
        }
        return false;
    },

    PlayUser(pos) {
        console.log("User Attempt at " + pos);
        return this.PlayAt(Player.user, pos);
    },

    PlayBot() {
        const randInd = RandomNum(this.filled);
        console.log("Bot Attempt at " + randInd);
        this.PlayAt(Player.bot, randInd);
        console.log(this.filled);
    },








    InitializeBoard() {
        this._GetBoard().forEach(cell => {
            cell.textContent = '-';
            cell.addEventListener("click", () => {
                const pos = parseInt(cell.id[1]) * 3 + parseInt(cell.id[3]);
                if (this.PlayUser(pos))
                    this.PlayBot();
            });
        });
    }
};


Board.InitializeBoard();
Board.SetUserSymbol('X');