/* game.js — Loop principal e gerenciamento de estados */

/* =====================
   ESTADO GLOBAL
   ===================== */

let gameState = 'menu';
let score     = 0;
let lives     = 5;
let phase     = 1;

/* =====================
   CONFIGURAÇÃO DAS FASES
   ===================== */

const phases = [
  {
    // FASE 1
    background: './assets/images/background_fase1.png',
    music: 0,
    obstacles: [
      { type: 'stake',  x: 500  },
      { type: 'garlic', x: 1000 },
      { type: 'stake',  x: 1600 },
      { type: 'garlic', x: 2200 },
      { type: 'stake',  x: 2800 },
      { type: 'garlic', x: 3400 },
    ],
    enemies: [
      { type: 'ricardio', x: 4200, lives: 10 }
    ],
    endX: 5500
  },
  {
    // FASE 2
    background: './assets/images/background_fase2.png',
    music: 1,
    obstacles: [
      { type: 'garlic', x: 500  },
      { type: 'stake',  x: 1000 },
      { type: 'sun',    x: 1500 },
      { type: 'garlic', x: 2000 },
      { type: 'stake',  x: 2500 },
      { type: 'sun',    x: 3000 },
      { type: 'garlic', x: 3500 },
      { type: 'stake',  x: 4000 },
    ],
    enemies: [
      { type: 'hierofante', x: 4600, lives: 15 }
    ],
    endX: 5500
  },
  {
    // FASE 3
    background: './assets/images/background_fase3.png',
    music: 2,
    obstacles: [
      { type: 'garlic', x: 500  },
      { type: 'fool',   x: 900  },
      { type: 'sun',    x: 1400 },
      { type: 'garlic', x: 2000 },
      { type: 'stake',  x: 2550 },
      { type: 'fool',   x: 2850 },
      { type: 'garlic', x: 3150 },
      { type: 'sun',    x: 3450 },
      { type: 'stake',  x: 3750 },
      { type: 'sun',    x: 4050 },
    ],
    enemies: [
      { type: 'imperatriz', x: 4900, lives: 18 }
    ],
    endX: 5500
  }
];

/* =====================
   LOOP PRINCIPAL
   ===================== */

let loopRunning = false;

function gameLoop() {
  if (gameState === 'playing') {
    if (keys['ArrowRight']) moveRight();
    else if (keys['ArrowLeft']) moveLeft();

    updateCamera();
    checkCollisions();
    checkPhaseCompletion();
  }

  requestAnimationFrame(gameLoop);
}

/* =====================
   CARREGAR FASE
   ===================== */

function loadPhase(index) {
  const cfg   = phases[index];
  const board = document.getElementById('game-board');

  // Fundo
  board.style.backgroundImage = `url(${cfg.background})`;

  // Remove elementos anteriores (mantém marci e ground)
  board.querySelectorAll('.garlic, .stake, .sun, .fool, .enemy, .attack-effect, .phase-portal')
       .forEach(el => el.remove());

  // Obstáculos
  cfg.obstacles.forEach(obs => {
    const el = document.createElement('div');
    el.classList.add(obs.type);
    el.style.left = obs.x + 'px';
    board.appendChild(el);
  });

  // Inimigos
  cfg.enemies.forEach(e => createEnemy(e.type, e.x, e.lives));

  // Portal de fim de fase
  createPhasePortal(cfg.endX);

  // HUD
  updatePhaseUI(index + 1);
  phase = index + 1;

  // Música
  playPhaseMusic(cfg.music);

  // Reseta posição da marci
  marciX = 80;
  marci.style.left = marciX + 'px';
}

/* =====================
   PORTAL DE FIM DE FASE
   ===================== */

function createPhasePortal(x) {
  const board = document.getElementById('game-board');

  const portal = document.createElement('div');
  portal.classList.add('phase-portal');
  portal.style.left = x + 'px';

  // Moldura
  const frame = document.createElement('div');
  frame.classList.add('portal-frame');
  portal.appendChild(frame);

  // Label
  const label = document.createElement('div');
  label.classList.add('portal-label');
  label.textContent = '✦ CHEGADA ✦';
  portal.appendChild(label);

  board.appendChild(portal);
  return portal;
}

