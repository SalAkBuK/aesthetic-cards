/**
 * Kinetic Data Visualizations & Telemetry Charts Engine (Section 11)
 * Features 60FPS TimeSeries Canvas Chart, 270° Radial Tachometer Dial,
 * Multi-Core Thread Resource Monitor, and Interactive HUD Reticle Viewport.
 */

// Helper to retrieve live accent color from CSS variables
function getAccentColor(fallback = '#f4551d') {
  if (typeof window === 'undefined') return fallback;
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue('--orange').trim() || fallback;
}

/**
 * 1. Rolling Time-Series Canvas Telemetry Chart
 */
export class TimeSeriesChart {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.sfx = options.sfx || null;

    this.isRunning = true;
    this.windowSeconds = 30; // 10, 30, or 60
    this.profile = 'gaussian'; // 'gaussian', 'spike', 'stable'
    this.history = [];
    this.maxPoints = 120;
    this.hoverPos = null; // { x, y }

    // Readout elements
    this.throughputEl = document.getElementById('chartLiveThroughput');
    this.latencyEl = document.getElementById('chartLiveLatency');
    this.timeWindowButtons = document.querySelectorAll('.chart-window-btn');
    this.profileButtons = document.querySelectorAll('.chart-profile-btn');
    this.pauseBtn = document.getElementById('chartPauseBtn');

