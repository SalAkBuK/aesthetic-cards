/**
 * Procedural Web Audio API Micro-Haptics Engine
 * Inspired by Teenage Engineering OP-1 & Dieter Rams industrial hardware.
 * Zero external audio assets required. Sub-millisecond latency.
 */
export class MicroHapticsEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.enabled = localStorage.getItem('aesthetic_sfx') !== 'false'; // default ON
    this.lastTickTime = 0;
    this.carrierOsc = null;
    this.carrierGain = null;
    this.carrierPlaying = false;
    this.carrierFreq = 440;
    this.carrierType = 'sine';
    this.initAudioContext();
  }

  initAudioContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.enabled ? 0.28 : 0, this.ctx.currentTime);

    // Setup real-time AnalyserNode for oscilloscope & spectrogram
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.82;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Auto-resume audio context on first user interaction
    const unlock = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  ensureContext() {
    if (!this.ctx) this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('aesthetic_sfx', this.enabled ? 'true' : 'false');
    if (this.ctx) {
      this.ensureContext();
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.enabled ? 0.28 : 0, now);
    }
    this.updateUI();
    if (this.enabled) {
      this.click();
    }
    return this.enabled;
  }

  updateUI() {
    const buttons = document.querySelectorAll('.sfx-toggle');
    buttons.forEach(btn => {
      if (this.enabled) {
        btn.classList.add('sfx-enabled');
        btn.classList.remove('sfx-muted');
        const text = btn.querySelector('.sfx-label');
        if (text) text.textContent = 'SFX: ON';
      } else {
        btn.classList.remove('sfx-enabled');
        btn.classList.add('sfx-muted');
        const text = btn.querySelector('.sfx-label');
        if (text) text.textContent = 'SFX: OFF';
      }
    });
  }

  // 1. Rotary Detent Tick (Hover over cards, nav links, buttons)
  // 6ms sine sweep: 2400Hz -> 1800Hz
  tick() {
    if (!this.enabled || !this.ctx || this.ctx.state === 'suspended') return;
    const now = performance.now();
    if (now - this.lastTickTime < 32) return; // Throttled to prevent cacophony
    this.lastTickTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.006);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.006);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.007);
  }

  // 2. Mechanical Relay Clack (Buttons, interactive triggers)
  // Dual-layer: 170Hz -> 45Hz triangle + 980Hz -> 220Hz snap
  click() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Body: dampened mechanical thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.035);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.036);

    // Transient: high snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(980, t);
    snapOsc.frequency.exponentialRampToValueAtTime(220, t + 0.012);

    snapGain.gain.setValueAtTime(0.16, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

    snapOsc.connect(snapGain);
    snapGain.connect(this.masterGain);
    snapOsc.start(t);
    snapOsc.stop(t + 0.013);
  }

  // 3. Servo Disengage (Opening technical dossier modal)
  // 130ms lowpass-filtered sawtooth sweep: 110Hz -> 320Hz, Q: 3.5
  modalOpen() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.13);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.13);
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // 4. Hydraulic Latch (Closing dossier modal / ESC)
  // 85ms damped sine: 260Hz -> 75Hz
  modalClose() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.085);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // 5. Harmonic Success Chime (Copying code, CLI snippet, actions)
  // Dual-tone rising fifth: D6 (1175Hz) -> A6 (1760Hz), 90ms
  success() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1175, 1760].forEach((freq, idx) => {
      const start = t + idx * 0.048;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.095);
    });
  }

  // 6. Telemetry Burst (Run simulation in dossier)
  // 3-tone rapid FM data pulse: 880Hz -> 1320Hz -> 1760Hz
  telemetry() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [880, 1320, 1760];
    freqs.forEach((freq, i) => {
      const start = t + i * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.09, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.026);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.028);
    });
  }

  // 7. Tactical Sonar Chirp (HUD Reticle Pings & Telemetry Targets)
  // Rapid rising frequency chirp: 420Hz -> 1800Hz with exponential decay
  playChirp(startFreq = 420, endFreq = 1800, duration = 0.22) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration * 0.75);

    gain.gain.setValueAtTime(0.24, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  // --- Analyser & Diagnostics API ---

  getByteTimeDomainData(array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    } else {
      array.fill(128);
    }
  }

  getByteFrequencyData(array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    } else {
      array.fill(0);
    }
  }

  getSignalMetrics() {
    if (!this.analyser) return { rms: 0, peakV: 0, peakFreq: 0 };
    const buffer = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(buffer);

    let sumSquares = 0;
    let peakDev = 0;
    for (let i = 0; i < buffer.length; i++) {
      const val = (buffer[i] - 128) / 128;
      sumSquares += val * val;
      const abs = Math.abs(val);
      if (abs > peakDev) peakDev = abs;
    }
    const rms = Math.sqrt(sumSquares / buffer.length);

    // Dominant peak frequency calculation
    const freqData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freqData);
    let maxVal = 0;
    let maxIndex = 0;
    for (let i = 1; i < freqData.length; i++) {
      if (freqData[i] > maxVal) {
        maxVal = freqData[i];
        maxIndex = i;
      }
    }
    const nyquist = (this.ctx?.sampleRate || 44100) / 2;
    const peakFreq = maxVal > 15 ? Math.round(maxIndex * (nyquist / freqData.length)) : 0;

    return {
      rms: Math.round(rms * 1000) / 1000,
      peakV: Math.round(peakDev * 100) / 100,
      peakFreq
    };
  }

  // --- Signal Generator Test Bench ---

  startCarrier(freq = 440, type = 'sine') {
    this.ensureContext();
    if (!this.ctx) return;
    if (this.carrierPlaying) {
      this.stopCarrier();
    }
    this.carrierFreq = freq;
    this.carrierType = type;

    const t = this.ctx.currentTime;
    this.carrierOsc = this.ctx.createOscillator();
    this.carrierGain = this.ctx.createGain();

    this.carrierOsc.type = type;
    this.carrierOsc.frequency.setValueAtTime(freq, t);

    // Soft anti-click envelope ramp (25ms)
    this.carrierGain.gain.setValueAtTime(0.001, t);
    this.carrierGain.gain.linearRampToValueAtTime(0.18, t + 0.025);

    this.carrierOsc.connect(this.carrierGain);
    this.carrierGain.connect(this.masterGain);

    this.carrierOsc.start(t);
    this.carrierPlaying = true;
  }

  setCarrierFrequency(freq) {
    this.carrierFreq = freq;
    if (this.carrierOsc && this.ctx && this.carrierPlaying) {
      this.carrierOsc.frequency.cancelScheduledValues(this.ctx.currentTime);
      this.carrierOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.015);
    }
  }

  setCarrierType(type) {
    this.carrierType = type;
    if (this.carrierOsc && this.carrierPlaying) {
      this.carrierOsc.type = type;
    }
  }

  stopCarrier() {
    if (!this.carrierPlaying || !this.carrierOsc || !this.carrierGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.carrierGain.gain.cancelScheduledValues(t);
    this.carrierGain.gain.linearRampToValueAtTime(0.001, t + 0.035);
    const osc = this.carrierOsc;
    setTimeout(() => {
      try { osc.stop(); osc.disconnect(); } catch (_) {}
    }, 45);
    this.carrierPlaying = false;
    this.carrierOsc = null;
    this.carrierGain = null;
  }

  playChirp(startFreq = 120, endFreq = 2400, duration = 0.35) {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  playTone(freq = 440, type = 'sine', duration = 0.25) {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  // Attach generic UI listeners to document
  attachListeners() {
    // SFX toggle buttons
    document.querySelectorAll('.sfx-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    });

    // Hover triggers for interactive elements
    const hoverTargets = 'a, button, [data-card], .btn-primary, .btn-secondary, .btn-danger, .tab-btn, .sound-test-card, .dossier-tab';
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest(hoverTargets)) {
        this.tick();
      }
    }, { passive: true });

    // Click triggers for buttons
    const clickTargets = 'button:not(.sfx-toggle), .btn-primary, .btn-secondary, .btn-danger, .tab-btn, .dossier-tab';
    document.addEventListener('click', (e) => {
      if (e.target.closest(clickTargets)) {
        this.click();
      }
    }, { passive: true });

    this.updateUI();
  }
}

export const sfx = new MicroHapticsEngine();
if (typeof window !== 'undefined') {
  window.sfx = sfx;
}