/* =====================
   CHECAR CONCLUSÃO DE FASE
   ===================== */

let phaseEndTriggered = false;

function checkPhaseCompletion() {
  if (phaseEndTriggered) return;

  const portal  = document.querySelector('.phase-portal');
  const enemies = document.querySelectorAll('.enemy');
  if (!portal) return;

  // Só abre o portal visualmente quando não há mais inimigos
  const portalActive = enemies.length === 0;
  portal.style.opacity = portalActive ? '1' : '0.3';
  portal.style.filter  = portalActive ? '' : 'saturate(0)';

  if (!portalActive) return;

  // Verifica se Marci tocou o portal
  if (isColliding(marci, portal)) {
    phaseEndTriggered = true;

    // Flash branco de entrada
    const flash = document.createElement('div');
    flash.classList.add('portal-flash');
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);

    setTimeout(() => {
      phaseEndTriggered = false;
      if (typeof playSound === 'function') playSound('victory');
      showVictory(phase);
    }, 300);
  }
}

/* =====================
   RECORDE (localStorage)
   ===================== */

function getHighScore() {
  return parseInt(localStorage.getItem('marciHighScore') || '0');
}

function saveHighScore(value) {
  if (value > getHighScore()) {
    localStorage.setItem('marciHighScore', value);
  }
}

function updateHighScoreUI() {
  const el = document.getElementById('hud-highscore');
  if (el) el.textContent = getHighScore();
}

let lastPhase = 1;

function triggerGameOver() {
  gameState = 'gameover';
  lastPhase = phase;

  stopMusic();
  if (typeof playSound === 'function') playSound('gameover');

  saveHighScore(score);

  document.getElementById('final-score').textContent     = score;
  document.getElementById('final-highscore').textContent = getHighScore();
  document.getElementById('overlay-gameover').classList.remove('hidden');

  marci.style.backgroundImage = "url('./assets/images/marci-gameover.png')";
}

/* =====================
   REINICIAR
   ===================== */

function restartGame() {
  gameState = 'playing';
  score     = 0;
  lives     = 5;
  phase     = lastPhase;

  document.getElementById('overlay-gameover').classList.add('hidden');
  document.getElementById('overlay-final-victory').classList.add('hidden');

  updateLivesUI(lives);
  updateScoreUI(score);

  showScreen('screen-game');
  loadPhase(lastPhase - 1);
}

/* =====================
   PAUSE
   ===================== */

function pauseGame() {
  if (gameState !== 'playing') return;
  gameState = 'paused';
  pauseMusic();
  document.getElementById('overlay-pause').classList.remove('hidden');
}

function resumeGame() {
  if (gameState !== 'paused') return;
  gameState = 'playing';
  resumeMusic();
  document.getElementById('overlay-pause').classList.add('hidden');
}

/* =====================
   NAVEGAÇÃO DE TELAS
   ===================== */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function startGame() {
  showScreen('screen-game');
  gameState = 'playing';
  score     = 0;
  lives     = 5;
  phase     = 1;

  updateLivesUI(lives);
  updateScoreUI(score);

  loadPhase(0);

  // Garante que o loop só inicia uma vez
  if (!loopRunning) {
    loopRunning = true;
    gameLoop();
  }
}

function showInstructions() {
  showScreen('screen-instructions');
}

function backToMenu() {
  showScreen('screen-menu');
}

function goToMenu() {
  stopMusic();
  gameState = 'menu';
  document.getElementById('overlay-pause').classList.add('hidden');
  document.getElementById('overlay-gameover').classList.add('hidden');
  document.getElementById('overlay-victory').classList.add('hidden');
  document.getElementById('overlay-final-victory').classList.add('hidden');
  showScreen('screen-menu');
}

/* =====================
   INIT
   ===================== */

// Mostra menu ao carregar
showScreen('screen-menu');

// gameLoop não inicia aqui — é chamado por startGame()