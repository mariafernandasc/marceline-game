const marci = document.querySelector('.marci-run');
const garlic = document.querySelector('.garlic');

// Lista dos três frames da corrida
const frames = [
  './assets/images/marci-run1.png',
  './assets/images/marci-run2.png',
  './assets/images/marci-run3.png'
];

let currentFrame = 0;
let runInterval = setInterval(animateRun, 150);

// Alterna os frames para simular corrida
function animateRun() {
  marci.style.backgroundImage = `url(${frames[currentFrame]})`;
  currentFrame = (currentFrame + 1) % frames.length;
}

/*setInterval(animateRun, 150); // troca a cada 150ms*/

const jump = () => {
    marci.classList.add('jump');
    setTimeout(() => { marci.classList.remove('jump'); }, 600);
}

const loop = setInterval(() => {

    const garlicPosition = garlic.offsetLeft;
    const marciPosition = +window.getComputedStyle(marci).bottom.replace('px','');

    if (garlicPosition <= 113 && marciPosition < 75) {
        garlic.style.animation = 'none';
        garlic.style.left = `${garlicPosition}px`;

        marci.style.animation = 'none';
        marci.style.bottom = `${marciPosition}px`;

        clearInterval(runInterval);
        marci.style.backgroundImage = "url('./assets/images/marci-gameover.png')";
    }
}, 10);

document.addEventListener('keydown', jump)