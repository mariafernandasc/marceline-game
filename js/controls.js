console.log("controls carregado");

const keys = {};

document.addEventListener('keydown', (event) => {

  keys[event.key] = true;

  if (event.key === "ArrowUp") {
    jump();
  }

  if (event.key === "ArrowDown") {
    crouch();
  }

});

document.addEventListener('keyup', (event) => {

  keys[event.key] = false;

  if (event.key === "ArrowDown") {
    standUp();
  }

});