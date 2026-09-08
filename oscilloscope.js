/**
 * Interactive Audio Oscilloscope & Spectrogram Engine
 * Real-time laboratory signal analysis, FFT frequency spectrum, and waterfall sonograms.
 * Zero external dependencies. HiDPI Canvas 2D rendering.
 */

export class AudioOscilloscope {
  constructor(canvas, sfxEngine, options = {}) {
    this.canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.sfx = sfxEngine;

    // Configuration & Display Options
    this.mode = options.mode || 'OSC'; // 'OSC', 'FFT', 'WATERFALL'
    this.tint = options.tint || 'theme'; // 'theme', 'green', 'white' (aliases: 'amber', 'cream')
    this.voltsDiv = options.voltsDiv || 1.0;
    this.timeDiv = options.timeDiv || 1.0;
    this.themeRgb = [244, 85, 29];

    // Palette Configurations
    const defaultThemePalette = {
      primary: 'rgb(244, 85, 29)',
      primaryGlow: 'rgba(244, 85, 29, 0.4)',
      trace: 'rgba(244, 85, 29, 0.95)',
      grid: 'rgba(255, 255, 255, 0.07)',
      gridCenter: 'rgba(244, 85, 29, 0.25)',
      peak: 'rgb(255, 175, 120)',
      fill: 'rgba(244, 85, 29, 0.12)',
      bgFade: 'rgba(25, 24, 21, 0.26)'
    };

    const whitePalette = {
      primary: 'rgb(233, 226, 211)',
      primaryGlow: 'rgba(233, 226, 211, 0.3)',
      trace: 'rgba(233, 226, 211, 0.95)',
      grid: 'rgba(255, 255, 255, 0.07)',
      gridCenter: 'rgba(233, 226, 211, 0.22)',
      peak: 'rgb(255, 255, 255)',
      fill: 'rgba(233, 226, 211, 0.1)',
      bgFade: 'rgba(27, 27, 25, 0.26)'
    };

    this.palettes = {
      theme: defaultThemePalette,
      amber: defaultThemePalette, // backwards compatibility alias
      green: {
        primary: 'rgb(57, 255, 20)',
        primaryGlow: 'rgba(57, 255, 20, 0.35)',
        trace: 'rgba(57, 255, 20, 0.95)',
        grid: 'rgba(255, 255, 255, 0.07)',
        gridCenter: 'rgba(57, 255, 20, 0.25)',
        peak: 'rgb(180, 255, 160)',
        fill: 'rgba(57, 255, 20, 0.12)',
        bgFade: 'rgba(18, 26, 18, 0.26)'
      },
      white: whitePalette,
      cream: whitePalette // backwards compatibility alias
    };

    // Buffer allocations
    this.bufferLength = 1024;
    this.timeData = new Uint8Array(this.bufferLength);
    this.freqData = new Uint8Array(512);

    // Spectrum peak-hold state
    this.numBars = 52;
    this.peakHold = new Float32Array(this.numBars);
    this.peakDecay = new Float32Array(this.numBars);

    // Waterfall memory buffer
    this.waterfallCanvas = document.createElement('canvas');
    this.waterfallCtx = this.waterfallCanvas.getContext('2d');

    // Telemetry readouts hooks
    this.onMetrics = options.onMetrics || null;

    // Internal loop state
    this.isRunning = true;
    this.animId = null;
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Setup canvas resolution & listeners
    this.updateThemeColor();
    if (typeof window !== 'undefined') {
      window.addEventListener('kinetic:themechange', () => this.updateThemeColor());
      window.addEventListener('aesthetic:themechange', () => this.updateThemeColor());
    }
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);

