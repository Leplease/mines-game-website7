document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const currentBalanceText = document.getElementById("currentBalance");
    const multiplierText = document.getElementById("multiplier");
    const startGameBtn = document.getElementById("startGame");
    const cashOutBtn = document.getElementById("cashOut");
    const betButton = document.getElementById("betButton");
    const adminPasswordInput = document.getElementById("adminPassword");
    const adminLoginBtn = document.getElementById("adminLogin");
    const adminControls = document.getElementById("adminControls");
    const userBalanceInput = document.getElementById("userBalance");
    const updateUserBalanceBtn = document.getElementById("updateUserBalance");

    let balance = 100;
    let multiplier = 1;
    let minePositions = [];
    let revealedCells = 0;
    let playing = false;
    let betAmount = 0;

    // Admin password
    const adminPassword = "PETSIM99GAMBLER";

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
        minePositions = [];
        let mineCount = 5; // For example, 5 mines in the grid
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

    // Function to update the multiplier
    function updateMultiplier() {
        multiplierText.textContent = `${multiplier.toFixed(1)}x`;
    }

    // Function to end the game (win/lose)
    function endGame(won) {
        playing = false;
        if (won) {
            balance += betAmount * multiplier;
        } else {
            balance -= betAmount;
        }
        updateBalance();
    }

    // Function to update the balance
    function updateBalance() {
        currentBalanceText.textContent = balance.toFixed(2);
    }

    // Admin function to update user balance
    adminLoginBtn.addEventListener("click", () => {
        if (adminPasswordInput.value === adminPassword) {
            adminControls.style.display = "block";
            adminPasswordInput.style.display = "none";
            adminLoginBtn.style.display = "none";
        } else {
            alert("Incorrect password");
        }
    });

    // Admin function to update balance
    updateUserBalanceBtn.addEventListener("click", () => {
        let newBalance = parseFloat(userBalanceInput.value);
        if (newBalance >= 0) {
            balance = newBalance;
            updateBalance();
        }
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
            endGame(true);
        }
    });

    // Handle betting amount
    betButton.addEventListener("click", () => {
        betAmount = parseFloat(prompt("Enter your bet amount:"));
        if (betAmount > 0 && betAmount <= balance) {
            balance -= betAmount;
            updateBalance();
        } else {
            alert("Invalid bet amount!");
        }
    });
});
