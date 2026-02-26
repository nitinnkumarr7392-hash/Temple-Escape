const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const gameOverScreen = document.getElementById("gameOver");
const game = document.querySelector(".game");

let lane = 1;
let score = 0;
let coins = 0;
let speed = 6;
let gameRunning = true;
let jumping = false;
let sliding = false;

const lanes = [
window.innerWidth/6,
window.innerWidth/2 - 30,
window.innerWidth - window.innerWidth/6 - 60
];

function updateLane(){
player.style.left = lanes[lane]+"px";
}
updateLane();

function moveLeft(){ if(lane>0) lane--; updateLane(); }
function moveRight(){ if(lane<2) lane++; updateLane(); }

function jump(){
if(jumping) return;
jumping=true;
let height=0;

let up=setInterval(()=>{
if(height>=120){
clearInterval(up);
let down=setInterval(()=>{
if(height<=0){
clearInterval(down);
jumping=false;
}
height-=8;
player.style.bottom=120+height+"px";
},20);
}
height+=8;
player.style.bottom=120+height+"px";
},20);
}

function slide(){
if(sliding) return;
sliding=true;
player.style.height="30px";
setTimeout(()=>{
player.style.height="60px";
sliding=false;
},500);
}

function createObstacle(){
if(!gameRunning) return;

let obstacle=document.createElement("div");
obstacle.classList.add("obstacle");
let laneIndex=Math.floor(Math.random()*3);
obstacle.style.left=lanes[laneIndex]+"px";
game.appendChild(obstacle);

let pos=-80;

let interval=setInterval(()=>{
if(!gameRunning){
clearInterval(interval);
obstacle.remove();
return;
}

pos+=speed;
obstacle.style.top=pos+"px";

let pRect=player.getBoundingClientRect();
let oRect=obstacle.getBoundingClientRect();

if(
pRect.left<oRect.right &&
pRect.right>oRect.left &&
pRect.top<oRect.bottom &&
pRect.bottom>oRect.top
){
gameOver();
}

if(pos>window.innerHeight){
clearInterval(interval);
obstacle.remove();
score++;
speed+=0.2;
scoreEl.innerText=score;
}
},20);
}

function createCoin(){
if(!gameRunning) return;

let coin=document.createElement("div");
coin.classList.add("coin");
let laneIndex=Math.floor(Math.random()*3);
coin.style.left=lanes[laneIndex]+15+"px";
game.appendChild(coin);

let pos=-60;

let interval=setInterval(()=>{
if(!gameRunning){
clearInterval(interval);
coin.remove();
return;
}

pos+=speed;
coin.style.top=pos+"px";

let pRect=player.getBoundingClientRect();
let cRect=coin.getBoundingClientRect();

if(
pRect.left<cRect.right &&
pRect.right>cRect.left &&
pRect.top<cRect.bottom &&
pRect.bottom>cRect.top
){
coins++;
coinsEl.innerText=coins;
clearInterval(interval);
coin.remove();
}

if(pos>window.innerHeight){
clearInterval(interval);
coin.remove();
}
},20);
}

function gameOver(){
gameRunning=false;
gameOverScreen.classList.remove("hidden");
}

function restartGame(){
location.reload();
}

let startX=0;
let startY=0;

document.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX;
startY=e.touches[0].clientY;
});

document.addEventListener("touchend",e=>{
let endX=e.changedTouches[0].clientX;
let endY=e.changedTouches[0].clientY;

let dx=endX-startX;
let dy=endY-startY;

if(Math.abs(dx)>Math.abs(dy)){
if(dx>50) moveRight();
if(dx<-50) moveLeft();
}else{
if(dy<-50) jump();
if(dy>50) slide();
}
});

setInterval(createObstacle,1200);
setInterval(createCoin,1800);