    this.render = this.render.bind(this);
    this.render();
  }

  updateThemeColor() {
    if (typeof window === 'undefined') return;
    const style = getComputedStyle(document.documentElement);
    const rgb = style.getPropertyValue('--orange-rgb').trim() || '244 85 29';
    const parts = rgb.split(' ').map(n => parseInt(n, 10) || 0);
    const [r, g, b] = [parts[0] ?? 244, parts[1] ?? 85, parts[2] ?? 29];
    this.themeRgb = [r, g, b];
    const themePal = {
      primary: `rgb(${r}, ${g}, ${b})`,
      primaryGlow: `rgba(${r}, ${g}, ${b}, 0.4)`,
      trace: `rgba(${r}, ${g}, ${b}, 0.95)`,
      grid: 'rgba(255, 255, 255, 0.07)',
      gridCenter: `rgba(${r}, ${g}, ${b}, 0.25)`,
      peak: `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`,
      fill: `rgba(${r}, ${g}, ${b}, 0.12)`,
      bgFade: `rgba(${Math.max(10, Math.floor(r * 0.1))}, ${Math.max(10, Math.floor(g * 0.1))}, ${Math.max(10, Math.floor(b * 0.1))}, 0.26)`
    };
    this.palettes.theme = themePal;
    this.palettes.amber = themePal;
  }

  setMode(mode) {
    if (['OSC', 'FFT', 'WATERFALL'].includes(mode)) {
      this.mode = mode;
      if (this.ctx) {
        this.ctx.fillStyle = '#16150f';
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
    }
  }

  setTint(tint) {
    const normalized = tint === 'amber' ? 'theme' : tint === 'cream' ? 'white' : tint;
    if (this.palettes[normalized]) {
      this.tint = normalized;
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);

    // Resize offscreen waterfall buffer
    this.waterfallCanvas.width = Math.round(rect.width * this.dpr);
    this.waterfallCanvas.height = Math.round(rect.height * this.dpr);

    // Initial background wipe
    this.ctx.fillStyle = '#16150f';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawGraticule(p) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 10 columns x 8 rows
    const cols = 10;
    const rows = 8;
    const colStep = w / cols;
    const rowStep = h / rows;
    const midX = w / 2;
    const midY = h / 2;

    ctx.save();
    ctx.lineWidth = 1;

    // Dotted subdivision grid lines
    ctx.strokeStyle = p.grid;
    ctx.setLineDash([1, 4]);

    ctx.beginPath();
    for (let c = 1; c < cols; c++) {
      const x = Math.round(c * colStep);
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (let r = 1; r < rows; r++) {
      const y = Math.round(r * rowStep);
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();

    // Center axes (Solid with sub-division tick marks)
    ctx.setLineDash([]);
    ctx.strokeStyle = p.gridCenter;
    ctx.lineWidth = 1;

    ctx.beginPath();
    // Horizontal center line
    ctx.moveTo(0, Math.round(midY) + 0.5);
    ctx.lineTo(w, Math.round(midY) + 0.5);
    // Vertical center line
    ctx.moveTo(Math.round(midX) + 0.5, 0);
    ctx.lineTo(Math.round(midX) + 0.5, h);
    ctx.stroke();

    // Sub-division tick marks along center axes (5 per major div)
    ctx.beginPath();
    const tickLen = 3.5;
    for (let c = 0; c <= cols; c++) {
      for (let s = 1; s < 5; s++) {
        const tx = Math.round(c * colStep + s * (colStep / 5));
        if (tx < w) {
          ctx.moveTo(tx + 0.5, midY - tickLen);
          ctx.lineTo(tx + 0.5, midY + tickLen);
        }
      }
    }
    for (let r = 0; r <= rows; r++) {
      for (let s = 1; s < 5; s++) {
        const ty = Math.round(r * rowStep + s * (rowStep / 5));
        if (ty < h) {
          ctx.moveTo(midX - tickLen, ty + 0.5);
          ctx.lineTo(midX + tickLen, ty + 0.5);
        }
      }
    }
    ctx.stroke();

    ctx.restore();
  }

  drawOscilloscope(p) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Zero-Crossing Trigger Detection
    let startIndex = 0;
    const searchLimit = Math.min(512, this.timeData.length - 256);
    for (let i = 0; i < searchLimit; i++) {
      if (this.timeData[i] < 128 && this.timeData[i + 1] >= 128) {
        startIndex = i;
        break;
      }
    }

    const availableSamples = this.timeData.length - startIndex;
    const sliceLen = Math.floor(availableSamples / (1 / this.timeDiv));
    const step = w / (sliceLen - 1);

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = p.trace;
    ctx.shadowColor = p.primaryGlow;
    ctx.shadowBlur = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let maxV = 0;

    for (let i = 0; i < sliceLen; i++) {
      const sample = this.timeData[startIndex + i];
      const normalized = (sample - 128) / 128;
      const v = Math.abs(normalized);
      if (v > maxV) maxV = v;

      const y = (h / 2) - (normalized * (h * 0.42) * this.voltsDiv);
      const x = i * step;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Trigger beacon dot on left graticule
    const triggered = maxV > 0.05;
    ctx.fillStyle = triggered ? p.primary : 'rgba(255,255,255,0.2)';
    ctx.fillRect(4, Math.round(h / 2) - 2, 4, 4);

    ctx.restore();

    return { peakV: maxV, triggered };
  }

  drawSpectrum(p) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const bars = this.numBars;
    const barWidth = (w - (bars - 1) * 2) / bars;
    const maxFreqIndex = this.freqData.length;

    ctx.save();

    let maxVal = 0;
    let maxBin = 0;

    for (let i = 0; i < bars; i++) {
      const t = i / (bars - 1);
      const bin = Math.min(
        maxFreqIndex - 1,
        Math.floor(Math.pow(t, 2.2) * (maxFreqIndex - 1))
      );

      const val = this.freqData[bin] / 255;
      if (val > maxVal) {
        maxVal = val;
        maxBin = bin;
      }

      const barHeight = val * (h * 0.82);
      const x = i * (barWidth + 2);
      const y = h - barHeight - 2;

      // Peak hold calculation with gravity decay
      if (val >= this.peakHold[i]) {
        this.peakHold[i] = val;
        this.peakDecay[i] = 0;
      } else {
        this.peakDecay[i] += 0.0035;
        this.peakHold[i] = Math.max(0, this.peakHold[i] - this.peakDecay[i]);
      }

      const peakY = h - (this.peakHold[i] * (h * 0.82)) - 2;

      const grad = ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, p.trace);
      grad.addColorStop(1, p.fill);

      ctx.fillStyle = grad;
      ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(barWidth)), Math.round(barHeight));

      if (this.peakHold[i] > 0.02) {
        ctx.fillStyle = p.peak;
        ctx.fillRect(Math.round(x), Math.round(peakY) - 1, Math.max(1, Math.round(barWidth)), 1.5);
      }
    }

    ctx.restore();

    return { peakV: maxVal, maxBin };
  }

  drawWaterfall(p) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const wfCtx = this.waterfallCtx;

    wfCtx.drawImage(this.waterfallCanvas, 0, 0, w, h - 2, 0, 2, w, h - 2);

    const imgData = wfCtx.createImageData(w, 2);
    const data = imgData.data;
    const bins = this.freqData.length;

    const isTheme = this.tint === 'theme' || this.tint === 'amber';
    const isGreen = this.tint === 'green';
    const [tr, tg, tb] = this.themeRgb || [244, 85, 29];

    for (let x = 0; x < w; x++) {
      const t = x / w;
      const bin = Math.min(bins - 1, Math.floor(Math.pow(t, 2) * bins));
      const val = this.freqData[bin] / 255;

      const idx1 = x * 4;
      const idx2 = (w + x) * 4;

      let r = 0, g = 0, b = 0;
      if (isTheme) {
        r = Math.min(255, Math.floor(val * tr + val * val * 35));
        g = Math.min(255, Math.floor(val * tg + val * val * 35));
        b = Math.min(255, Math.floor(val * tb + val * val * 35));
      } else if (isGreen) {
        r = Math.min(255, Math.floor(val * 57 + val * val * 100));
        g = Math.min(255, Math.floor(val * 255));
        b = Math.min(255, Math.floor(val * 20 + val * val * 80));
      } else {
        // Monochrome White / Cream Phosphor
        r = Math.min(255, Math.floor(val * 240));
        g = Math.min(255, Math.floor(val * 235));
        b = Math.min(255, Math.floor(val * 225));
      }

      data[idx1] = r; data[idx1 + 1] = g; data[idx1 + 2] = b; data[idx1 + 3] = Math.floor(val * 240);
      data[idx2] = r; data[idx2 + 1] = g; data[idx2 + 2] = b; data[idx2 + 3] = Math.floor(val * 240);
    }

    wfCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(this.waterfallCanvas, 0, 0, w, h);
  }

  render() {
    if (!this.isRunning) return;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    if (w === 0 || h === 0) {
      this.animId = requestAnimationFrame(this.render);
      return;
    }

    const p = this.palettes[this.tint] || this.palettes.theme || this.palettes.amber;

    if (this.sfx) {
      this.sfx.getByteTimeDomainData(this.timeData);
      this.sfx.getByteFrequencyData(this.freqData);
    }

    if (this.mode !== 'WATERFALL') {
      ctx.fillStyle = p.bgFade;
      ctx.fillRect(0, 0, w, h);
    }

    this.drawGraticule(p);

    let metrics = { peakV: 0, triggered: false, peakFreq: 0 };

    if (this.mode === 'OSC') {
      const oscRes = this.drawOscilloscope(p);
      metrics.peakV = oscRes.peakV;
      metrics.triggered = oscRes.triggered;
    } else if (this.mode === 'FFT') {
      const fftRes = this.drawSpectrum(p);
      metrics.peakV = fftRes.peakV;
      const nyquist = 22050;
      metrics.peakFreq = Math.round(fftRes.maxBin * (nyquist / this.freqData.length));
    } else if (this.mode === 'WATERFALL') {
      this.drawWaterfall(p);
    }

    if (this.onMetrics && (performance.now() % 4 < 1)) {
      this.onMetrics({
        mode: this.mode,
        tint: this.tint,
        peakV: Math.round(metrics.peakV * 100) / 100,
        peakFreq: metrics.peakFreq,
        triggered: metrics.triggered
      });
    }

    this.animId = requestAnimationFrame(this.render);
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}

export function initOscilloscope(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const sfxEngine = options.sfx || window.sfx;
  return new AudioOscilloscope(canvas, sfxEngine, options);
}
