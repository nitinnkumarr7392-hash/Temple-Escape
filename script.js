const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lanes = [canvas.width * 0.25, canvas.width * 0.5, canvas.width * 0.75];
let currentLane = 1;

let player = {
    x: lanes[currentLane],
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: "yellow",
    jumping: false,
    velocityY: 0
};

let gravity = 0.8;
let obstacles = [];
let coins = [];
let speed = 6;
let score = 0;
let gameRunning = false;
let highScore = localStorage.getItem("skyHighScore") || 0;
document.getElementById("highScore").innerText = highScore;

function startGame() {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    gameLoop();
}

function restartGame() {
    location.reload();
}

function spawnObstacle() {
    let lane = Math.floor(Math.random() * 3);
    obstacles.push({
        x: lanes[lane],
        y: -50,
        width: 50,
        height: 50
    });
}

function spawnCoin() {
    let lane = Math.floor(Math.random() * 3);
    coins.push({
        x: lanes[lane],
        y: -30,
        radius: 15
    });
}

setInterval(spawnObstacle, 1500);
setInterval(spawnCoin, 2000);

function update() {
    if (!gameRunning) return;

    player.x = lanes[currentLane];

    if (player.jumping) {
        player.velocityY += gravity;
        player.y += player.velocityY;

        if (player.y >= canvas.height - 150) {
            player.y = canvas.height - 150;
            player.jumping = false;
        }
    }

    obstacles.forEach((obs, index) => {
        obs.y += speed;
        if (obs.y > canvas.height) obstacles.splice(index, 1);

        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            endGame();
        }
    });

    coins.forEach((coin, index) => {
        coin.y += speed;
        if (coin.y > canvas.height) coins.splice(index, 1);

        let dx = player.x + player.width / 2 - coin.x;
        let dy = player.y + player.height / 2 - coin.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < coin.radius + player.width / 2) {
            score += 10;
            coins.splice(index, 1);
        }
    });

    score++;
    if (score % 200 === 0) speed += 0.5;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - 25, player.y, player.width, player.height);

    ctx.fillStyle = "red";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x - 25, obs.y, obs.width, obs.height);
    });

    ctx.fillStyle = "gold";
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    document.getElementById("gameOver").classList.remove("hidden");
    document.getElementById("finalScore").innerText = score;

    if (score > highScore) {
        localStorage.setItem("skyHighScore", score);
    }
}

window.addEventListener("touchstart", handleTouchStart, false);
window.addEventListener("touchend", handleTouchEnd, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchEnd(evt) {
    if (!xDown || !yDown) return;

    let xUp = evt.changedTouches[0].clientX;
    let yUp = evt.changedTouches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && currentLane > 0) currentLane--;
        else if (xDiff < 0 && currentLane < 2) currentLane++;
    } else {
        if (yDiff > 0 && !player.jumping) {
            player.jumping = true;
            player.velocityY = -15;
        }
    }

    xDown = null;
    yDown = null;
}
