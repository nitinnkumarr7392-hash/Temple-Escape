const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

let lane = 1; // 0 left, 1 center, 2 right
let score = 0;
let speed = 6;
let gameRunning = true;

const lanes = [
    window.innerWidth / 6,
    window.innerWidth / 2 - 30,
    window.innerWidth - window.innerWidth / 6 - 60
];

function updatePlayerPosition() {
    player.style.left = lanes[lane] + "px";
}

updatePlayerPosition();

function moveLeft() {
    if (lane > 0) lane--;
    updatePlayerPosition();
}

function moveRight() {
    if (lane < 2) lane++;
    updatePlayerPosition();
}

function createObstacle() {
    if (!gameRunning) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    let obstacleLane = Math.floor(Math.random() * 3);
    obstacle.style.left = lanes[obstacleLane] + "px";

    document.querySelector(".game").appendChild(obstacle);

    let position = -80;

    const interval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(interval);
            obstacle.remove();
            return;
        }

        position += speed;
        obstacle.style.top = position + "px";

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            gameOver();
        }

        if (position > window.innerHeight) {
            clearInterval(interval);
            obstacle.remove();
            score++;
            speed += 0.2;
            scoreEl.innerText = score;
        }
    }, 20);
}

function gameOver() {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
}

function restart() {
    location.reload();
}

let touchStartX = 0;

document.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    let touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) moveLeft();
    if (touchEndX - touchStartX > 50) moveRight();
});

setInterval(createObstacle, 1200);
