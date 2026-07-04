/* victory.js */

function showVictory(completedPhase) {
  gameState = 'victory';

  const isFinal = completedPhase >= 3;

  if (isFinal) {
    showFinalVictory();
    return;
  }

  // --- Vitória entre fases ---
  const overlay = document.getElementById('overlay-victory');
  const text    = document.getElementById('victory-text');
  const sub     = document.getElementById('victory-sub');
  const msgs    = ['🎉 Fase 1 concluída!', '🏆 Fase 2 concluída!'];

  text.textContent = msgs[completedPhase - 1] || '🎉 Fase concluída!';
  sub.textContent  = 'Aguarde próxima fase...';
  overlay.classList.remove('hidden');

  setTimeout(() => {
    overlay.classList.add('hidden');
    lives = 5;
    updateLivesUI(lives);
    loadPhase(completedPhase);
    gameState = 'playing';
  }, 3000);
}

/* =====================
   VITÓRIA FINAL
   ===================== */

function showFinalVictory() {
  gameState = 'victory';
  stopMusic();

  score += 500;
  updateScoreUI(score);
  saveHighScore(score);

  // Preenche os dados
  document.getElementById('fv-score').textContent = score;
  document.getElementById('fv-lives').textContent = '❤️'.repeat(Math.max(0, lives));

  // Frase aleatória
  const quotes = [
    '"Eu sou Marceline, a Rainha dos Vampiros.<br>E eu acabei de provar isso."',
    '"Às vezes ser má demais é o que salva o mundo."',
    '"Eles acharam que podiam me parar.<br>Spoiler: não podiam."'
  ];
  document.getElementById('fv-message').innerHTML =
    quotes[Math.floor(Math.random() * quotes.length)];

  if (typeof playSound === 'function') playSound('victory');

  document.getElementById('overlay-final-victory').classList.remove('hidden');

  // Enter reinicia da fase 1
  const handler = (e) => {
    if (e.key === 'Enter') {
      document.removeEventListener('keydown', handler);
      document.getElementById('overlay-final-victory').classList.add('hidden');
      lastPhase = 1;
      restartGame();
    }
  };
  document.addEventListener('keydown', handler);
}