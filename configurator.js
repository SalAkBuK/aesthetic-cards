/**
 * Blueprint Design System Token Configurator Engine 2.0
 * Generates dynamic 8-point chamfer polygon clip-paths, live CSS variable bindings,
 * multi-component specimen workbench, and multi-format design token export (CSS, Tailwind, DTCG JSON, React/JSX).
 */

import { ICONS, ICON_META, renderIcon } from './icons.js';

export const PRESETS = {
  industrial: {
    id: 'industrial',
    name: 'Industrial Blueprint',
    chamfer: 13,
    accent: '#f4551d',
    accentHover: '#ea4f1a',
    surface: '#2b2b29',
    surfaceCard: '#33332f',
    surfaceWell: '#e2dac9',
    textColor: '#e9e2d3',
    gridSize: 84,
    gridOpacity: 0.045,
    strokeWidth: 1.35,
    bracketSize: 13
  },
  teenage: {
    id: 'teenage',
    name: 'Teenage Engineering OP-1',
    chamfer: 10,
    accent: '#39ff14',
    accentHover: '#32e012',
    surface: '#202220',
    surfaceCard: '#2c302c',
    surfaceWell: '#181a18',
    textColor: '#e9e2d3',
    gridSize: 64,
    gridOpacity: 0.055,
    strokeWidth: 1.35,
    bracketSize: 11
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Terminal',
    chamfer: 6,
    accent: '#06b6d4',
    accentHover: '#0891b2',
    surface: '#0d1117',
    surfaceCard: '#161b22',
    surfaceWell: '#090d12',
    textColor: '#e6edf3',
    gridSize: 48,
    gridOpacity: 0.065,
    strokeWidth: 1.0,
    bracketSize: 9
  },
  architectural: {
    id: 'architectural',
    name: 'Architectural Bone (Light)',
    chamfer: 16,
    accent: '#ef4444',
    accentHover: '#dc2626',
    surface: '#f4efe6',
    surfaceCard: '#eae3d5',
    surfaceWell: '#ded5c4',
    textColor: '#1c1c1a',
    gridSize: 92,
    gridOpacity: 0.08,
    strokeWidth: 1.75,
    bracketSize: 15
  }
};

export function getPolygon(c) {
  return `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`;
}

export function exportCSS(tokens) {
  const polygon = getPolygon(tokens.chamfer);
  return `/* Kinetic Blueprint Tokens */
:root {
  --c: ${tokens.chamfer}px;
  --accent: ${tokens.accent};
  --accent-hover: ${tokens.accentHover};
  --surface: ${tokens.surface};
  --surface-card: ${tokens.surfaceCard};
  --surface-well: ${tokens.surfaceWell};
  --text: ${tokens.textColor};
  --grid-size: ${tokens.gridSize}px;
  --grid-opacity: ${tokens.gridOpacity};
  --stroke-width: ${tokens.strokeWidth}px;
  --bracket-size: ${tokens.bracketSize}px;
}

/* 8-Point Chamfer Cut Corners */
.chamfer {
  --c: ${tokens.chamfer}px;
  clip-path: ${polygon};
}

/* Blueprint Coordinate Grid */
.blueprint {
  background-color: var(--surface);
  background-image:
    linear-gradient(to right, rgba(255,255,255, var(--grid-opacity)) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255, var(--grid-opacity)) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}`;
}

export function exportTailwind(tokens) {
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blueprint: {
          surface: '${tokens.surface}',
          card: '${tokens.surfaceCard}',
          well: '${tokens.surfaceWell}',
          accent: '${tokens.accent}',
          'accent-hover': '${tokens.accentHover}',
          text: '${tokens.textColor}',
        }
      },
      clipPath: {
        chamfer: '${getPolygon(tokens.chamfer)}',
      }
    }
  }
};`;
}

export function exportJSON(tokens) {
  return JSON.stringify({
    $schema: 'https://design-tokens.github.io/community-group/format/',
    name: tokens.name || 'Kinetic Blueprint Custom Theme',
    tokens: {
      chamfer: { $value: `${tokens.chamfer}px`, $type: 'dimension' },
      accent: { $value: tokens.accent, $type: 'color' },
      surface: { $value: tokens.surface, $type: 'color' },
      surfaceCard: { $value: tokens.surfaceCard, $type: 'color' },
      gridSize: { $value: `${tokens.gridSize}px`, $type: 'dimension' },
      gridOpacity: { $value: tokens.gridOpacity, $type: 'number' },
      strokeWidth: { $value: `${tokens.strokeWidth}px`, $type: 'dimension' },
      bracketSize: { $value: `${tokens.bracketSize}px`, $type: 'dimension' }
    }
  }, null, 2);
}

export function exportReact(tokens, activeSpecimen, activeGlyph) {
  const polygon = getPolygon(tokens.chamfer);
  const btnPolygon = getPolygon(Math.min(8, tokens.chamfer));
  const innerPolygon = getPolygon(Math.max(4, tokens.chamfer - 4));
  const glyphMeta = ICON_META[activeGlyph] || { title: activeGlyph };
  const pascalGlyph = activeGlyph
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('') + 'Icon';

  if (activeSpecimen === 'metric') {
    return `// TelemetryTile.tsx — Blueprint Telemetry Specimen
