/**
 * Interactive Cursor-Reactive 3D Wireframe & Polar Radar Engine
 * Zero-dependency Canvas 2D engine with 3D projection, cursor parallax inertia,
 * multiple telemetry modes (Gimbal, Icosahedron, Polar Radar), and live HUD readouts.
 */

export class HeroRadar {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.options = Object.assign({
      azimuthElId: 'radarAzimuth',
      elevationElId: 'radarElevation',
      rangeElId: 'radarRange',
      modeBtnId: 'radarModeBtn',
      pingBtnId: 'radarPingBtn',
      sfx: typeof window !== 'undefined' ? window.sfx : null
    }, options);

    this.modes = ['GIMBAL', 'ICOSA', 'RADAR'];
    this.currentModeIdx = 0;

    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Angles and smoothing
    this.autoYaw = 0;
    this.autoPitch = 0;
    this.targetYawOffset = 0;
    this.targetPitchOffset = 0;
    this.smoothYaw = 0;
    this.smoothPitch = 0;

    // Sweep & Telemetry
    this.sweepAngle = 0;
    this.ripples = [];

    // Target blips for Radar mode
    this.blips = [
      { r: 0.42, theta: 1.15, alpha: 0, label: 'NODE-01' },
      { r: 0.68, theta: 3.65, alpha: 0, label: 'WORKER-09' },
      { r: 0.88, theta: 5.20, alpha: 0, label: 'SIG-GATEWAY' }
    ];

    // Build geometry caches
    this.buildGeometries();

