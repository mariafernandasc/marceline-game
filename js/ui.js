/* elementos */
/* ui.js */

const scoreText = document.querySelector('.score');
const livesText = document.querySelector('.lives');

function updateScore(score) {
  scoreText.innerText = `Score: ${score}`;
}

function updateLives(lives) {

  let hearts = "";

  for (let i = 0; i < lives; i++) {
    hearts += "❤️";
  }

  livesText.innerText = hearts;
}