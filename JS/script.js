const gridContainer = document.querySelector(".grid-container");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const buttons = document.querySelectorAll("button");
const reset = document.getElementById('reset');
const gridSize = 15;
let snake = [];
let food = generateFood();
let dx = 1;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("highScore");
let gameInterval;

highScoreDisplay.textContent = highScore;
function generateGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridContainer.appendChild(gridItem);
        }
    }
}

reset.onclick = () => {
    clearInterval(gameInterval);
    snake = [{ x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }];
    food = generateFood();
    // dx = 1;
    // dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
    gameInterval = setInterval(moveSnake, 200);
    clearGrid();
    generateGrid();
    drawSnake();
    snake = [{ x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }];
};

function clearGrid() {
    gridContainer.innerHTML = "";
}

function generateFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * gridSize);
        foodY = Math.floor(Math.random() * gridSize);
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
    return { x: foodX, y: foodY };
}

function drawSnake() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
        item.classList.remove("snake");
        item.classList.remove("food");
        if (snake.some(segment => segment.x === index % gridSize && segment.y === Math.floor(index / gridSize))) {
            item.classList.add("snake");
        } else if (food.x === index % gridSize && food.y === Math.floor(index / gridSize)) {
            item.classList.add("food");
        }
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
        scoreDisplay.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.textContent = highScore;
        }
    } else {
        snake.pop();
    }
    if (
        head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize
    ) {

        head.x = (head.x + gridSize) % gridSize;
        head.y = (head.y + gridSize) % gridSize;
    }
    drawSnake();
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        alert("Game over! Your score: " + score);
    }
}

function changeDirection(event) {
    switch (event.target.id) {
        case "up":
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case "down":
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case "left":
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case "right":
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
    if (!gameInterval) {
        gameInterval = setInterval(moveSnake, 200);
    }

    buttons.forEach(button => button.classList.remove("active"));
    event.target.classList.add("active");
}

generateGrid();
drawSnake();
snake = [{ x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }];

buttons.forEach(button => {
    button.addEventListener("click", changeDirection);
});

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            document.getElementById("up").click();
            break;
        case "ArrowDown":
            document.getElementById("down").click();
            break;
        case "ArrowLeft":
            document.getElementById("left").click();
            break;
        case "ArrowRight":
            document.getElementById("right").click();
            break;
    }
});
