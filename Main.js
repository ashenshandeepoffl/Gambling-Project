// Slot Machine Game

// Importing the prompt-sync library for synchronous input
const prompt = require("prompt-sync")();

// Constants for the slot machine grid dimensions
const ROWS = 3;
const COLS = 3;

// Configuration for the count of each symbol and their corresponding values
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

// Function to handle player deposit
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again");
        } else {
            return numberDepositAmount;
        }
    }
};

// Function to get the number of lines to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again");
        } else {
            return numberOfLines;
        }
    }
};

// Function to collect the bet amount per line
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet amount, try again");
        } else {
            return numberBet;
        }
    }
};

// Function to simulate spinning the slot machine and generate random symbols
const spin = () => {
    const symbols = [];

    // Generate an array of symbols based on the configured counts
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];

    // Populate the reels with random symbols
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbol = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbol.length);
            const selectedSymbol = reelSymbol[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbol.splice(randomIndex, 1);
        }
    }

    return reels;
};

// Function to transpose the reels for easier symbol comparison
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

// Function to print the rows of the slot machine grid
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

// Function to calculate the player's winnings
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];

        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }

    return winnings;
};

// Function to handle the main game loop
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money");
            break;
        }

        const playAgain = prompt("Do you want to play again (Y/N)?");

        if (playAgain !== "Y") {
            break;
        }
    }
};

// Start the game
game();
