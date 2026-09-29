/**
 * Síntese Completa de Bateria Virtual (Web Audio API)
 * Bumbo Duplo (Kick), Caixa (Snare), Tons (High, Mid, Low), Surdo (Floor Tom),
 * Chimbal Fechado/Aberto, Pratos de Ataque (Crash), Condução (Ride) e Splash.
 * 100% puro Web Audio, sem arquivos pesados, sem latência, resposta instantânea!
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// BUMBO (Kick)
export function playKick(freq = 150) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // 1. Corpo grave (Sub)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);
  gain.gain.setValueAtTime(1.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);

  // 2. Harmônico médio (Garante que toque no alto falante do celular)
  const punchOsc = ctx.createOscillator();
  const punchGain = ctx.createGain();
  punchOsc.type = 'triangle';
  punchOsc.frequency.setValueAtTime(freq * 1.6, now);
  punchOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
  punchGain.gain.setValueAtTime(0.7, now);
  punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  punchOsc.connect(punchGain);
  punchGain.connect(ctx.destination);
  punchOsc.start(now);
  punchOsc.stop(now + 0.25);

  // 3. Clique do batedor na pele (Ataque agudo)
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'square';
  clickOsc.frequency.setValueAtTime(3000, now);
  clickOsc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
  clickGain.gain.setValueAtTime(0.35, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.05);
}

// CAIXA (Snare)
export function playSnare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Ruído da esteira
  const bufferSize = ctx.sampleRate * 0.22;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1000, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.85, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // Corpo do tambor (Rimshot/Wood shell)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

  oscGain.gain.setValueAtTime(0.85, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  noise.start(now);
  osc.start(now);
  noise.stop(now + 0.22);
  osc.stop(now + 0.2);
}

// TONS (Tom 1, Tom 2, Tom 3) & SURDO (Floor Tom)
export function playTom(startFreq = 160, endFreq = 85, duration = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Corpo principal
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.6);
  gain.gain.setValueAtTime(1.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  // Ataque de baqueta para mais clareza
  const attack = ctx.createOscillator();
  const attackGain = ctx.createGain();
  attack.type = 'triangle';
  attack.frequency.setValueAtTime(startFreq * 2.5, now);
  attack.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);
  attackGain.gain.setValueAtTime(0.6, now);
  attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  attack.connect(attackGain);
  attackGain.connect(ctx.destination);
  attack.start(now);
  attack.stop(now + 0.12);
}

export function playTom1() {
  playTom(170, 95, 0.28);
}

export function playTom2() {
  playTom(145, 80, 0.32);
}

export function playTom3() {
  playTom(120, 65, 0.36);
}

export function playFloorTom() {
  playTom(95, 48, 0.45);
}

// CHIMBAL FECHADO (Close HH)
export function playHiHatClosed() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(8000, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.6, now);
  gain.gain.exponentialRampToValueAtTime(0.005, now + 0.05);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.05);
}

// Alias para compatibilidade
export const playHiHat = playHiHatClosed;

// CHIMBAL ABERTO (Open HH)
export function playHiHatOpen() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.35;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(6500, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.55, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.35);
}

// PRATO DE ATAQUE (Crash)
export function playCrash(tone = 4500) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.75;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(tone, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.65, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.75);
}

// PRATO SPLASH
export function playSplash() {
  playCrash(6000);
}

// PRATO DE CONDUÇÃO (Ride)
export function playRide() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sino metálico (Bell ping)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(590, now);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(845, now);

  oscGain.gain.setValueAtTime(0.35, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

  osc1.connect(oscGain);
  osc2.connect(oscGain);
  oscGain.connect(ctx.destination);

  // Ping de baqueta
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(4000, now);
  filter.Q.setValueAtTime(3, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.4, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  noise.start(now);

  osc1.stop(now + 0.85);
  osc2.stop(now + 0.85);
  noise.stop(now + 0.25);
}
