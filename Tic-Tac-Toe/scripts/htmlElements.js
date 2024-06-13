const elements = {
    get winnerDisplayArea() { return document.getElementById("winner"); },
    get gameModeContainer() { return document.getElementById("gamemode-container"); },
    get gameMode() { return document.getElementById("gamemode-selection").value; },
    get currentPlayerNotify() { return document.getElementById("current-player"); },
    get boardContainer() { return document.getElementsByClassName("grid-container")[0]; },
    get symbolSelectionButtonContainer() { return document.getElementsByClassName("symbol-selection-buttons").item(0); },
    get symbolXBtn() { return document.getElementById("button-X"); },
    get symbolOBtn() { return document.getElementById("button-O"); },
    get replayBtn() { return document.getElementById("replay-button"); },
    get cellLayout() {
        let board = [];
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                board.push(document.getElementById(`r${row}c${column}`));
            }
        }
        return board;
    },

    attachEvents(cell) {
        cell.addEventListener("click", () => {
            if (g_BoardStates.isGameRunning) {
                const pos = parseInt(cell.id[1]) * 3 + parseInt(cell.id[3]);
                handleCellClick(pos);
            }
        });

        const originalBgColor = cell.style.background;
        cell.addEventListener("mouseover", () => {
            if (g_BoardStates.isGameRunning && g_BoardStates.possibleMoves().includes(parseInt(cell.id[1]) * 3 + parseInt(cell.id[3]))) {
                cell.style.background = "#3f7898";
            }
        });

        cell.addEventListener("mouseout", () => {
            cell.style.background = originalBgColor;
        })
    },

    readyHTMLPreStart() {
        // Hide previous stuff
        elements.replayBtn.hidden = true;
        elements.winnerDisplayArea.textContent = '';
        elements.winnerDisplayArea.hidden = true;

        // Display current stuffs
        elements.gameModeContainer.hidden = false;
        elements.boardContainer.style.display = "grid";
        elements.symbolSelectionButtonContainer.style.display = "grid";

        //Reset board
        elements.cellLayout.forEach(cell => { cell.textContent = ''; });
    },


    initializeBoardElements() {
        // Hide stuffs
        elements.gameModeContainer.hidden = true;
        elements.symbolSelectionButtonContainer.style.display = "none";

        elements.cellLayout.forEach(cell => { elements.attachEvents(cell); });
    },

    displayCurrentPlayer(currentPlayer) {
        if (currentPlayer == null) {
            // Hide stuffs
            elements.currentPlayerNotify.textContent = '';
            elements.currentPlayerNotify.hidden = true;
        } else {
            // Show stuffs
            elements.currentPlayerNotify.hidden = false;
            elements.currentPlayerNotify.textContent = `Playing: ${currentPlayer} `;
        }
    }
}