/* considzenyte.js — Inimigos com barra de vida + IA de ataque */

let attackCooldown = false;

/* =====================
   CONFIGURAÇÃO DE IA POR TIPO
   cada inimigo tem velocidade, alcance de detecção e cadência de ataque próprios
   ===================== */
const enemyAI = {
  ricardio:   { speed: 1.5, detectionRange: 350, attackInterval: 1800 },
  hierofante: { speed: 2.0, detectionRange: 400, attackInterval: 1400 },
  imperatriz: { speed: 2.5, detectionRange: 450, attackInterval: 1100 },
};

/* =====================
   CRIAR INIMIGO
   ===================== */
function createEnemy(type, x, maxLives) {
  const board = document.getElementById('game-board');

  const enemy = document.createElement('div');
  enemy.classList.add(type, 'enemy');
  enemy.style.left       = x + 'px';
  enemy.dataset.lives    = maxLives;
  enemy.dataset.maxLives = maxLives;
  enemy.dataset.type     = type;
  enemy.dataset.enemyX   = x;  // posição numérica rastreada pelo JS

  // Label de vida
  const label = document.createElement('div');
  label.classList.add('enemy-lives-label');
  label.textContent = `${maxLives}/${maxLives}`;
  enemy.appendChild(label);

  // Barra de vida
  const bar = document.createElement('div');
  bar.classList.add('health-bar');
  const inner = document.createElement('div');
  inner.classList.add('health-bar-inner');
  inner.style.width = '100%';
  bar.appendChild(inner);
  enemy.appendChild(bar);

  board.appendChild(enemy);

  // Inicia loop de IA
  startEnemyAI(enemy);

  return enemy;
}

/* =====================
   LOOP DE IA DO INIMIGO
   ===================== */
function startEnemyAI(enemy) {
  const type   = enemy.dataset.type;
  const cfg    = enemyAI[type] || enemyAI.ricardio;

  // Timer de ataque independente para cada inimigo
  const attackTimer = setInterval(() => {
    if (gameState !== 'playing') return;
    if (!enemy.isConnected) { clearInterval(attackTimer); return; }

    const dist = getDistanceToMarci(enemy);

    // Só ataca se estiver perto o suficiente
    if (dist < 160) {
      enemyAttack(enemy);
    }
  }, cfg.attackInterval);

  // Movimento: guardamos o interval no elemento para limpar ao morrer
  enemy._attackTimer = attackTimer;

  // Loop de movimento (roda junto com o gameLoop via requestAnimationFrame seria
  // caro por inimigo; usamos setInterval leve de 50ms = ~20fps para a IA)
  const moveTimer = setInterval(() => {
    if (gameState !== 'playing') return;
    if (!enemy.isConnected) { clearInterval(moveTimer); return; }

    moveEnemyTowardsMarci(enemy, cfg.speed);
  }, 50);

  enemy._moveTimer = moveTimer;
}

/* =====================
   MOVIMENTO EM DIREÇÃO À MARCI
   ===================== */
function moveEnemyTowardsMarci(enemy, speed) {
  const dist = getDistanceToMarci(enemy);

  // Para de perseguir se estiver muito longe (fora de detecção)
  const cfg = enemyAI[enemy.dataset.type] || enemyAI.ricardio;
  if (dist > cfg.detectionRange) return;

  let ex = parseFloat(enemy.dataset.enemyX);

  // Movimenta na direção da marci
  if (marciX < ex - 10) {
    ex -= speed;
    enemy.style.transform = 'scaleX(1)'; // virado para esquerda
  } else if (marciX > ex + 10) {
    ex += speed;
    enemy.style.transform = 'scaleX(-1)'; // virado para direita
  }

  enemy.dataset.enemyX = ex;
  enemy.style.left = ex + 'px';
}

/* =====================
   ATAQUE DO INIMIGO
   ===================== */
function enemyAttack(enemy) {
  // Flash laranja no inimigo indicando que está atacando
  enemy.style.filter = 'brightness(2) sepia(1) saturate(3)';
  setTimeout(() => { if (enemy.isConnected) enemy.style.filter = ''; }, 200);

  // Projétil visual simples
  spawnEnemyProjectile(enemy);
}

function spawnEnemyProjectile(enemy) {
  const board  = document.getElementById('game-board');
  const ex     = parseFloat(enemy.dataset.enemyX);
  const goLeft = ex > marciX; // projétil vai para a esquerda se inimigo está à direita

  const proj = document.createElement('div');
  proj.classList.add('enemy-projectile');
  proj.style.left   = (ex + (goLeft ? 0 : enemy.offsetWidth)) + 'px';
  // Centraliza verticalmente no inimigo
  proj.style.bottom = (parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--ground-level')) + enemy.offsetHeight / 2 - 10) + 'px';
  board.appendChild(proj);

  // Anima o projétil
  let px    = parseFloat(proj.style.left);
  const dir = goLeft ? -6 : 6;

  const projTimer = setInterval(() => {
    if (gameState !== 'playing' || !proj.isConnected) {
      clearInterval(projTimer);
      proj.remove();
      return;
    }

    px += dir;
    proj.style.left = px + 'px';

    // Verifica colisão com Marci
    if (isColliding(marci, proj)) {
      clearInterval(projTimer);
      proj.remove();
      takeDamage();
      return;
    }

    // Remove ao sair da tela
    if (px < marciX - 600 || px > marciX + 600) {
      clearInterval(projTimer);
      proj.remove();
    }
  }, 20);
}

/* =====================
   DISTÂNCIA ATÉ A MARCI
   ===================== */
function getDistanceToMarci(enemy) {
  const ex = parseFloat(enemy.dataset.enemyX);
  return Math.abs(ex - marciX);
}

/* =====================
   DANO NO INIMIGO (ataque da marci)
   ===================== */
function damageEnemy(enemy) {
  if (attackCooldown) return;

  attackCooldown = true;
  setTimeout(() => attackCooldown = false, 300);

  let hp    = parseInt(enemy.dataset.lives) - 1;
  const max = parseInt(enemy.dataset.maxLives);
  enemy.dataset.lives = hp;

  const inner = enemy.querySelector('.health-bar-inner');
  if (inner) inner.style.width = Math.max(0, (hp / max) * 100) + '%';

  const label = enemy.querySelector('.enemy-lives-label');
  if (label) label.textContent = `${Math.max(0, hp)}/${max}`;

  enemy.style.filter = 'brightness(3) saturate(0)';
  setTimeout(() => { if (enemy.isConnected) enemy.style.filter = ''; }, 100);

  if (typeof playSound === 'function') playSound('hit');

  if (hp <= 0) {
    // Para os timers de IA
    clearInterval(enemy._attackTimer);
    clearInterval(enemy._moveTimer);

    enemy.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      enemy.remove();
      score += 100;
      updateScoreUI(score);
      if (typeof playSound === 'function') playSound('defeat');
    }, 300);
  }
}