const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreElement = document.getElementById("score");
let score = 0;

function jump() {
    if (character.classList != "animate") {
        character.classList.add("animate");
        score++;
        scoreElement.innerHTML = "Score: " + score;
    }
    setTimeout(function() {
        character.classList.remove("animate");
    }, 500);
}

// Check for Collision (Game Over)
let checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    // Collision detection logic
    if (blockLeft < 90 && blockLeft > 50 && characterTop >= 130) {
        block.style.animation = "none";
        block.style.display = "none";
        alert("Game Over! Your Score: " + score);
        location.reload(); // Game restart karne ke liye
    }
}, 10);
