/* controls.js — Teclado */

const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // Previne scroll da página com setas
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
    e.preventDefault();
  }

  /* ---- Menu inicial ---- */
  if (gameState === 'menu') {
    if (e.key === 'Enter') {
      const selected = document.querySelector('.menu-btn.selected');
      if (selected) selected.click();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      navigateMenu(e.key === 'ArrowDown' ? 1 : -1);
    }
    return;
  }

  /* ---- Jogo ativo ---- */
  if (gameState === 'playing') {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') startRunAnimation();
    if (e.key === 'ArrowUp')   jump();
    if (e.key === 'ArrowDown') crouch();
    if (e.key === ' ')         attack();
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') pauseGame();
    return;
  }

  /* ---- Pausado ---- */
  if (gameState === 'paused') {
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') resumeGame();
    return;
  }

  /* ---- Game Over ---- */
  if (gameState === 'gameover') {
    if (e.key === 'Enter') restartGame();
    return;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;

  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    // Para animação só se nenhuma das duas direções estiver pressionada
    if (!keys['ArrowRight'] && !keys['ArrowLeft']) stopRunAnimation();
  }

  if (e.key === 'ArrowDown') standUp();
});

/* =====================
   NAVEGAÇÃO NO MENU
   ===================== */

function navigateMenu(dir) {
  const btns    = Array.from(document.querySelectorAll('#screen-menu .menu-btn'));
  const current = btns.findIndex(b => b.classList.contains('selected'));
  const next    = (current + dir + btns.length) % btns.length;
  btns.forEach(b => b.classList.remove('selected'));
  btns[next].classList.add('selected');
}