import React from 'react';
import { ${pascalGlyph} } from './icons';

export function TelemetryTile() {
  return (
    <div
      className="p-5 border border-white/15 transition-all font-mono text-xs shadow-xl"
      style={{
        clipPath: '${polygon}',
        backgroundColor: '${tokens.surfaceCard}',
        color: '${tokens.textColor}'
      }}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '${tokens.accent}' }} />
          <span className="font-bold uppercase tracking-wider">TELEMETRY // ${glyphMeta.title.toUpperCase()}</span>
        </div>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold"
          style={{ borderColor: '${tokens.accent}60', color: '${tokens.accent}' }}
        >
          NOMINAL
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <div>
          <span className="text-[10px] opacity-50 block uppercase">P99 DISPATCH LATENCY</span>
          <div className="text-3xl font-bold tracking-tight">
            0.38 <span style={{ color: '${tokens.accent}' }} className="text-sm font-semibold">ms</span>
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0"
          style={{ color: '${tokens.accent}' }}
        >
          <${pascalGlyph} size={28} />
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9.5px] opacity-60">
        <span>ZK-STARK // VERIFIED</span>
        <span className="text-emerald-400 font-bold">● 6/6 QUORUM</span>
      </div>
    </div>
  );
}`;
  } else if (activeSpecimen === 'buttons') {
    return `// BlueprintButtonRack.tsx — Hardware Button & Stepper Primitives
import React from 'react';
import { ${pascalGlyph} } from './icons';

export function BlueprintButtonRack() {
  return (
    <div
      className="p-5 border border-white/15 space-y-4 font-mono text-xs shadow-xl"
      style={{
        clipPath: '${polygon}',
        backgroundColor: '${tokens.surfaceCard}',
        color: '${tokens.textColor}'
      }}
    >
      <div className="text-[10px] uppercase tracking-wider pb-2 border-b border-white/10 opacity-60">
        HARDWARE CONTROLS // ${glyphMeta.title.toUpperCase()}
      </div>

      <div className="space-y-2.5">
        <button
          className="w-full py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          style={{
            backgroundColor: '${tokens.accent}',
            color: '#16150f',
            clipPath: '${btnPolygon}'
          }}
        >
          <${pascalGlyph} size={16} />
          <span>DEPLOY // ${glyphMeta.title.toUpperCase()}</span>
          <span className="opacity-60 text-[10px]">↵</span>
        </button>

        <button
          className="w-full py-2 px-4 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition cursor-pointer"
          style={{
            borderColor: '${tokens.accent}80',
            color: '${tokens.accent}',
            clipPath: '${btnPolygon}'
          }}
        >
          <span>INSPECT TRACE LOGS</span>
          <span className="opacity-60 text-[10px]">⌘K</span>
        </button>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded bg-black/40 border border-white/10">
        <span className="text-[10px] opacity-60 uppercase">WORKER THREADS:</span>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded bg-white/10 text-cream font-bold cursor-pointer">−</button>
          <span className="font-bold text-sm px-2" style={{ color: '${tokens.accent}' }}>08</span>
          <button className="w-6 h-6 rounded bg-white/10 text-cream font-bold cursor-pointer">+</button>
        </div>
      </div>
    </div>
  );
}`;
  } else if (activeSpecimen === 'table_row') {
    return `// TelemetryRow.tsx — High-Density Table Row Specimen
import React from 'react';
import { ${pascalGlyph} } from './icons';

