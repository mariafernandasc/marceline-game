/* player.js */

const marci = document.querySelector('.marci-run');

const frames = [
  './assets/images/marci-run1.png',
  './assets/images/marci-run2.png',
  './assets/images/marci-run3.png'
];

let currentFrame = 0;
let marciX = 0;

function animateRun() {
  marci.style.backgroundImage = `url(${frames[currentFrame]})`;
  currentFrame = (currentFrame + 1) % frames.length;
}

setInterval(animateRun, 150);

function moveRight() {
  marciX += 5;

  marci.style.left = marciX + 'px';

  const viewport = document.querySelector('.viewport');

  viewport.scrollLeft = marciX - 300;
}

function moveLeft() {
  marciX -= 10;

  if (marciX < 0) {
    marciX = 0;
  }

  marci.style.left = marciX + 'px';
}

function jump() {
  if (!marci.classList.contains('jump')) {
    marci.classList.add('jump');

    setTimeout(() => {
      marci.classList.remove('jump');
    }, 600);
  }
}

function crouch() {
  marci.classList.add('crouch');
}

function standUp() {
  marci.classList.remove('crouch');
}