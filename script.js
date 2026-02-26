const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerName = "";
let score = 0;
let speed = 5;
let gravity = 0.8;
let gameRunning = false;

let player = {
  x: 100,
  y: 500,
  width: 40,
  height: 40,
  dy: 0,
  jumping: false
};

let obstacles = [];
let coins = [];

function startGame(){
  playerName = document.getElementById("playerName").value.trim();
  if(playerName === "") return alert("Enter Name");

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "block";

  resetGame();
  gameRunning = true;
  gameLoop();
}

function resetGame(){
  score = 0;
  speed = 5;
  obstacles = [];
  coins = [];
  player.y = 500;
}

function restartGame(){
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "block";
  resetGame();
  gameRunning = true;
  gameLoop();
}

document.addEventListener("keydown", e => {
  if(e.code === "ArrowUp" && !player.jumping){
    player.dy = -15;
    player.jumping = true;
  }
  if(e.code === "ArrowLeft") player.x -= 30;
  if(e.code === "ArrowRight") player.x += 30;
});

function spawnObjects(){
  if(Math.random() < 0.02){
    obstacles.push({x:480, y:520, width:30, height:40});
  }
  if(Math.random() < 0.015){
    coins.push({x:480, y:450, width:20, height:20});
  }
}

function update(){
  if(!gameRunning) return;

  score++;
  if(score % 500 === 0) speed++;

  player.dy += gravity;
  player.y += player.dy;

  if(player.y >= 500){
    player.y = 500;
    player.jumping = false;
  }

  obstacles.forEach((obs,i)=>{
    obs.x -= speed;
    if(collision(player,obs)) endGame();
    if(obs.x < -50) obstacles.splice(i,1);
  });

  coins.forEach((coin,i)=>{
    coin.x -= speed;
    if(collision(player,coin)){
      score += 50;
      coins.splice(i,1);
    }
    if(coin.x < -50) coins.splice(i,1);
  });

  spawnObjects();
}

function collision(a,b){
  return(
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function draw(){
  ctx.clearRect(0,0,480,600);

  ctx.fillStyle="green";
  ctx.fillRect(0,550,480,50);

  ctx.fillStyle="red";
  ctx.fillRect(player.x,player.y,player.width,player.height);

  ctx.fillStyle="black";
  obstacles.forEach(obs=>ctx.fillRect(obs.x,obs.y,obs.width,obs.height));

  ctx.fillStyle="yellow";
  coins.forEach(coin=>ctx.fillRect(coin.x,coin.y,coin.width,coin.height));

  document.getElementById("score").innerText="Score: "+score;
  document.getElementById("speed").innerText="Speed: "+speed;
}

function gameLoop(){
  update();
  draw();
  if(gameRunning) requestAnimationFrame(gameLoop);
}

function endGame(){
  gameRunning=false;
  saveScore();
  document.getElementById("gameUI").style.display="none";
  document.getElementById("gameOverScreen").style.display="block";
  document.getElementById("finalScore").innerText="Your Score: "+score;
  loadLeaderboard();
}

function saveScore(){
  let scores = JSON.parse(localStorage.getItem("jungleDash")) || [];
  scores.push({name:playerName,score:score});
  scores.sort((a,b)=>b.score-a.score);
  scores = scores.slice(0,5);
  localStorage.setItem("jungleDash",JSON.stringify(scores));
}

function loadLeaderboard(){
  let scores = JSON.parse(localStorage.getItem("jungleDash")) || [];
  let list = document.getElementById("leaderboard");
  list.innerHTML="";
  scores.forEach(s=>{
    let li=document.createElement("li");
    li.innerText=s.name+" - "+s.score;
    list.appendChild(li);
  });
}
