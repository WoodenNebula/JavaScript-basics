const Minimax = {
    miniMax(currState, isMaxPlayer, alpha, beta, depth) {
        if (checkGameEnded(currState) || depth === 0) {
            switch (g_BoardStates.winner) {
                case g_BoardStates.players.user:
                    return -10 + depth;
                case g_BoardStates.players.bot:
                    return 10 - depth;
                default:
                    return 0;
            }
        }

        if (isMaxPlayer) {
            let maxEval = -Infinity;
            for (let possibleMove of g_BoardStates.possibleMoves(currState)) {
                let eval = Minimax.miniMax(Minimax.applyMove(possibleMove, currState), false, alpha, beta, depth - 1);
                if (eval > maxEval) {
                    maxEval = eval;
                }
                alpha = Math.max(alpha, eval);
                if (beta <= alpha)
                    break;
            }
            return maxEval;
        }
        else {
            let minEval = Infinity;
            for (let possibleMove of g_BoardStates.possibleMoves(currState)) {
                let eval = Minimax.miniMax(Minimax.applyMove(possibleMove, currState), true, alpha, beta, depth - 1);
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha)
                    break;
            }
            return minEval;
        }
    },


    applyMove(index, prevState) {
        let newState = [...prevState];
        newState[index] = g_BoardStates.turnOfPlayer(prevState);
        return newState;
    },


    findBestMove() {
        // Assumption: Bot is always max player
        let bestMove = -1;
        let bestEval = -Infinity;

        const moves = g_BoardStates.possibleMoves(g_BoardStates.boardState);
        moves.forEach(move => {
            let eval = Minimax.miniMax(Minimax.applyMove(move, g_BoardStates.boardState), !true, - Infinity, Infinity, moves.length - 1);
            if (eval > bestEval) {
                bestEval = eval;
                bestMove = move;
            }
        });
        return bestMove;
    },

    getRandomMove() {
        let rand = null;
        do {
            rand = Math.floor(Math.random() * 10);
        } while (rand > 8 || !g_BoardStates.possibleMoves().includes(rand));
        return rand;
    }
}