export function TelemetryRow() {
  return (
    <div
      className="p-4 sm:p-5 border border-white/15 space-y-3 font-mono text-xs shadow-xl"
      style={{
        clipPath: '${polygon}',
        backgroundColor: '${tokens.surfaceCard}',
        color: '${tokens.textColor}'
      }}
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] opacity-60">
        <span>HIGH-DENSITY ROW SPECIMEN</span>
        <span className="text-emerald-400 font-bold">● ACTIVE QUORUM</span>
      </div>

      <div className="p-3 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2.5 shrink-0">
          <input
            type="checkbox"
            defaultChecked
            className="w-3.5 h-3.5 shrink-0"
            style={{ accentColor: '${tokens.accent}' }}
          />
          <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: '${tokens.accent}' }} />
          <span className="font-bold whitespace-nowrap">node-iad-01</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 shrink-0" style={{ color: '${tokens.accent}' }}>
          <${pascalGlyph} size={16} />
          <span className="text-[10px] uppercase font-mono tracking-wider whitespace-nowrap">${glyphMeta.title}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="font-semibold whitespace-nowrap">0.39ms</span>
          <span
            className="px-2 py-0.5 rounded text-[9.5px] uppercase font-bold whitespace-nowrap"
            style={{ backgroundColor: '${tokens.accent}25', color: '${tokens.accent}', border: '1px solid ${tokens.accent}50' }}
          >
            ONLINE
          </span>
          <button
            className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-white/10 hover:bg-white/20 transition cursor-pointer shrink-0 whitespace-nowrap"
            style={{ clipPath: '${btnPolygon}' }}
          >
            DRAIN
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9.5px] opacity-50 pt-1 border-t border-white/5">
        <span>SIG: 0x88ab...3c12</span>
        <span>MEM: 412 MB</span>
        <span>CHAMFER: ${tokens.chamfer}px</span>
      </div>
    </div>
  );
}`;
  } else {
    // Feature Card
    return `// BlueprintCard.tsx — High-End Blueprint Feature Card
import React from 'react';
import { ${pascalGlyph} } from './icons';

