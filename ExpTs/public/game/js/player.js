/* player.js */

const marci = document.getElementById('marci');

const runFrames = [
  '/game/assets/images/marci-run1.png',
  '/game/assets/images/marci-run2.png',
  '/game/assets/images/marci-run3.png'
];

const crouchFrames = [
  '/game/assets/images/marci-crouch1.png',
  '/game/assets/images/marci-crouch2.png',
  '/game/assets/images/marci-crouch3.png'
];

const attackFrames = [
  '/game/assets/images/marci-attack1.png',
  '/game/assets/images/marci-attack2.png'
];

let currentFrame  = 0;
let marciX        = 80;
let isCrouching   = false;
let isJumping     = false;
let isAttacking   = false;
let runAnimation  = null;

/* =====================
   CÂMERA
   ===================== */

function updateCamera() {
  const viewport = document.getElementById('viewport');
  const board    = document.getElementById('game-board');

  const center      = marciX + marci.offsetWidth / 2;
  let scrollTarget  = center - viewport.offsetWidth / 2;

  if (scrollTarget < 0) scrollTarget = 0;
  const maxScroll = board.offsetWidth - viewport.offsetWidth;
  if (scrollTarget > maxScroll) scrollTarget = maxScroll;

  viewport.scrollLeft = scrollTarget;
}

/* =====================
   ANIMAÇÃO DE CORRIDA
   ===================== */

function animateRun() {
  if (isAttacking) return;
  const frameSet = isCrouching ? crouchFrames : runFrames;
  currentFrame = (currentFrame + 1) % frameSet.length;
  marci.style.backgroundImage = `url(${frameSet[currentFrame]})`;
}

function startRunAnimation() {
  if (runAnimation) return;
  currentFrame = 0;
  runAnimation = setInterval(animateRun, 130);
}

function stopRunAnimation() {
  if (!runAnimation) return;
  clearInterval(runAnimation);
  runAnimation = null;
  if (!isAttacking && !isCrouching) {
    marci.style.backgroundImage = `url(${runFrames[0]})`;
  }
}

/* =====================
   MOVIMENTO
   ===================== */

function moveRight() {
  marciX += 10;
  const maxX = document.getElementById('game-board').offsetWidth - marci.offsetWidth;
  if (marciX > maxX) marciX = maxX;
  marci.style.left      = marciX + 'px';
  marci.style.transform = 'scaleX(1)';
}

function moveLeft() {
  marciX -= 10;
  if (marciX < 0) marciX = 0;
  marci.style.left      = marciX + 'px';
  marci.style.transform = 'scaleX(-1)';
}

/* =====================
   PULO
   ===================== */

function jump() {
  if (isJumping || isCrouching) return;
  isJumping = true;
  marci.classList.add('jump');

  // Toca som de pulo se disponível
  if (typeof playSound === 'function') playSound('jump');

  setTimeout(() => {
    marci.classList.remove('jump');
    isJumping = false;
  }, 650);
}

/* =====================
   ABAIXAR
   ===================== */

function crouch() {
  if (isJumping) return;
  isCrouching = true;
  marci.classList.add('crouching');
  marci.style.backgroundImage = `url(${crouchFrames[0]})`;
}

function standUp() {
  isCrouching = false;
  marci.classList.remove('crouching');
  marci.style.backgroundImage = `url(${runFrames[0]})`;
}

/* =====================
   ATAQUE
   ===================== */

const attackSizes = [
  { w: '140px', h: '140px' },
  { w: '140px', h: '140px' },
];

function attack() {
  if (isAttacking) return;
  isAttacking = true;

  // attack1 — guitarra acima: caixa mais alta
  marci.style.width           = '140px';
  marci.style.height          = '220px';
  marci.style.bottom          = 'var(--ground-level)';
  marci.style.backgroundSize  = '100% 100%';
  marci.style.backgroundImage = `url(${attackFrames[0]})`;
  if (typeof playSound === 'function') playSound('attack');

  let f = 0;
  const atkAnim = setInterval(() => {
    f++;
    if (f < attackFrames.length) {
      // attack2 — guitarra à frente: caixa mais larga
      marci.style.width           = '280px';
      marci.style.height          = '140px';
      marci.style.backgroundSize  = '100% 100%';
      marci.style.backgroundImage = `url(${attackFrames[f]})`;
    } else {
      clearInterval(atkAnim);
      isAttacking = false;
      marci.style.width           = '140px';
      marci.style.height          = '140px';
      marci.style.backgroundSize  = 'contain';
      marci.style.backgroundImage = `url(${runFrames[0]})`;
    }
  }, 150);
}

/* =====================
   POSIÇÃO DO MARCI
   ===================== */

function getMarciBottom() {
  // retorna bottom em px atual (leva em conta pulo via animation)
  const rect = marci.getBoundingClientRect();
  const viewport = document.getElementById('viewport');
  const vpRect   = viewport.getBoundingClientRect();
  return (vpRect.bottom - rect.bottom);
}

/* Inicializa posição */
marci.style.left = marciX + 'px';