    this.initData();
    this.bindEvents();
    this.startLoop();
  }

  initData() {
    const now = Date.now();
    let currentVal = 85;
    for (let i = this.maxPoints; i >= 0; i--) {
      currentVal = Math.max(30, Math.min(160, currentVal + (Math.random() - 0.48) * 8));
      this.history.push({
        time: now - i * 250,
        value: currentVal,
        latency: 0.28 + (currentVal / 160) * 0.18 + (Math.random() * 0.04)
      });
    }
  }

  bindEvents() {
    // Window resize handler
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();

    // Mouse tracking for crosshairs
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.hoverPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPos = null;
    });

    // Time window buttons
    this.timeWindowButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.sfx) this.sfx.tick();
        this.timeWindowButtons.forEach(b => {
          b.classList.remove('bg-orange', 'text-near', 'font-bold');
          b.classList.add('hover:bg-white/10', 'text-cream/70');
        });
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/70');
        this.windowSeconds = parseInt(btn.dataset.window, 10);
      });
    });

    // Waveform profile buttons
    this.profileButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.sfx) this.sfx.click();
        this.profileButtons.forEach(b => {
          b.classList.remove('bg-white/20', 'text-white', 'font-bold');
          b.classList.add('hover:bg-white/10', 'text-cream/60');
        });
        btn.classList.add('bg-white/20', 'text-white', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/60');
        this.profile = btn.dataset.profile;
      });
    });

    // Pause / Resume toggle
    this.pauseBtn?.addEventListener('click', () => {
      if (this.sfx) this.sfx.click();
      this.isRunning = !this.isRunning;
      const dot = document.getElementById('chartPauseDot');
      const label = document.getElementById('chartPauseLabel');
      if (this.isRunning) {
        if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse';
        if (label) label.textContent = 'RUNNING';
      } else {
        if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-amber';
        if (label) label.textContent = 'PAUSED';
      }
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  startLoop() {
    let lastTick = Date.now();
    const step = () => {
      const now = Date.now();
      if (this.isRunning && now - lastTick > 250) {
        this.generateNextPoint();
        lastTick = now;
      }
      this.render();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  generateNextPoint() {
    const last = this.history[this.history.length - 1];
    let nextVal = last ? last.value : 90;

    if (this.profile === 'spike') {
      if (Math.random() < 0.15) {
        nextVal = 145 + Math.random() * 25;
      } else {
        nextVal = Math.max(45, Math.min(110, nextVal + (Math.random() - 0.5) * 14));
      }
    } else if (this.profile === 'stable') {
      nextVal = Math.max(75, Math.min(95, nextVal + (Math.random() - 0.5) * 3));
    } else {
      // Gaussian walk
      nextVal = Math.max(35, Math.min(165, nextVal + (Math.random() - 0.48) * 9));
    }

    const nextLatency = 0.28 + (nextVal / 170) * 0.18 + (Math.random() * 0.03);

    this.history.push({
      time: Date.now(),
      value: nextVal,
      latency: nextLatency
    });

    if (this.history.length > this.maxPoints) {
      this.history.shift();
    }

    if (this.throughputEl) {
      this.throughputEl.textContent = `${nextVal.toFixed(1)} kops/s`;
    }
    if (this.latencyEl) {
      this.latencyEl.textContent = `${nextLatency.toFixed(2)} ms`;
    }
  }

  render() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const accent = getAccentColor();

    ctx.clearRect(0, 0, w, h);

    // 1. Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const hSteps = 4;
    for (let i = 1; i < hSteps; i++) {
      const y = (h / hSteps) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      // Horizontal grid label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '9px monospace';
      const labelVal = Math.round(180 - (180 / hSteps) * i);
      ctx.fillText(`${labelVal}k`, 6, y - 3);
    }

    // Vertical grid lines
    const vSteps = 6;
    for (let i = 1; i < vSteps; i++) {
      const x = (w / vSteps) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    if (this.history.length < 2) return;

    // 2. Data Curve Calculation
    const count = Math.min(this.history.length, Math.floor((this.windowSeconds / 60) * this.maxPoints));
    const dataSubset = this.history.slice(-count);
    const stepX = w / (count - 1);
    const maxY = 180;

    const points = dataSubset.map((pt, idx) => ({
      x: idx * stepX,
      y: h - (pt.value / maxY) * (h - 20) - 10,
      data: pt
    }));

    // Area Fill Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, accent + '45'); // ~27% opacity
    gradient.addColorStop(1, accent + '00'); // transparent

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + curr.y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + curr.y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.75;
    ctx.stroke();

    // Trailing Point Pulsing Dot
    const lastPt = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPt.x, lastPt.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Hover Crosshairs & Readout Tooltip
    if (this.hoverPos && this.hoverPos.x >= 0 && this.hoverPos.x <= w) {
      // Find closest data point
      const closestIdx = Math.max(0, Math.min(points.length - 1, Math.round(this.hoverPos.x / stepX)));
      const targetPt = points[closestIdx];

      if (targetPt) {
        // Vertical hair line
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(targetPt.x, 0);
        ctx.lineTo(targetPt.x, h);
        ctx.stroke();

        // Horizontal hair line
        ctx.beginPath();
        ctx.moveTo(0, targetPt.y);
        ctx.lineTo(w, targetPt.y);
        ctx.stroke();
        ctx.restore();

        // Intersection Target Dot
        ctx.beginPath();
        ctx.arc(targetPt.x, targetPt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // HUD Tooltip Badge
        const tooltipText = `${targetPt.data.value.toFixed(1)}k ops/s // ${targetPt.data.latency.toFixed(2)}ms`;
        ctx.font = '10px monospace';
        const textWidth = ctx.measureText(tooltipText).width;
        let badgeX = targetPt.x + 8;
        if (badgeX + textWidth + 16 > w) badgeX = targetPt.x - textWidth - 20;
        const badgeY = Math.max(20, Math.min(h - 26, targetPt.y - 12));

        // Tooltip Background
        ctx.fillStyle = 'rgba(18, 17, 14, 0.92)';
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1;
        ctx.fillRect(badgeX, badgeY, textWidth + 14, 20);
        ctx.strokeRect(badgeX, badgeY, textWidth + 14, 20);

        // Tooltip Text
        ctx.fillStyle = '#f5f2e9';
        ctx.fillText(tooltipText, badgeX + 7, badgeY + 14);
      }
    }
  }
}

/**
 * 2. Radial Dial & Tachometer Saturation Gauge
 */
export class RadialTachometerGauge {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.sfx = options.sfx || null;

    this.currentValue = 76.4;
    this.targetValue = 76.4;
    this.peakValue = 89.2;
    this.totalTicks = 36;
    this.startAngle = -135; // degrees
    this.sweepAngle = 270; // degrees

    this.valDisplay = document.getElementById('tachValDisplay');
    this.peakDisplay = document.getElementById('tachPeakDisplay');
    this.statusBadge = document.getElementById('tachStatusBadge');
    this.slider = document.getElementById('tachManualSlider');

    this.renderDialSvg();
    this.bindEvents();
    this.startAutoFluctuation();
  }

  renderDialSvg() {
    const svg = document.getElementById('tachSvgDial');
    if (!svg) return;
    svg.innerHTML = '';

    const cx = 100;
    const cy = 100;
    const rOuter = 82;
    const rInner = 68;

    for (let i = 0; i <= this.totalTicks; i++) {
      const frac = i / this.totalTicks;
      const deg = this.startAngle + frac * this.sweepAngle;
      const rad = (deg * Math.PI) / 180;

      const x1 = cx + rInner * Math.cos(rad);
      const y1 = cy + rInner * Math.sin(rad);
      const x2 = cx + rOuter * Math.cos(rad);
      const y2 = cy + rOuter * Math.sin(rad);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke-width', i % 4 === 0 ? '2.5' : '1.5');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('class', 'tach-tick transition-colors duration-150');
      line.setAttribute('data-index', i);
      line.setAttribute('data-frac', frac);
      svg.appendChild(line);
    }

    this.updateTicks();
  }

  updateTicks() {
    const activeFrac = this.currentValue / 100;
    const ticks = document.querySelectorAll('.tach-tick');
    const accent = getAccentColor();

    ticks.forEach(t => {
      const f = parseFloat(t.dataset.frac);
      if (f <= activeFrac) {
        if (f < 0.65) {
          t.setAttribute('stroke', '#10b981'); // Emerald safe
        } else if (f < 0.85) {
          t.setAttribute('stroke', '#f59e0b'); // Amber mid
        } else {
          t.setAttribute('stroke', accent); // Accent / red high
        }
      } else {
        t.setAttribute('stroke', 'rgba(255, 255, 255, 0.12)'); // Inactive dark
      }
    });

    if (this.valDisplay) {
      this.valDisplay.textContent = `${this.currentValue.toFixed(1)}%`;
    }

    if (this.peakDisplay && this.currentValue > this.peakValue) {
      this.peakValue = this.currentValue;
      this.peakDisplay.textContent = `${this.peakValue.toFixed(1)}%`;
    }

    if (this.statusBadge) {
      if (this.currentValue > 88) {
        this.statusBadge.textContent = 'THERMAL THROTTLE';
        this.statusBadge.className = 'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40';
      } else if (this.currentValue > 70) {
        this.statusBadge.textContent = 'NOMINAL HIGH';
        this.statusBadge.className = 'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber/20 text-amber border border-amber/40';
      } else {
        this.statusBadge.textContent = 'OPTIMAL QUORUM';
        this.statusBadge.className = 'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      }
    }
  }

  bindEvents() {
    this.slider?.addEventListener('input', (e) => {
      this.targetValue = parseFloat(e.target.value);
      this.currentValue = this.targetValue;
      this.updateTicks();
      if (this.sfx && Math.random() < 0.3) this.sfx.tick();
    });
  }

  startAutoFluctuation() {
    setInterval(() => {
      // If user is not dragging the slider, lightly fluctuate around target
      const jitter = (Math.random() - 0.49) * 2.8;
      this.currentValue = Math.max(15, Math.min(99.5, this.currentValue + jitter));
      this.updateTicks();
      if (this.slider && Math.abs(parseFloat(this.slider.value) - this.currentValue) > 4) {
        this.slider.value = this.currentValue;
      }
    }, 450);
  }
}

/**
 * 3. Multi-Core Resource Monitor (8-Core Thread Visualizer)
 */
export class MultiCoreResourceMonitor {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.sfx = options.sfx || null;

    this.cores = [
      { id: 'C-01', base: 84, val: 84 },
      { id: 'C-02', base: 72, val: 72 },
      { id: 'C-03', base: 58, val: 58 },
      { id: 'C-04', base: 45, val: 45 },
      { id: 'C-05', base: 64, val: 64 },
      { id: 'C-06', base: 38, val: 38 },
      { id: 'C-07', base: 52, val: 52 },
      { id: 'C-08', base: 31, val: 31 }
    ];

    this.renderCores();
    this.startLoop();
  }

  renderCores() {
    const grid = document.getElementById('coreBarsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    this.cores.forEach((core, idx) => {
      const col = document.createElement('div');
      col.className = 'flex flex-col items-center gap-1.5 flex-1';

      // Bar with 8 stacked discrete LED segments
      const meter = document.createElement('div');
      meter.className = 'w-full h-24 bg-black/60 rounded border border-white/10 p-1 flex flex-col-reverse gap-1';
      meter.id = `coreMeter_${idx}`;

      for (let s = 0; s < 8; s++) {
        const seg = document.createElement('div');
        seg.className = 'w-full flex-1 rounded-sm meter-segment bg-white/10';
        seg.id = `coreSeg_${idx}_${s}`;
        meter.appendChild(seg);
      }

      const label = document.createElement('span');
      label.className = 'text-[9px] font-mono text-cream/40';
      label.textContent = core.id;

      const pct = document.createElement('span');
      pct.className = 'text-[9.5px] font-mono font-bold text-cream/90';
      pct.id = `corePct_${idx}`;
      pct.textContent = `${Math.round(core.val)}%`;

      col.appendChild(pct);
      col.appendChild(meter);
      col.appendChild(label);
      grid.appendChild(col);
    });

    this.updateMeters();
  }

  updateMeters() {
    const accent = getAccentColor();

    this.cores.forEach((core, idx) => {
      const pctEl = document.getElementById(`corePct_${idx}`);
      if (pctEl) pctEl.textContent = `${Math.round(core.val)}%`;

      const activeSegments = Math.round((core.val / 100) * 8);

      for (let s = 0; s < 8; s++) {
        const seg = document.getElementById(`coreSeg_${idx}_${s}`);
        if (!seg) continue;

        if (s < activeSegments) {
          if (s >= 6) {
            seg.style.backgroundColor = accent;
            seg.style.boxShadow = `0 0 6px ${accent}`;
          } else if (s >= 4) {
            seg.style.backgroundColor = '#f59e0b';
            seg.style.boxShadow = 'none';
          } else {
            seg.style.backgroundColor = '#10b981';
            seg.style.boxShadow = 'none';
          }
        } else {
          seg.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          seg.style.boxShadow = 'none';
        }
      }
    });

    // Update Duplex Transfer micro-rates
    const txEl = document.getElementById('resTxRate');
    const rxEl = document.getElementById('resRxRate');
    if (txEl) txEl.textContent = `${(4.2 + (Math.random() * 0.8)).toFixed(2)} GB/s`;
    if (rxEl) rxEl.textContent = `${(7.8 + (Math.random() * 1.1)).toFixed(2)} GB/s`;
  }

  startLoop() {
    setInterval(() => {
      this.cores.forEach(core => {
        const jitter = (Math.random() - 0.48) * 8;
        core.val = Math.max(12, Math.min(98, core.val + jitter));
      });
      this.updateMeters();
    }, 600);
  }
}

/**
 * 4. Interactive HUD Reticle Viewport
 */
export class HudReticleViewport {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.sfx = options.sfx || null;

    this.crosshair = document.getElementById('hudCrosshair');
    this.coordText = document.getElementById('hudCoordText');
    this.bearingText = document.getElementById('hudBearingText');
    this.lockBadge = document.getElementById('hudLockBadge');

    this.targetX = 140;
    this.targetY = 100;
    this.currentX = 140;
    this.currentY = 100;

    this.bindEvents();
    this.startInterpolation();
  }

  bindEvents() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.targetX = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
      this.targetY = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));
    });

    // Click triggers sonar ripple ping and audio chirp
    this.container.addEventListener('click', (e) => {
      const rect = this.container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      this.triggerSonarPing(clickX, clickY);
      if (this.sfx) {
        if (typeof this.sfx.playChirp === 'function') {
          this.sfx.playChirp(420, 1800, 0.25);
        } else {
          this.sfx.click();
        }
      }
    });
  }

  triggerSonarPing(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'hud-sonar-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    this.container.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 850);
  }

  startInterpolation() {
    const step = () => {
      // Smooth Damping Lerp
      this.currentX += (this.targetX - this.currentX) * 0.22;
      this.currentY += (this.targetY - this.currentY) * 0.22;

      if (this.crosshair) {
        this.crosshair.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
      }

      if (this.coordText) {
        this.coordText.textContent = `[X: ${this.currentX.toFixed(1)}, Y: ${this.currentY.toFixed(1)}]`;
      }

      if (this.bearingText) {
        const bearing = ((this.currentX / 300) * 120 + 30).toFixed(1);
        const elev = (((200 - this.currentY) / 200) * 45).toFixed(1);
        this.bearingText.textContent = `BEARING: ${bearing}° // ELEV: +${elev}°`;
      }

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/**
 * Section 11 Main Initializer
 */
export function initKineticCharts(options = {}) {
  const timeSeries = new TimeSeriesChart('chartTimeSeries', options);
  const tachometer = new RadialTachometerGauge('tachometerContainer', options);
  const resourceMonitor = new MultiCoreResourceMonitor('resourceMonitorContainer', options);
  const hudReticle = new HudReticleViewport('hudReticleContainer', options);

  return {
    timeSeries,
    tachometer,
    resourceMonitor,
    hudReticle
  };
}
