// Crossword grid data (1 = white cell, 0 = black cell)
const gridData = [
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1]
];

// Clues (format: { number: "clue" })
const acrossClues = {
    1: "Capital of France (5)",
    4: "Opposite of off (2)",
    5: "Large body of water (3)",
    6: "Past tense of eat (3)",
    7: "Opposite of down (4)"
};

const downClues = {
    1: "Opposite of stop (3)",
    2: "A fruit (5)",
    3: "Opposite of no (2)",
    4: "A color (4)",
    5: "A pronoun (3)"
};

// Answers (format: { across: { number: "answer" }, down: { number: "answer" } })
const answers = {
    across: {
        1: "PARIS",
        4: "ON",
        5: "SEA",
        6: "ATE",
        7: "UP"
    },
    down: {
        1: "GO",
        2: "APPLE",
        3: "YES",
        4: "BLUE",
        5: "YOU"
    }
};

// Create the crossword grid
const grid = document.getElementById("crossword-grid");
for (let row = 0; row < gridData.length; row++) {
    for (let col = 0; col < gridData[row].length; col++) {
        const cell = document.createElement("div");
        cell.className = `cell ${gridData[row][col] === 0 ? "black" : ""}`;
        if (gridData[row][col] === 1) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            cell.appendChild(input);
        }
        grid.appendChild(cell);
    }
}

// Create clues
const acrossList = document.getElementById("across-list");
const downList = document.getElementById("down-list");

for (const [number, clue] of Object.entries(acrossClues)) {
    const li = document.createElement("li");
    li.textContent = `${number}. ${clue}`;
    li.dataset.direction = "across";
    li.dataset.number = number;
    li.addEventListener("click", () => highlightClue(number, "across"));
    acrossList.appendChild(li);
}

for (const [number, clue] of Object.entries(downClues)) {
    const li = document.createElement("li");
    li.textContent = `${number}. ${clue}`;
    li.dataset.direction = "down";
    li.dataset.number = number;
    li.addEventListener("click", () => highlightClue(number, "down"));
    downList.appendChild(li);
}

// Highlight cells for a clue
function highlightClue(number, direction) {
    const cells = document.querySelectorAll(".cell input");
    cells.forEach(cell => cell.classList.remove("highlighted"));

    if (direction === "across") {
        const row = Math.floor((number - 1) / 5);
        const startCol = (number - 1) % 5;
        for (let col = startCol; col < startCol + answers.across[number].length; col++) {
            const index = row * 10 + col;
            cells[index].classList.add("highlighted");
            cells[index].focus();
        }
    } else if (direction === "down") {
        const col = (number - 1) % 5;
        const startRow = Math.floor((number - 1) / 5);
        for (let row = startRow; row < startRow + answers.down[number].length; row++) {
            const index = row * 10 + col;
            cells[index].classList.add("highlighted");
            cells[index].focus();
        }
    }
}

// Check answers
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkAnswers();
    }
});

function checkAnswers() {
    const cells = document.querySelectorAll(".cell input");
    let allCorrect = true;

    // Check across answers
    for (const [number, answer] of Object.entries(answers.across)) {
        const row = Math.floor((number - 1) / 5);
        const startCol = (number - 1) % 5;
        let userAnswer = "";
        for (let col = startCol; col < startCol + answer.length; col++) {
            const index = row * 10 + col;
            userAnswer += cells[index].value;
        }
        if (userAnswer !== answer) {
            allCorrect = false;
        }
    }

    // Check down answers
    for (const [number, answer] of Object.entries(answers.down)) {
        const col = (number - 1) % 5;
        const startRow = Math.floor((number - 1) / 5);
        let userAnswer = "";
        for (let row = startRow; row < startRow + answer.length; row++) {
            const index = row * 10 + col;
            userAnswer += cells[index].value;
        }
        if (userAnswer !== answer) {
            allCorrect = false;
        }
    }

    if (allCorrect) {
        alert("Congratulations! You solved the crossword!");
    } else {
        alert("Some answers are incorrect. Keep trying!");
    }
}

