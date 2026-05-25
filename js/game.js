/* estados */

let gameState = "playing";

let score = 0;
let lives = 5;
let phase = 1;

/* loop principal */

updateLives(lives);

const viewport = document.querySelector('.viewport');

function updateCamera() {

  viewport.scrollLeft = marciX - 400;

}

function gameLoop() {

  if (gameState === "playing") {

    console.log(keys);

    if (keys["ArrowRight"]) {
      moveRight();
    }

    if (keys["ArrowLeft"]) {
      moveLeft();
    }

    checkCollisions();

  }

  requestAnimationFrame(gameLoop);
}

gameLoop();