/* collision.js */

let collisionCooldown = false;
let invincibleTimer   = null;

/* =====================
   DETECÇÃO GENÉRICA
   ===================== */

function isColliding(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();

  // Reduz hitbox em 20% para ser mais justo
  const margin = 12;
  return (
    r1.left   + margin < r2.right  - margin &&
    r1.right  - margin > r2.left   + margin &&
    r1.top    + margin < r2.bottom - margin &&
    r1.bottom - margin > r2.top    + margin
  );
}

/* =====================
   LOOP DE COLISÕES
   ===================== */

function checkCollisions() {
  if (gameState !== 'playing') return;

  const marciEl    = document.getElementById('marci');
  const obstacles  = document.querySelectorAll('.garlic, .stake');
  const suspended  = document.querySelectorAll('.sun, .fool');
  const enemies    = document.querySelectorAll('.enemy');

  // Obstáculos no chão
  obstacles.forEach(obs => {
    if (isColliding(marciEl, obs)) {
      takeDamage();
    }
  });

  // Obstáculos suspensos — só colidem se marci NÃO estiver agachada
  if (!isCrouching) {
    suspended.forEach(obs => {
      if (isColliding(marciEl, obs)) {
        takeDamage();
      }
    });
  }

  // Inimigos
  enemies.forEach(enemy => {
    if (isColliding(marciEl, enemy)) {
      if (isAttacking || keys[' ']) {
        // Marci está atacando: dano no inimigo
        damageEnemy(enemy);
        spawnAttackEffect(enemy);
      } else {
        // Marci levou dano
        takeDamage();
      }
    }
  });
}

/* =====================
   DANO NA MARCI
   ===================== */

function takeDamage() {
  if (collisionCooldown) return;

  lives--;
  updateLivesUI(lives);
  showDamageFlash();

  if (typeof playSound === 'function') playSound('hurt');

  // Invencibilidade temporária
  collisionCooldown = true;
  marci.classList.add('invincible');

  clearTimeout(invincibleTimer);
  invincibleTimer = setTimeout(() => {
    collisionCooldown = false;
    marci.classList.remove('invincible');
  }, 1200);

  if (lives <= 0) {
    triggerGameOver();
  }
}

/* =====================
   EFEITO VISUAL DE ATAQUE
   ===================== */

function spawnAttackEffect(target) {
  const board = document.getElementById('game-board');
  const rect  = target.getBoundingClientRect();
  const bRect = board.getBoundingClientRect();

  const fx = document.createElement('div');
  fx.classList.add('attack-effect');
  fx.style.left = (rect.left - bRect.left + rect.width / 2 - 30) + 'px';
  fx.style.top  = (rect.top  - bRect.top  + rect.height / 2 - 30) + 'px';
  board.appendChild(fx);
  setTimeout(() => fx.remove(), 350);
}