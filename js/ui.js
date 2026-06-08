/* ui.js — Interface HUD */

function updateLivesUI(value) {
  const el = document.getElementById('hud-lives');
  if (el) el.textContent = '❤️'.repeat(Math.max(0, value));
}

function updateScoreUI(value) {
  const el = document.getElementById('hud-score');
  if (el) el.textContent = value;
}

function updatePhaseUI(value) {
  const el = document.getElementById('hud-phase');
  if (el) el.textContent = 'Fase ' + value;
}

function showDamageFlash() {
  const flash = document.createElement('div');
  flash.classList.add('damage-flash');
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);
}