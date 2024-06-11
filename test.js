function playerTurn(state) {
    let maxPlayerCount = 0;
    let minPlayerCount = 0;

    for (let player in state) {
        if (player === maxPlayer)
            maxPlayerCount++;
        else if (player === minPlayer)
            minPlayerCount++;
    }
    return maxPlayerCount < minPlayerCount ? maxPlayer : minPlayer;
}

function gameValue(params) {
    if (gameTerminated(params)) {
        switch (winner) {
            case minPlayer:
                return -1;
            case maxPlayer:
                return 1;
            default:
                return 0;
        }
    }
}

function getNextStates(state) {
    let nextStates = [];
    const player = playerTurn(state);
    for (let i = 0; i < state.length; i++) {
        if (state[i] == '') {
            let newState = state;
            newState[i] = player;
            nextStates.push(newState);
        }
    }
    return nextStates;
}

function miniMax(currState) {
    if (gameTerminated(currState)) {
        return gameValue(currState);
    }

    let value = null;
    if (playerTurn(currState) === maxPlayer) {
        value = Infinity;
        getNextStates(currState)
            .forEach(state => {
                value = Math.max(value, miniMax(state));
            });
        return value;
    }

    if (playerTurn(currState) === minPlayer) {
        value = -Infinity;
        getNextStates(currState)
            .forEach(state => {
                value = Math.min(value, miniMax(state));
            });
        return value;
    }
}


const currPlayer = 'X';
const maxPlayer = 'X';
const minPlayer = 'O';
const winner = 'X';
const currState = [
    'X', 'O', 'O',
    'X', 'X', 'O',
    'O', 'O', 'X'];

console.log(miniMax(currState));

