/*logica de colisao*/

function isColliding(obj1, obj2) {

  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function checkCollisions() {

  const marci = document.querySelector('.marci-run');

  if (isColliding(marci, garlic)) {

    console.log("bateu no alho");

    lives--;

    updateLives(lives);
  }

  if (isColliding(marci, stake)) {

    console.log("bateu na estaca");

    lives--;

    updateLives(lives);
  }
}