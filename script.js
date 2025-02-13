document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const balanceInput = document.getElementById("balanceInput");
    const setBalanceBtn = document.getElementById("setBalance");
    const addBalanceBtn = document.getElementById("addBalance");
    const minesInput = document.getElementById("mines");
    const startGameBtn = document.getElementById("startGame");
    const cashOutBtn = document.getElementById("cashOut");
    const currentBalanceText = document.getElementById("currentBalance");
    const multiplierText = document.getElementById("multiplier");
    const userBalanceInput = document.getElementById("userBalance");
    const updateUserBalanceBtn = document.getElementById("updateUserBalance");

    const loginBtn = document.getElementById("loginBtn");
    const adminPasswordInput = document.getElementById("adminPassword");
    const adminPanel = document.querySelector(".admin-panel");
    const adminLogin = document.querySelector(".admin-login");
    const loginError = document.getElementById("loginError");

    const correctPassword = "admin123"; // Set your password here

    let balance = 100;
    let multiplier = 1;
    let minePositions = [];
    let revealedCells = 0;
    let playing = false;

    // Function to create the grid
    function createGrid() {
        grid.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.addEventListener("click", () => revealCell(cell));
            grid.appendChild(cell);
        }
    }

    // Function to place mines on the grid
    function placeMines() {
        let mineCount = parseInt(minesInput.value);
        minePositions = [];
        while (minePositions.length < mineCount) {
            let randomIndex = Math.floor(Math.random() * 25);
            if (!minePositions.includes(randomIndex)) {
                minePositions.push(randomIndex);
            }
        }
    }

    // Function to reveal a cell (game logic)
    function revealCell(cell) {
        if (!playing || cell.classList.contains("revealed")) return;
        
        let index = parseInt(cell.dataset.index);
        cell.classList.add("revealed");

        if (minePositions.includes(index)) {
            cell.classList.add("mine");
            endGame(false);
        } else {
            cell.classList.add("gem");
            revealedCells++;
            multiplier += 0.2;
            updateMultiplier();
        }
    }

    // Function to update multiplier
    function updateMultiplier() {
        multiplierText.textContent = `${multiplier.toFixed(1)}x`;
    }

    // Function to end the game (win/lose)
    function endGame(won) {
        playing = false;
        if (won) {
            balance *= multiplier;
        } else {
            balance = 0;
        }
        updateBalance();
    }

    // Function to update the balance
    function updateBalance() {
        currentBalanceText.textContent = balance.toFixed(2);
    }

    // Admin function to update user balance
    updateUserBalanceBtn.addEventListener("click", () => {
        let newUserBalance = parseFloat(userBalanceInput.value);
        if (newUserBalance > 0) {
            balance = newUserBalance;
            updateBalance();
        }
    });

    // Function to set balance from input
    setBalanceBtn.addEventListener("click", () => {
        balance = parseFloat(balanceInput.value);
        updateBalance();
    });

    // Function to add balance
    addBalanceBtn.addEventListener("click", () => {
        let addAmount = parseFloat(balanceInput.value);
        balance += addAmount;
        updateBalance();
    });

    // Function to start the game
    startGameBtn.addEventListener("click", () => {
        if (balance <= 0) {
            alert("You need to set a balance first!");
            return;
        }
        multiplier = 1;
        revealedCells = 0;
        playing = true;
        updateBalance();
        updateMultiplier();
        createGrid();
        placeMines();
    });

    // Function to cash out (stop the game)
    cashOutBtn.addEventListener("click", () => {
        if (playing) {
