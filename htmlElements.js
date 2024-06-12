const elements = {
    get winnerDisplayArea() { return document.getElementById("winner"); },
    get gameModeContainer() { return document.getElementById("gamemode-container"); },
    get gameModeSelector() { return document.getElementById("gamemode-selection"); },
    get currentPlayer() { return document.getElementById("current-player"); },
    get boardContainer() { return document.getElementsByClassName("grid-container")[0]; },
    get symbolSelectionButtonContainer() { return document.getElementsByClassName("symbol-selection-buttons").item(0); },
    get symbolXBtn() { return document.getElementById("button-X"); },
    get symbolOBtn() { return document.getElementById("button-O"); },
    get replayBtn() { return document.getElementById("replay-button"); },
}