export function BlueprintCard() {
  return (
    <div
      className="p-5 border border-white/15 transition-all font-mono text-xs relative group shadow-xl"
      style={{
        clipPath: '${polygon}',
        backgroundColor: '${tokens.surfaceCard}',
        color: '${tokens.textColor}'
      }}
    >
      <span className="bracket tl" style={{ width: '${tokens.bracketSize}px', height: '${tokens.bracketSize}px' }} />
      <span className="bracket tr" style={{ width: '${tokens.bracketSize}px', height: '${tokens.bracketSize}px' }} />
      <span className="bracket bl" style={{ width: '${tokens.bracketSize}px', height: '${tokens.bracketSize}px' }} />
      <span className="bracket br" style={{ width: '${tokens.bracketSize}px', height: '${tokens.bracketSize}px' }} />

      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '${tokens.accent}' }} />
          <span className="font-bold uppercase tracking-wider">LIVE SPECIMEN // 001</span>
        </div>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold"
          style={{ borderColor: '${tokens.accent}80', color: '${tokens.accent}' }}
        >
          ${glyphMeta.title.toUpperCase()}
        </span>
      </div>

      <div
        className="w-full h-32 p-3 flex items-center justify-center relative mb-4 border border-white/10"
        style={{
          clipPath: '${innerPolygon}',
          backgroundColor: '${tokens.surfaceWell}'
        }}
      >
        <div style={{ color: '${tokens.accent}' }}>
          <${pascalGlyph} size={64} />
        </div>
      </div>

      <p className="text-[11.5px] leading-relaxed opacity-80 mb-3">
        Polygonal chamfer silhouettes with dynamic coordinate clipping and balanced stroke weight.
      </p>

      <button
        className="w-full py-2 px-3 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
        style={{
          backgroundColor: '${tokens.accent}',
          color: '#16150f',
          clipPath: '${btnPolygon}'
        }}
      >
        <span>DEPLOY BLUEPRINT</span>
        <span className="opacity-60 text-[9px]">↵</span>
      </button>
    </div>
  );
}`;
  }
}

export class BlueprintConfigurator {
  constructor(options = {}) {
    this.tokens = { ...PRESETS.industrial };
    this.applyGlobally = false;
    this.activeExportTab = 'css';
    this.activeSpecimen = 'card';
    this.activeGlyph = 'cluster';
    this.sfx = options.sfx || (typeof window !== 'undefined' ? window.sfx : null);

    this.specimenEl = document.getElementById(options.specimenId || 'configSpecimen');
    this.codeOutputEl = document.getElementById(options.codeOutputId || 'configCodeOutput');
    this.polygonReadoutEl = document.getElementById(options.polygonReadoutId || 'configPolygonReadout');
    this.glyphCategoryEl = document.getElementById('cfgGlyphCategory');

    this.initControls();
    this.update();
  }

  setToken(key, value) {
    this.tokens[key] = value;
    this.update();
  }

  setSpecimen(specimenId) {
    this.activeSpecimen = specimenId;
    this.update();
  }

  setGlyph(glyphId) {
    this.activeGlyph = glyphId;
    if (this.glyphCategoryEl) {
      const meta = ICON_META[glyphId];
      if (meta && meta.category) {
        this.glyphCategoryEl.textContent = meta.category.toUpperCase();
      }
    }
    this.update();
  }

  loadPreset(presetId) {
    if (PRESETS[presetId]) {
      this.tokens = { ...PRESETS[presetId] };
      this.syncControls();
      this.update();
      if (this.sfx) this.sfx.click();
    }
  }

  setGlobalApply(apply) {
    this.applyGlobally = apply;
    if (apply) {
      this.applyToDocument();
    } else {
      this.resetDocument();
    }
  }

  applyToDocument() {
    const root = document.documentElement;
    root.style.setProperty('--c', `${this.tokens.chamfer}px`);
    root.style.setProperty('--orange', this.tokens.accent);
    root.style.setProperty('--orange-hover', this.tokens.accentHover);
    root.style.setProperty('--grid-size', `${this.tokens.gridSize}px`);
  }

  resetDocument() {
    const root = document.documentElement;
    root.style.removeProperty('--c');
    root.style.removeProperty('--orange');
    root.style.removeProperty('--orange-hover');
    root.style.removeProperty('--grid-size');
  }

  renderActiveSpecimen() {
    if (!this.specimenEl) return;

    // Dynamically adjust container width to match realistic component dimensions
    if (this.activeSpecimen === 'table_row') {
      this.specimenEl.className = "relative z-10 w-full max-w-[560px] transition-all duration-300 shadow-2xl";
    } else if (this.activeSpecimen === 'metric') {
      this.specimenEl.className = "relative z-10 w-full max-w-[380px] transition-all duration-300 shadow-xl";
    } else {
      this.specimenEl.className = "relative z-10 w-full max-w-[360px] transition-all duration-300 shadow-xl";
    }

    const polygon = getPolygon(this.tokens.chamfer);
    const btnPolygon = getPolygon(Math.min(8, this.tokens.chamfer));
    const innerPolygon = getPolygon(Math.max(4, this.tokens.chamfer - 4));
    const glyphMeta = ICON_META[this.activeGlyph] || { title: this.activeGlyph, category: 'ICON' };
    
    // Scale glyph with dynamic stroke and strict pixel dimensions
    const getGlyphSvg = (size, extraClass = '') => {
      let raw = ICONS[this.activeGlyph] || ICONS['cluster'];
      raw = raw.replace(/stroke-width="[^"]*"/g, `stroke-width="${this.tokens.strokeWidth}"`);
      return raw
        .replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24" width="${size}" height="${size}" style="width:${size}px;height:${size}px;display:block;"`)
        .replace('class="blueprint-icon"', `class="blueprint-icon ${extraClass}"`);
    };

    if (this.activeSpecimen === 'metric') {
      this.specimenEl.style.clipPath = polygon;
      this.specimenEl.style.backgroundColor = this.tokens.surfaceCard;
      this.specimenEl.style.color = this.tokens.textColor;
      this.specimenEl.innerHTML = `
        <div class="p-5 border border-white/15 space-y-3 font-mono text-xs relative group">
          <!-- Corner Crop Brackets (Scale with Bracket Size Slider) -->
          <span class="bracket tl" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket tr" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket bl" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket br" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>

          <!-- Top Header -->
          <div class="flex items-center justify-between pb-2 border-b border-white/10 text-[10.5px]">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${this.tokens.accent}"></span>
              <span class="font-bold tracking-wider uppercase">TELEMETRY // ${(glyphMeta.title || this.activeGlyph).toUpperCase()}</span>
            </div>
            <span class="text-[9.5px] px-1.5 py-0.5 rounded border uppercase font-bold" style="border-color: ${this.tokens.accent}60; color: ${this.tokens.accent}">
              NOMINAL
            </span>
          </div>

          <!-- Value & Big Icon Viewport -->
          <div class="flex items-center justify-between py-1">
            <div>
              <span class="text-[10px] opacity-60 uppercase block">P99 DISPATCH LATENCY</span>
              <div class="text-3xl font-bold tracking-tight mt-0.5">
                0.38 <span style="color: ${this.tokens.accent}" class="text-sm font-semibold">ms</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0" style="color: ${this.tokens.accent}">
              ${getGlyphSvg(28)}
            </div>
          </div>

          <!-- Mini Inline Sparkline Graph -->
          <div class="space-y-1 pt-1">
            <div class="flex justify-between text-[9.5px] opacity-60">
              <span>LATENCY TREND (LAST 60 SEC)</span>
              <span style="color: ${this.tokens.accent}">STABLE (σ = 0.02ms)</span>
            </div>
            <div class="w-full h-8 bg-black/50 rounded border border-white/5 flex items-end p-1 gap-1">
              <div class="flex-1 bg-white/15 rounded-t" style="height: 45%;"></div>
              <div class="flex-1 bg-white/15 rounded-t" style="height: 52%;"></div>
              <div class="flex-1 bg-white/15 rounded-t" style="height: 48%;"></div>
              <div class="flex-1 bg-white/20 rounded-t" style="height: 60%;"></div>
              <div class="flex-1 bg-white/25 rounded-t" style="height: 42%;"></div>
              <div class="flex-1 bg-white/30 rounded-t" style="height: 50%;"></div>
              <div class="flex-1 rounded-t" style="height: 38%; background-color: ${this.tokens.accent}"></div>
            </div>
          </div>

          <!-- Bottom Metadata Strip -->
          <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[9.5px] opacity-60">
            <span>CONSENSUS: ED25519-STARK</span>
            <span class="text-emerald-400 font-bold">● 6/6 QUORUM</span>
          </div>
        </div>
      `;
    } else if (this.activeSpecimen === 'buttons') {
      this.specimenEl.style.clipPath = polygon;
      this.specimenEl.style.backgroundColor = this.tokens.surfaceCard;
      this.specimenEl.style.color = this.tokens.textColor;
      this.specimenEl.innerHTML = `
        <div class="p-5 border border-white/15 space-y-4 font-mono text-xs">
          <div class="flex items-center justify-between pb-2 border-b border-white/10 text-[10.5px]">
            <span class="font-bold uppercase tracking-wider">HARDWARE CONTROLS // ${(glyphMeta.title || this.activeGlyph).toUpperCase()}</span>
            <span class="text-[9.5px] opacity-50">CHAMFER: ${this.tokens.chamfer}px</span>
          </div>

          <!-- Buttons Stack -->
          <div class="space-y-2.5">
            <button class="w-full py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg" style="background-color: ${this.tokens.accent}; color: #16150f; clip-path: ${btnPolygon}">
              ${getGlyphSvg(16, 'shrink-0')}
              <span>DEPLOY // ${(glyphMeta.title || this.activeGlyph).toUpperCase()}</span>
              <span class="opacity-60 text-[10px]">↵</span>
            </button>

            <button class="w-full py-2 px-4 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition cursor-pointer hover:bg-white/5" style="border-color: ${this.tokens.accent}80; color: ${this.tokens.accent}; clip-path: ${btnPolygon}">
              <span>INSPECT TRACE LOGS</span>
              <span class="opacity-60 text-[10px]">⌘K</span>
            </button>

            <button class="w-full py-2 px-4 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer" style="clip-path: ${btnPolygon}">
              <span>TERMINATE RUNTIME ISOLATE</span>
              <span class="opacity-60 text-[10px]">✕</span>
            </button>
          </div>

          <!-- Precision Stepper Strip -->
          <div class="flex items-center justify-between p-2.5 rounded bg-black/40 border border-white/10">
            <span class="text-[10px] opacity-60 uppercase">WORKER THREADS:</span>
            <div class="flex items-center gap-2">
              <button class="w-6 h-6 rounded bg-white/10 hover:bg-white/20 font-bold transition flex items-center justify-center cursor-pointer">−</button>
              <span class="font-bold text-sm px-2" style="color: ${this.tokens.accent}">08</span>
              <button class="w-6 h-6 rounded bg-white/10 hover:bg-white/20 font-bold transition flex items-center justify-center cursor-pointer">+</button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeSpecimen === 'table_row') {
      this.specimenEl.style.clipPath = polygon;
      this.specimenEl.style.backgroundColor = this.tokens.surfaceCard;
      this.specimenEl.style.color = this.tokens.textColor;
      this.specimenEl.innerHTML = `
        <div class="p-4 sm:p-5 border border-white/15 space-y-3 font-mono text-xs">
          <!-- Top Row Header -->
          <div class="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] opacity-60">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: ${this.tokens.accent}"></span>
              <span class="font-bold tracking-wider uppercase opacity-90">HIGH-DENSITY ROW SPECIMEN</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[9px] px-1.5 py-0.5 rounded border border-white/10 opacity-70 uppercase">6/6 QUORUM</span>
              <span class="text-emerald-400 font-bold">● ACTIVE</span>
            </div>
          </div>

          <!-- Table Row with generous spacing and no text breaking -->
          <div class="p-3 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between gap-3 overflow-x-auto">
            <!-- Node Checkbox and ID (whitespace-nowrap prevents node-iad-01 from splitting) -->
            <div class="flex items-center gap-2.5 shrink-0">
              <input type="checkbox" checked class="checkbox-chamfer shrink-0 cursor-pointer" style="accent-color: ${this.tokens.accent}" title="Select node" />
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="w-2 h-2 rounded-full animate-pulse shrink-0" style="background-color: ${this.tokens.accent}"></span>
                <span class="font-bold tracking-tight whitespace-nowrap text-xs">node-iad-01</span>
              </div>
            </div>

            <!-- Active Technical Glyph Badge (Always visible and reactive) -->
            <div class="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 shrink-0" style="color: ${this.tokens.accent}">
              ${getGlyphSvg(16, 'shrink-0')}
              <span class="text-[10px] opacity-80 uppercase font-mono tracking-wider whitespace-nowrap">${glyphMeta.title}</span>
            </div>

            <!-- Telemetry & Action: Latency, Online Badge, and Chamfered DRAIN Button -->
            <div class="flex items-center gap-3 shrink-0 text-[11px]">
              <span class="font-mono font-semibold whitespace-nowrap opacity-90">0.39ms</span>
              <span class="px-2 py-0.5 rounded text-[9.5px] uppercase font-bold tracking-wider whitespace-nowrap" style="background-color: ${this.tokens.accent}25; color: ${this.tokens.accent}; border: 1px solid ${this.tokens.accent}50">
                ONLINE
              </span>
              <button class="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-white/10 hover:bg-white/20 transition cursor-pointer shrink-0 whitespace-nowrap" style="clip-path: ${btnPolygon}">
                DRAIN
              </button>
            </div>
          </div>

          <!-- Row Metadata Footer -->
          <div class="flex items-center justify-between text-[9.5px] opacity-50 pt-1 border-t border-white/5">
            <span class="font-mono">SIG: 0x88ab...3c12</span>
            <span class="font-mono">MEM: 412 MB</span>
            <span class="text-orange/80 font-mono">CHAMFER: ${this.tokens.chamfer}px</span>
          </div>
        </div>
      `;
    } else {
      // Default: Feature Card
      this.specimenEl.style.clipPath = polygon;
      this.specimenEl.style.backgroundColor = this.tokens.surfaceCard;
      this.specimenEl.style.color = this.tokens.textColor;
      this.specimenEl.innerHTML = `
        <div class="p-5 border border-white/15 transition-all shadow-xl group relative font-mono">
          <!-- Corner Brackets -->
          <span class="bracket tl" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket tr" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket bl" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket br" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>

          <!-- Specimen Header -->
          <div class="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px]">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: ${this.tokens.accent}"></span>
              <span class="font-bold uppercase tracking-wider">LIVE SPECIMEN // 001</span>
            </div>
            <span class="specimen-badge text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold" style="border-color: ${this.tokens.accent}80; color: ${this.tokens.accent}">
              ${glyphMeta.title.toUpperCase()}
            </span>
          </div>

          <!-- Specimen Media Viewport -->
          <div class="specimen-media w-full h-32 p-3 flex items-center justify-center relative mb-4 border border-white/10" style="clip-path: ${innerPolygon}; background-color: ${this.tokens.surfaceWell}">
            <div style="color: ${this.tokens.accent}">
              ${getGlyphSvg(64)}
            </div>
          </div>

          <!-- Specimen Body & Button -->
          <div class="space-y-3">
            <p class="text-[11.5px] leading-relaxed opacity-80">
              Polygonal chamfer silhouettes with dynamic coordinate clipping and balanced stroke weight.
            </p>
            <button class="specimen-btn w-full py-2 px-3 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer" style="background-color: ${this.tokens.accent}; color: #16150f; clip-path: ${btnPolygon}">
              <span>DEPLOY BLUEPRINT</span>
              <span class="opacity-60 text-[9px]">↵</span>
            </button>
          </div>
        </div>
      `;
    }
  }

  update() {
    // 1. Update polygon equation readout
    if (this.polygonReadoutEl) {
      this.polygonReadoutEl.textContent = `clip-path: polygon(${this.tokens.chamfer}px 0, calc(100% - ${this.tokens.chamfer}px) 0...)`;
    }

    // 2. Render active specimen into stage
    this.renderActiveSpecimen();

    // 3. Update preview stage grid background size dynamically
    const stageGrid = document.getElementById('configStageGrid');
    if (stageGrid) {
      stageGrid.style.setProperty('--grid-size', `${this.tokens.gridSize}px`);
      stageGrid.style.backgroundSize = `${this.tokens.gridSize}px ${this.tokens.gridSize}px`;
    }

    // 4. Update Code Output block
    if (this.codeOutputEl) {
      if (this.activeExportTab === 'css') {
        this.codeOutputEl.textContent = exportCSS(this.tokens);
      } else if (this.activeExportTab === 'tailwind') {
        this.codeOutputEl.textContent = exportTailwind(this.tokens);
      } else if (this.activeExportTab === 'json') {
        this.codeOutputEl.textContent = exportJSON(this.tokens);
      } else if (this.activeExportTab === 'react') {
        this.codeOutputEl.textContent = exportReact(this.tokens, this.activeSpecimen, this.activeGlyph);
      }
    }

    // 5. Update Document if global apply is ON
    if (this.applyGlobally) {
      this.applyToDocument();
    }
  }

  syncControls() {
    const chamferSlider = document.getElementById('cfgChamferSlider');
    const chamferVal = document.getElementById('cfgChamferVal');
    if (chamferSlider) chamferSlider.value = this.tokens.chamfer;
    if (chamferVal) chamferVal.textContent = `${this.tokens.chamfer}px`;

    const gridSlider = document.getElementById('cfgGridSlider');
    const gridVal = document.getElementById('cfgGridVal');
    if (gridSlider) gridSlider.value = this.tokens.gridSize;
    if (gridVal) gridVal.textContent = `${this.tokens.gridSize}px`;

    const bracketSlider = document.getElementById('cfgBracketSlider');
    const bracketVal = document.getElementById('cfgBracketVal');
    if (bracketSlider) bracketSlider.value = this.tokens.bracketSize;
    if (bracketVal) bracketVal.textContent = `${this.tokens.bracketSize}px`;

    const colorPicker = document.getElementById('cfgColorPicker');
    if (colorPicker) colorPicker.value = this.tokens.accent;

    const glyphSelect = document.getElementById('cfgGlyphSelect');
    if (glyphSelect) glyphSelect.value = this.activeGlyph;

    // Sync Stroke Weight Buttons active highlight
    const strokeBtns = document.querySelectorAll('.cfg-stroke-btn');
    strokeBtns.forEach(btn => {
      const s = parseFloat(btn.dataset.stroke);
      if (Math.abs(s - this.tokens.strokeWidth) < 0.05) {
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/70');
      } else {
        btn.classList.remove('bg-orange', 'text-near', 'font-bold');
        btn.classList.add('hover:bg-white/10', 'text-cream/70');
      }
    });

    // Sync Accent Color Swatches active selection ring
    const swatches = document.querySelectorAll('.cfg-color-swatch');
    swatches.forEach(swatch => {
      if (swatch.dataset.color.toLowerCase() === this.tokens.accent.toLowerCase()) {
        swatch.classList.add('border-2', 'border-white/90', 'scale-110');
        swatch.classList.remove('border-white/20');
      } else {
        swatch.classList.remove('border-2', 'border-white/90', 'scale-110');
        swatch.classList.add('border', 'border-white/20');
      }
    });
  }

  initControls() {
    // Specimen tabs
    const specimenTabs = document.querySelectorAll('.cfg-specimen-tab');
    specimenTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        specimenTabs.forEach(t => {
          t.classList.remove('bg-orange', 'text-near', 'font-bold');
          t.classList.add('hover:bg-white/10', 'text-cream/70');
        });
        tab.classList.add('bg-orange', 'text-near', 'font-bold');
        tab.classList.remove('hover:bg-white/10', 'text-cream/70');
        this.setSpecimen(tab.dataset.specimen);
        if (this.sfx) this.sfx.click();
      });
    });

    // Glyph selector dropdown
    const glyphSelect = document.getElementById('cfgGlyphSelect');
    glyphSelect?.addEventListener('change', (e) => {
      this.setGlyph(e.target.value);
      if (this.sfx) this.sfx.tick();
    });

    // Chamfer slider
    const chamferSlider = document.getElementById('cfgChamferSlider');
    const chamferVal = document.getElementById('cfgChamferVal');
    chamferSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (chamferVal) chamferVal.textContent = `${val}px`;
      this.setToken('chamfer', val);
      if (this.sfx) this.sfx.tick();
    });

    // Grid size slider
    const gridSlider = document.getElementById('cfgGridSlider');
    const gridVal = document.getElementById('cfgGridVal');
    gridSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (gridVal) gridVal.textContent = `${val}px`;
      this.setToken('gridSize', val);
      if (this.sfx) this.sfx.tick();
    });

    // Bracket size slider
    const bracketSlider = document.getElementById('cfgBracketSlider');
    const bracketVal = document.getElementById('cfgBracketVal');
    bracketSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (bracketVal) bracketVal.textContent = `${val}px`;
      this.setToken('bracketSize', val);
      if (this.sfx) this.sfx.tick();
    });

    // Palette preset swatches
    const swatches = document.querySelectorAll('.cfg-color-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        const hover = swatch.dataset.hover || color;
        this.setToken('accent', color);
        this.setToken('accentHover', hover);
        const picker = document.getElementById('cfgColorPicker');
        if (picker) picker.value = color;
        this.syncControls();
        if (this.sfx) this.sfx.click();
      });
    });

    // Native color picker
    const colorPicker = document.getElementById('cfgColorPicker');
    colorPicker?.addEventListener('input', (e) => {
      this.setToken('accent', e.target.value);
      this.setToken('accentHover', e.target.value);
      this.syncControls();
    });

    // Stroke width buttons
    const strokeBtns = document.querySelectorAll('.cfg-stroke-btn');
    strokeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        strokeBtns.forEach(b => b.classList.remove('bg-orange', 'text-near', 'font-bold'));
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        this.setToken('strokeWidth', parseFloat(btn.dataset.stroke));
        if (this.sfx) this.sfx.click();
      });
    });

    // Preset pills
    const presetPills = document.querySelectorAll('.cfg-preset-pill');
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        presetPills.forEach(p => {
          p.classList.remove('bg-orange', 'text-near', 'font-bold');
          p.classList.add('bg-white/5', 'text-cream/70');
        });
        pill.classList.add('bg-orange', 'text-near', 'font-bold');
        pill.classList.remove('bg-white/5', 'text-cream/70');
        this.loadPreset(pill.dataset.preset);
      });
    });

    // Export tab buttons
    const exportTabs = document.querySelectorAll('.cfg-export-tab');
    exportTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        exportTabs.forEach(t => {
          t.classList.remove('bg-white/20', 'text-white', 'font-bold');
          t.classList.add('hover:bg-white/10', 'text-cream/60');
        });
        tab.classList.add('bg-white/20', 'text-white', 'font-bold');
        tab.classList.remove('hover:bg-white/10', 'text-cream/60');
        this.activeExportTab = tab.dataset.tab;
        this.update();
        if (this.sfx) this.sfx.tick();
      });
    });

    // Global apply checkbox toggle
    const globalToggle = document.getElementById('cfgGlobalToggle');
    globalToggle?.addEventListener('change', (e) => {
      this.setGlobalApply(e.target.checked);
      if (this.sfx) this.sfx.click();
    });

    // Copy export code button
    const copyBtn = document.getElementById('cfgCopyBtn');
    copyBtn?.addEventListener('click', () => {
      if (this.codeOutputEl) {
        navigator.clipboard?.writeText(this.codeOutputEl.textContent).then(() => {
          if (this.sfx) this.sfx.success();
          const toast = document.getElementById('toast');
          const toastMsg = document.getElementById('toastMsg');
          if (toast && toastMsg) {
            toastMsg.textContent = `Copied ${this.activeExportTab.toUpperCase()} configuration to clipboard!`;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2200);
          }
        });
      }
    });

    this.syncControls();
  }
}

export function initConfigurator(options = {}) {
  return new BlueprintConfigurator(options);
}
