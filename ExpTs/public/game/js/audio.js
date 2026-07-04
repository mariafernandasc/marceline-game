/* audio.js
   Gerencia efeitos sonoros e músicas por fase.
   Se os arquivos de áudio não existirem, usa tons sintéticos via Web Audio API.
*/

let audioCtx       = null;
let bgMusic        = null;
let musicEnabled   = true;
let sfxEnabled     = true;

/* =====================
   CONFIGURAÇÕES — toggle
   ===================== */

function toggleMusic() {
  musicEnabled = !musicEnabled;
  const btn = document.getElementById('toggle-music');
  btn.textContent = musicEnabled ? 'ON' : 'OFF';
  btn.classList.toggle('off', !musicEnabled);

  if (musicEnabled) {
    // Retoma música da fase atual se estiver jogando
    if (typeof phase !== 'undefined' && gameState === 'playing') {
      playPhaseMusic(phases[phase - 1].music);
    }
  } else {
    stopMusic();
  }
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  const btn = document.getElementById('toggle-sfx');
  btn.textContent = sfxEnabled ? 'ON' : 'OFF';
  btn.classList.toggle('off', !sfxEnabled);
}

function showSettings() {
  showScreen('screen-settings');
}

/* Trilhas por fase (coloca os arquivos em assets/audio/) */
const phaseMusic = [
  '/game/assets/audio/fase1.mp3',
  '/game/assets/audio/fase2.mp3',
  '/game/assets/audio/fase3.mp3'
];

/* =====================
   SONS SINTÉTICOS (fallback)
   ===================== */

function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type = 'square', duration = 0.12, volume = 0.15) {
  if (!sfxEnabled) return;
  try {
    const ctx  = getAudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

/* =====================
   EFEITOS SONOROS
   ===================== */

function playSound(name) {
  if (!sfxEnabled) return;
  switch (name) {
    case 'jump':   playTone(440, 'sine', 0.15, 0.18); break;
    case 'attack': playTone(220, 'sawtooth', 0.1, 0.2); break;
    case 'hurt':   playTone(110, 'square', 0.25, 0.3); break;
    case 'hit':    playTone(330, 'square', 0.08, 0.2); break;
    case 'defeat': {
      playTone(523, 'sine', 0.1, 0.2);
      setTimeout(() => playTone(659, 'sine', 0.1, 0.2), 120);
      setTimeout(() => playTone(784, 'sine', 0.2, 0.2), 240);
      break;
    }
    case 'victory': {
      [523, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => playTone(f, 'sine', 0.18, 0.25), i * 120)
      );
      break;
    }
    case 'gameover': {
      [440, 330, 220, 165].forEach((f, i) =>
        setTimeout(() => playTone(f, 'sawtooth', 0.22, 0.3), i * 150)
      );
      break;
    }
  }
}

/* =====================
   MÚSICA DE FUNDO
   ===================== */

function playPhaseMusic(phaseIndex) {
  stopMusic();
  if (!musicEnabled) return;

  const src = phaseMusic[phaseIndex] || phaseMusic[0];
  bgMusic = new Audio(src);
  bgMusic.loop   = true;
  bgMusic.volume = 0.35;

  bgMusic.play().catch(() => {
    // arquivo não encontrado ou autoplay bloqueado — silencioso
    bgMusic = null;
  });
}

function stopMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMusic = null;
  }
}

function pauseMusic() {
  if (bgMusic && !bgMusic.paused) bgMusic.pause();
}

function resumeMusic() {
  if (bgMusic && bgMusic.paused) bgMusic.play().catch(() => {});
}
