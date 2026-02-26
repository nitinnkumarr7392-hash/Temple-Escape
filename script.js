const player = document.getElementById("player");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");

let score = 0;
let isJumping = false;
let gameRunning = true;
let obstacles = [];

function jump() {
    if (isJumping) return;
    isJumping = true;

    let jumpHeight = 0;
    let upInterval = setInterval(() => {
        if (jumpHeight >= 120) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                jumpHeight -= 5;
                player.style.bottom = 100 + jumpHeight + "px";
            }, 20);
        }
        jumpHeight += 5;
        player.style.bottom = 100 + jumpHeight + "px";
    }, 20);
}

function createObstacle() {
    if (!gameRunning) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = Math.random() * (window.innerWidth - 50) + "px";

    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);

    let obstaclePosition = -60;

    const moveInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveInterval);
            obstacle.remove();
            return;
        }

        obstaclePosition += 6;
        obstacle.style.top = obstaclePosition + "px";

        let playerRect = player.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            gameOver();
        }

        if (obstaclePosition > window.innerHeight) {
            clearInterval(moveInterval);
            obstacle.remove();
            score++;
            scoreDisplay.innerText = "Score: " + score;
        }
    }, 20);
}

function gameOver() {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    location.reload();
}

document.addEventListener("touchstart", jump);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
});

setInterval(createObstacle, 1500);
