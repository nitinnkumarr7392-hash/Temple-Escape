const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let score = 0;
let speed = 6;
let gravity = 0.8;

const lanes = [140, 240, 340];

let player = {
  lane:1,
  x:lanes[1],
  y:500,
  width:40,
  height:60,
  dy:0,
  jumping:false
};

let obstacles = [];

function startGame(){
  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameContainer").style.display="block";
  resetGame();
  gameRunning=true;
  gameLoop();
}

function resetGame(){
  score=0;
  speed=6;
  obstacles=[];
  player.lane=1;
  player.x=lanes[1];
  player.y=500;
}

function restartGame(){
  document.getElementById("gameOver").style.display="none";
  document.getElementById("gameContainer").style.display="block";
  resetGame();
  gameRunning=true;
  gameLoop();
}

document.addEventListener("keydown", e=>{
  if(e.code==="ArrowLeft" && player.lane>0){
    player.lane--;
  }
  if(e.code==="ArrowRight" && player.lane<2){
    player.lane++;
  }
  if(e.code==="ArrowUp" && !player.jumping){
    player.dy=-15;
    player.jumping=true;
  }
});

function spawnObstacle(){
  if(Math.random()<0.02){
    let lane=Math.floor(Math.random()*3);
    obstacles.push({
      lane:lane,
      x:lanes[lane],
      y:-60,
      width:40,
      height:60
    });
  }
}

function update(){
  if(!gameRunning) return;

  score++;
  if(score%800===0) speed+=0.5;

  player.x += (lanes[player.lane]-player.x)*0.2;

  player.dy+=gravity;
  player.y+=player.dy;

  if(player.y>=500){
    player.y=500;
    player.jumping=false;
    player.dy=0;
  }

  obstacles.forEach((obs,i)=>{
    obs.y+=speed;
    if(collision(player,obs)){
      endGame();
    }
    if(obs.y>650){
      obstacles.splice(i,1);
    }
  });

  spawnObstacle();
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

  ctx.fillStyle="#222";
  ctx.fillRect(100,0,280,600);

  ctx.fillStyle="white";
  ctx.fillRect(200,0,4,600);
  ctx.fillRect(300,0,4,600);

  ctx.fillStyle="red";
  ctx.fillRect(player.x,player.y,player.width,player.height);

  ctx.fillStyle="black";
  obstacles.forEach(obs=>{
    ctx.fillRect(obs.x,obs.y,obs.width,obs.height);
  });

  document.getElementById("score").innerText="Score: "+score;
}

function gameLoop(){
  update();
  draw();
  if(gameRunning) requestAnimationFrame(gameLoop);
}

function endGame(){
  gameRunning=false;
  document.getElementById("gameContainer").style.display="none";
  document.getElementById("gameOver").style.display="block";
  document.getElementById("finalScore").innerText="Score: "+score;
}