    this.init();
  }

  buildGeometries() {
    // 1. Gimbal Rings (3 orthogonal rings)
    const RING_SEGS = 36;
    this.gimbalXY = [];
    this.gimbalYZ = [];
    this.gimbalXZ = [];
    for (let i = 0; i < RING_SEGS; i++) {
      const a = (i / RING_SEGS) * Math.PI * 2;
      this.gimbalXY.push({ x: Math.cos(a), y: Math.sin(a), z: 0 });
      this.gimbalYZ.push({ x: 0, y: Math.cos(a), z: Math.sin(a) });
      this.gimbalXZ.push({ x: Math.cos(a), y: 0, z: Math.sin(a) });
    }

    // 2. Icosahedron Vertices & Edges
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];
    // Normalize to unit sphere
    this.icosaVerts = rawVerts.map(v => {
      const len = Math.hypot(...v);
      return { x: v[0] / len, y: v[1] / len, z: v[2] / len };
    });
    this.icosaEdges = [];
    for (let i = 0; i < this.icosaVerts.length; i++) {
      for (let j = i + 1; j < this.icosaVerts.length; j++) {
        const d = Math.hypot(
          this.icosaVerts[i].x - this.icosaVerts[j].x,
          this.icosaVerts[i].y - this.icosaVerts[j].y,
          this.icosaVerts[i].z - this.icosaVerts[j].z
        );
        // In unit icosahedron, edge distance is ~1.051
        if (d > 0.95 && d < 1.15) {
          this.icosaEdges.push([i, j]);
        }
      }
    }
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Cursor tracking across hero parent
    const trackArea = this.canvas.closest('section') || window;
    trackArea.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);

      this.targetYawOffset = dx * 0.95;
      this.targetPitchOffset = -dy * 0.75;
    }, { passive: true });

    trackArea.addEventListener('pointerleave', () => {
      this.targetYawOffset = 0;
      this.targetPitchOffset = 0;
    }, { passive: true });

    // Canvas click toggles mode and triggers ping
    this.canvas.addEventListener('click', () => {
      this.cycleMode();
    });

    // UI Buttons
    const modeBtn = document.getElementById(this.options.modeBtnId);
    modeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cycleMode();
    });

    const pingBtn = document.getElementById(this.options.pingBtnId);
    pingBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerPing();
    });

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 340;
    this.height = rect.height || 320;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  cycleMode() {
    this.currentModeIdx = (this.currentModeIdx + 1) % this.modes.length;
    const mode = this.modes[this.currentModeIdx];
    this.triggerPing();

    const modeBtn = document.getElementById(this.options.modeBtnId);
    if (modeBtn) {
      modeBtn.textContent = `MODE: ${mode}`;
    }

    if (this.options.sfx) {
      this.options.sfx.click();
    }
  }

  triggerPing() {
    this.ripples.push({ r: 5, maxR: Math.min(this.width, this.height) * 0.46, alpha: 1.0 });
    if (this.options.sfx) {
      this.options.sfx.telemetry();
    }
  }

  project(x, y, z, cx, cy, scale) {
    // 3D rotation
    const cosY = Math.cos(this.smoothYaw);
    const sinY = Math.sin(this.smoothYaw);
    const cosP = Math.cos(this.smoothPitch);
    const sinP = Math.sin(this.smoothPitch);

    // Yaw
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    // Pitch
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    const fov = 320;
    const p = fov / (fov + z2 * scale);
    return {
      x: cx + x1 * scale * p,
      y: cy + y2 * scale * p,
      z: z2,
      p: p
    };
  }

  updateTelemetry() {
    // Calculate azimuth and elevation in degrees
    const az = (((this.smoothYaw * 180 / Math.PI) % 360) + 360) % 360;
    const el = (this.smoothPitch * 180 / Math.PI);

    const azEl = document.getElementById(this.options.azimuthElId);
    if (azEl) azEl.textContent = `AZ: ${az.toFixed(1)}°`;

    const elEl = document.getElementById(this.options.elevationElId);
    if (elEl) elEl.textContent = `EL: ${el.toFixed(1)}°`;
  }

  loop(timestamp) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * 0.38;

    // Clear background
    ctx.clearRect(0, 0, w, h);

    // Damping & rotation
    this.autoYaw += 0.007;
    this.autoPitch = Math.sin(this.autoYaw * 0.5) * 0.2;

    const targetYaw = this.autoYaw + this.targetYawOffset;
    const targetPitch = this.autoPitch + this.targetPitchOffset;

    this.smoothYaw += (targetYaw - this.smoothYaw) * 0.07;
    this.smoothPitch += (targetPitch - this.smoothPitch) * 0.07;

    this.sweepAngle = (this.sweepAngle + 0.038) % (Math.PI * 2);

    this.updateTelemetry();

    // 1. Draw Background Polar Grid & Crop Marks
    this.drawBackgroundHUD(ctx, cx, cy, baseRadius);

    // 2. Mode-Specific 3D Drawing
    const mode = this.modes[this.currentModeIdx];
    if (mode === 'GIMBAL') {
      this.drawGimbal(ctx, cx, cy, baseRadius);
    } else if (mode === 'ICOSA') {
      this.drawIcosahedron(ctx, cx, cy, baseRadius);
    } else if (mode === 'RADAR') {
      this.drawPolarRadar(ctx, cx, cy, baseRadius);
    }

    // 3. Draw Ripples
    this.drawRipples(ctx, cx, cy);

    // 4. Center Crosshair Reticle
    this.drawCenterReticle(ctx, cx, cy);

    requestAnimationFrame(this.loop);
  }

  drawBackgroundHUD(ctx, cx, cy, radius) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    // Polar reference circles
    [0.33, 0.66, 1.0].forEach(factor => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * factor, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Cross axes
    ctx.beginPath();
    ctx.setLineDash([2, 3]);
    ctx.moveTo(cx - radius * 1.08, cy);
    ctx.lineTo(cx + radius * 1.08, cy);
    ctx.moveTo(cx, cy - radius * 1.08);
    ctx.lineTo(cx, cy + radius * 1.08);
    ctx.stroke();
    ctx.setLineDash([]);

    // Degree tick marks on outer rim
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const r1 = radius * (isMajor ? 0.94 : 0.97);
      const r2 = radius * 1.02;
      ctx.strokeStyle = isMajor ? 'rgba(244, 85, 29, 0.6)' : 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawGimbal(ctx, cx, cy, radius) {
    ctx.save();
    ctx.lineWidth = 1.35;

    // Draw XY ring
    ctx.strokeStyle = 'rgba(244, 85, 29, 0.85)';
    this.drawRing(ctx, this.gimbalXY, cx, cy, radius);

    // Draw YZ ring
    ctx.strokeStyle = 'rgba(233, 226, 211, 0.7)';
    this.drawRing(ctx, this.gimbalYZ, cx, cy, radius * 0.88);

    // Draw XZ ring
    ctx.strokeStyle = 'rgba(233, 226, 211, 0.45)';
    this.drawRing(ctx, this.gimbalXZ, cx, cy, radius * 0.76);

    // Core central diamond
    const coreScale = radius * 0.22;
    const corePts = [
      { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
    ].map(p => this.project(p.x, p.y, p.z, cx, cy, coreScale));

    ctx.strokeStyle = 'rgba(244, 85, 29, 0.9)';
    const coreEdges = [
      [0, 2], [2, 1], [1, 3], [3, 0],
      [0, 4], [2, 4], [1, 4], [3, 4],
      [0, 5], [2, 5], [1, 5], [3, 5]
    ];
    coreEdges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(corePts[i].x, corePts[i].y);
      ctx.lineTo(corePts[j].x, corePts[j].y);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawRing(ctx, points, cx, cy, radius) {
    const proj = points.map(p => this.project(p.x, p.y, p.z, cx, cy, radius));
    ctx.beginPath();
    ctx.moveTo(proj[0].x, proj[0].y);
    for (let i = 1; i < proj.length; i++) {
      ctx.lineTo(proj[i].x, proj[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  drawIcosahedron(ctx, cx, cy, radius) {
    ctx.save();
    const proj = this.icosaVerts.map(v => this.project(v.x, v.y, v.z, cx, cy, radius * 0.88));

    // Edges
    this.icosaEdges.forEach(([i, j]) => {
      const zAvg = (proj[i].z + proj[j].z) / 2;
      const alpha = Math.max(0.15, Math.min(0.85, (zAvg + 1.2) * 0.45));
      ctx.strokeStyle = `rgba(233, 226, 211, ${alpha})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(proj[i].x, proj[i].y);
      ctx.lineTo(proj[j].x, proj[j].y);
      ctx.stroke();
    });

    // Vertex Nodes
    proj.forEach(p => {
      const size = (p.z + 1.5) * 1.5;
      ctx.fillStyle = 'rgba(244, 85, 29, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawPolarRadar(ctx, cx, cy, radius) {
    ctx.save();

    // 1. Radar Sweep Conical Phosphor Trail
    const sweepSegments = 24;
    for (let i = 0; i < sweepSegments; i++) {
      const a1 = this.sweepAngle - (i / sweepSegments) * (Math.PI * 0.35);
      const a2 = this.sweepAngle - ((i + 1) / sweepSegments) * (Math.PI * 0.35);
      const alpha = (1 - i / sweepSegments) * 0.18;

      ctx.fillStyle = `rgba(244, 85, 29, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, a2, a1);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Leading Scan Ray
    ctx.strokeStyle = 'rgba(244, 85, 29, 0.95)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(this.sweepAngle) * radius, cy + Math.sin(this.sweepAngle) * radius);
    ctx.stroke();

    // 3. Target Blips
    this.blips.forEach(blip => {
      // Check if sweep ray just crossed this blip's angle
      let angleDiff = this.sweepAngle - blip.theta;
      while (angleDiff < 0) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;

      if (angleDiff < 0.12) {
        blip.alpha = 1.0;
      } else {
        blip.alpha = Math.max(0.08, blip.alpha * 0.975);
      }

      const bx = cx + Math.cos(blip.theta) * (radius * blip.r);
      const by = cy + Math.sin(blip.theta) * (radius * blip.r);

      // Blip diamond
      ctx.fillStyle = `rgba(244, 85, 29, ${blip.alpha})`;
      ctx.strokeStyle = `rgba(233, 226, 211, ${blip.alpha})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(bx, by - 3);
      ctx.lineTo(bx + 3, by);
      ctx.lineTo(bx, by + 3);
      ctx.lineTo(bx - 3, by);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Blip coordinate tag if active
      if (blip.alpha > 0.4) {
        ctx.font = '9px monospace';
        ctx.fillStyle = `rgba(233, 226, 211, ${blip.alpha * 0.85})`;
        ctx.fillText(`[${blip.label}]`, bx + 6, by - 4);
      }
    });

    ctx.restore();
  }

  drawRipples(ctx, cx, cy) {
    if (!this.ripples.length) return;
    ctx.save();
    ctx.lineWidth = 1.25;

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.r += 3.5;
      rip.alpha *= 0.94;

      ctx.strokeStyle = `rgba(244, 85, 29, ${rip.alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(cx, cy, rip.r, 0, Math.PI * 2);
      ctx.stroke();

      if (rip.alpha < 0.02 || rip.r > rip.maxR) {
        this.ripples.splice(i, 1);
      }
    }
    ctx.restore();
  }

  drawCenterReticle(ctx, cx, cy) {
    ctx.save();
    ctx.strokeStyle = 'rgba(244, 85, 29, 0.95)';
    ctx.lineWidth = 1.2;

    // Small center cross
    const sz = 4;
    ctx.beginPath();
    ctx.moveTo(cx - sz, cy);
    ctx.lineTo(cx + sz, cy);
    ctx.moveTo(cx, cy - sz);
    ctx.lineTo(cx, cy + sz);
    ctx.stroke();

    ctx.restore();
  }
}

export function initHeroRadar(canvasId = 'heroRadarCanvas', options = {}) {
  return new HeroRadar(canvasId, options);
}
