/**
 * Blueprint Design System Token Configurator Engine 2.0
 * Generates dynamic 8-point chamfer polygon clip-paths, live CSS variable bindings,
 * multi-component specimen workbench, and multi-format design token export (CSS, Tailwind, DTCG JSON, React/JSX).
 */

import JSZip from 'jszip';
import { ICONS, ICON_META, renderIcon } from './icons.js';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadText(text, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mimeType });
  downloadBlob(blob, filename);
}

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
  avionics: {
    id: 'avionics',
    name: 'Avionics Phosphor Green',
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

export const SILHOUETTES = {
  symmetric: {
    id: 'symmetric',
    name: '8-Point Symmetric Chamfer',
    label: 'SYMMETRIC (8-PT)',
    description: 'Uniform chamfer on all 4 corners'
  },
  'top-only': {
    id: 'top-only',
    name: 'Top-Only Chamfer',
    label: 'TOP-ONLY (TAB)',
    description: 'Top corners beveled, bottom corners square'
  },
  diagonal: {
    id: 'diagonal',
    name: 'Diagonal Chamfer',
    label: 'DIAGONAL OPPOSING',
    description: 'Top-left and bottom-right chamfered'
  },
  notch: {
    id: 'notch',
    name: 'Inward Stepped Notch',
    label: 'INWARD NOTCH',
    description: '12-point microchip stepped perimeter notch'
  }
};

export const SPEC_ROULETTE = {
  silhouettes: ['symmetric', 'top-only', 'diagonal', 'notch'],
  accents: [
    { color: '#f4551d', hover: '#ea4f1a', name: 'Kinetic Orange' },
    { color: '#f59e0b', hover: '#d97706', name: 'Synth Amber' },
    { color: '#10b981', hover: '#059669', name: 'Radar Emerald' },
    { color: '#06b6d4', hover: '#0891b2', name: 'Quantum Cyan' },
    { color: '#8b5cf6', hover: '#7c3aed', name: 'Hydraulic Violet' },
    { color: '#ef4444', hover: '#dc2626', name: 'Alarm Ruby' },
    { color: '#39ff14', hover: '#32e012', name: 'Cyber Lime' },
    { color: '#38bdf8', hover: '#0284c7', name: 'Cobalt Pulse' }
  ],
  chamfers: [6, 8, 10, 12, 14, 16, 18],
  gridSizes: [48, 64, 72, 84, 96],
  strokeWidths: [1.0, 1.35, 1.75],
  bracketSizes: [9, 11, 13, 15]
};

export function getPolygon(c, silhouette = 'symmetric') {
  switch (silhouette) {
    case 'top-only':
      return `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, 0 100%, 0 ${c}px)`;
    case 'diagonal':
      return `polygon(${c}px 0, 100% 0, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0 100%, 0 ${c}px)`;
    case 'notch':
      return `polygon(0 ${c}px, ${c}px ${c}px, ${c}px 0, calc(100% - ${c}px) 0, calc(100% - ${c}px) ${c}px, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, ${c}px calc(100% - ${c}px), 0 calc(100% - ${c}px))`;
    case 'symmetric':
    default:
      return `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`;
  }
}

export function exportCSS(tokens) {
  const sil = tokens.silhouette || 'symmetric';
  const polygon = getPolygon(tokens.chamfer, sil);
  const silName = SILHOUETTES[sil]?.name || 'Chamfer';
  return `/* Kinetic Blueprint Tokens */
:root {
  --c: ${tokens.chamfer}px;
  --silhouette: ${sil};
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

/* ${silName} Silhouette */
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
  const sil = tokens.silhouette || 'symmetric';
  const polygon = getPolygon(tokens.chamfer, sil);
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
        'blueprint-${sil}': '${polygon}',
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
      silhouette: { $value: tokens.silhouette || 'symmetric', $type: 'string' },
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
  const sil = tokens.silhouette || 'symmetric';
  const polygon = getPolygon(tokens.chamfer, sil);
  const btnPolygon = getPolygon(Math.min(8, tokens.chamfer), sil);
  const innerPolygon = getPolygon(Math.max(4, tokens.chamfer - 4), sil);
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
      ${sil !== 'top-only' ? `<span className="bracket bl" style={{ width: '${tokens.bracketSize}px', height: '${tokens.bracketSize}px' }} />
      <span className="bracket br" style={{ width: '${tokens.bracketSize}px', height: '${tokens.bracketSize}px' }} />` : ''}

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
    this.tokens = {
      silhouette: 'symmetric',
      ...PRESETS.industrial
    };
    this.applyGlobally = false;
    this.activeExportTab = 'css';
    this.activeSpecimen = 'card';
    this.activeGlyph = 'cluster';
    this.activeState = 'default';
    this.autoCycleTimer = null;
    this.toastTimeout = null;
    this.sfx = options.sfx || (typeof window !== 'undefined' ? window.sfx : null);

    this.specimenEl = document.getElementById(options.specimenId || 'configSpecimen');
    this.codeOutputEl = document.getElementById(options.codeOutputId || 'configCodeOutput');
    this.polygonReadoutEl = document.getElementById(options.polygonReadoutId || 'configPolygonReadout');
    this.glyphCategoryEl = document.getElementById('cfgGlyphCategory');
    this.scanlineEl = document.getElementById('configScanline');
    this.silhouetteLabelEl = document.getElementById('cfgSilhouetteLabel');

    this.initControls();

    // Check if deep link spec hash was provided in URL
    const loadedHash = this.loadFromHash();
    if (loadedHash) {
      this.syncControls();
    }

    this.renderCustomPresets();
    this.update();
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.remove('hidden');
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => toast.classList.add('hidden'), 2600);
    }
  }

  getCustomPresets() {
    try {
      const raw = localStorage.getItem('blueprint_studio_custom_presets');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Unable to read presets from localStorage:', e);
      return [];
    }
  }

  saveCustomPresets(presets) {
    try {
      localStorage.setItem('blueprint_studio_custom_presets', JSON.stringify(presets));
    } catch (e) {
      console.warn('Unable to write presets to localStorage:', e);
    }
  }

  saveCustomPreset(name) {
    const cleanName = (name || '').trim();
    if (!cleanName) {
      this.showToast('Please enter a preset name');
      return;
    }
    const presets = this.getCustomPresets();
    const newPreset = {
      id: 'custom-' + Date.now(),
      name: cleanName,
      tokens: { ...this.tokens },
      specimen: this.activeSpecimen,
      glyph: this.activeGlyph
    };
    presets.push(newPreset);
    this.saveCustomPresets(presets);
    this.renderCustomPresets();
    if (this.sfx) this.sfx.success();
    this.showToast(`Saved preset: "${cleanName}"`);
  }

  deleteCustomPreset(id) {
    let presets = this.getCustomPresets();
    presets = presets.filter(p => p.id !== id);
    this.saveCustomPresets(presets);
    this.renderCustomPresets();
    if (this.sfx) this.sfx.tick();
    this.showToast('Custom preset removed');
  }

  loadCustomPreset(id) {
    const presets = this.getCustomPresets();
    const preset = presets.find(p => p.id === id);
    if (!preset) return;

    this.tokens = { ...preset.tokens };
    if (preset.specimen) this.activeSpecimen = preset.specimen;
    if (preset.glyph) this.activeGlyph = preset.glyph;

    // Reset factory preset pill highlights
    document.querySelectorAll('.cfg-preset-pill').forEach(p => {
      p.classList.remove('bg-orange', 'text-near', 'font-bold');
      p.classList.add('bg-white/5', 'text-cream/70');
    });

    this.syncControls();
    this.update();
    if (this.sfx) this.sfx.click();
    this.showToast(`Loaded preset: "${preset.name}"`);
  }

  renderCustomPresets() {
    const rack = document.getElementById('cfgCustomPresetsRack');
    if (!rack) return;
    rack.innerHTML = '';
    const presets = this.getCustomPresets();

    presets.forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'inline-flex items-center rounded bg-white/5 hover:bg-white/10 border border-white/10 text-cream/80 text-[10px] pl-2 pr-1 py-0.5 transition group';
      
      const loadBtn = document.createElement('button');
      loadBtn.className = 'cfg-custom-preset-btn font-mono font-medium hover:text-orange cursor-pointer tracking-wider truncate max-w-[100px]';
      loadBtn.textContent = p.name.toUpperCase();
      loadBtn.title = `Load custom preset: ${p.name}`;
      loadBtn.addEventListener('click', () => this.loadCustomPreset(p.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'cfg-delete-preset-btn ml-1.5 text-cream/40 hover:text-red-400 cursor-pointer font-bold px-1 transition text-xs leading-none';
      delBtn.textContent = '×';
      delBtn.title = `Delete preset ${p.name}`;
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteCustomPreset(p.id);
      });

      chip.appendChild(loadBtn);
      chip.appendChild(delBtn);
      rack.appendChild(chip);
    });
  }

  getSpecHash() {
    const acc = encodeURIComponent(this.tokens.accent);
    const sil = this.tokens.silhouette || 'symmetric';
    return `#spec=c:${this.tokens.chamfer};sil:${sil};acc:${acc};grd:${this.tokens.gridSize};str:${this.tokens.strokeWidth};brk:${this.tokens.bracketSize};spc:${this.activeSpecimen};gly:${this.activeGlyph}`;
  }

  loadFromHash() {
    if (typeof window === 'undefined' || !window.location.hash) return false;
    const hash = window.location.hash;
    const match = hash.match(/#spec=(.+)$/);
    if (!match) return false;

    try {
      const pairs = match[1].split(';');
      const params = {};
      for (const pair of pairs) {
        const [k, v] = pair.split(':');
        if (k && v) params[k] = v;
      }

      if (params.c) this.tokens.chamfer = parseInt(params.c, 10);
      if (params.sil && SILHOUETTES[params.sil]) this.tokens.silhouette = params.sil;
      if (params.acc) {
        const color = decodeURIComponent(params.acc);
        this.tokens.accent = color.startsWith('#') ? color : `#${color}`;
        this.tokens.accentHover = this.tokens.accent;
      }
      if (params.grd) this.tokens.gridSize = parseInt(params.grd, 10);
      if (params.str) this.tokens.strokeWidth = parseFloat(params.str);
      if (params.brk) this.tokens.bracketSize = parseInt(params.brk, 10);
      if (params.spc) this.activeSpecimen = params.spc;
      if (params.gly && ICONS[params.gly]) this.activeGlyph = params.gly;

      return true;
    } catch (e) {
      console.warn('Unable to hydrate spec from URL hash:', e);
      return false;
    }
  }

  copyShareLink() {
    const hash = this.getSpecHash();
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', hash);
      const fullUrl = window.location.href;
      navigator.clipboard?.writeText(fullUrl).then(() => {
        if (this.sfx) this.sfx.success();
        this.showToast('Shareable spec link copied to clipboard!');
      }).catch(() => {
        this.showToast('Error copying link to clipboard');
      });
    }
  }

  randomizeSpec() {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const chosenSilhouette = pick(SPEC_ROULETTE.silhouettes);
    const chosenAccent = pick(SPEC_ROULETTE.accents);
    const chosenChamfer = pick(SPEC_ROULETTE.chamfers);
    const chosenGrid = pick(SPEC_ROULETTE.gridSizes);
    const chosenStroke = pick(SPEC_ROULETTE.strokeWidths);
    const chosenBracket = pick(SPEC_ROULETTE.bracketSizes);
    
    // Pick from all available icons in ICONS
    const iconKeys = Object.keys(ICONS);
    const chosenGlyph = pick(iconKeys);

    this.tokens.silhouette = chosenSilhouette;
    this.tokens.accent = chosenAccent.color;
    this.tokens.accentHover = chosenAccent.hover;
    this.tokens.chamfer = chosenChamfer;
    this.tokens.gridSize = chosenGrid;
    this.tokens.strokeWidth = chosenStroke;
    this.tokens.bracketSize = chosenBracket;
    this.activeGlyph = chosenGlyph;

    // Reset factory preset pill highlights
    document.querySelectorAll('.cfg-preset-pill').forEach(p => {
      p.classList.remove('bg-orange', 'text-near', 'font-bold');
      p.classList.add('bg-white/5', 'text-cream/70');
    });

    this.syncControls();
    this.update();
    if (this.sfx) this.sfx.click();

    this.showToast(`🎲 Generated: ${chosenAccent.name} // ${chosenSilhouette.toUpperCase()}`);
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

  setSilhouette(silhouetteId) {
    if (!SILHOUETTES[silhouetteId]) return;
    this.tokens.silhouette = silhouetteId;
    if (this.silhouetteLabelEl) {
      this.silhouetteLabelEl.textContent = SILHOUETTES[silhouetteId].label;
    }
    this.syncControls();
    this.update();
    if (this.sfx) this.sfx.click();
  }

  setState(stateId) {
    this.activeState = stateId;
    this.applySimulatedState();
    this.syncControls();
    if (this.sfx) this.sfx.tick();
  }

  applySimulatedState() {
    if (!this.specimenEl) return;

    this.specimenEl.classList.remove('specimen-sim-hover', 'specimen-sim-armed', 'specimen-sim-scan');

    if (this.scanlineEl) {
      if (this.activeState === 'scan') {
        this.scanlineEl.classList.remove('hidden');
        this.scanlineEl.classList.add('blueprint-scanline-active');
        this.scanlineEl.style.setProperty('--orange', this.tokens.accent);
      } else {
        this.scanlineEl.classList.add('hidden');
        this.scanlineEl.classList.remove('blueprint-scanline-active');
      }
    }

    if (this.activeState === 'hover') {
      this.specimenEl.classList.add('specimen-sim-hover');
    } else if (this.activeState === 'armed') {
      this.specimenEl.classList.add('specimen-sim-armed');
    } else if (this.activeState === 'scan') {
      this.specimenEl.classList.add('specimen-sim-scan');
    }
  }

  toggleAutoCycle() {
    if (this.autoCycleTimer) {
      clearInterval(this.autoCycleTimer);
      this.autoCycleTimer = null;
      this.updateAutoCycleUI(false);
      if (this.sfx) this.sfx.click();
    } else {
      const states = ['default', 'hover', 'armed', 'scan'];
      this.updateAutoCycleUI(true);
      if (this.sfx) this.sfx.success();
      this.autoCycleTimer = setInterval(() => {
        const currentIndex = states.indexOf(this.activeState);
        const nextState = states[(currentIndex + 1) % states.length];
        this.setState(nextState);
      }, 2000);
    }
  }

  updateAutoCycleUI(isActive) {
    const btn = document.getElementById('cfgAutoCycleBtn');
    const dot = document.getElementById('cfgAutoCycleDot');
    const text = document.getElementById('cfgAutoCycleText');
    if (!btn || !dot) return;

    if (isActive) {
      btn.classList.add('bg-orange/20', 'border-orange', 'text-orange');
      btn.classList.remove('bg-white/5', 'text-cream/70');
      dot.classList.add('bg-orange', 'animate-ping');
      dot.classList.remove('bg-cream/40');
      if (text) text.textContent = 'STOP';
    } else {
      btn.classList.remove('bg-orange/20', 'border-orange', 'text-orange');
      btn.classList.add('bg-white/5', 'text-cream/70');
      dot.classList.remove('bg-orange', 'animate-ping');
      dot.classList.add('bg-cream/40');
      if (text) text.textContent = 'CYCLE';
    }
  }

  loadPreset(presetId) {
    if (PRESETS[presetId]) {
      const currentSilhouette = this.tokens.silhouette || 'symmetric';
      this.tokens = { ...PRESETS[presetId], silhouette: currentSilhouette };
      this.syncControls();
      this.update();
      if (this.sfx) this.sfx.click();
      this.showToast(`Loaded Preset: ${PRESETS[presetId].name}`);
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

    const sil = this.tokens.silhouette || 'symmetric';
    const polygon = getPolygon(this.tokens.chamfer, sil);
    const btnPolygon = getPolygon(Math.min(8, this.tokens.chamfer), sil);
    const innerPolygon = getPolygon(Math.max(4, this.tokens.chamfer - 4), sil);
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
          ${sil !== 'top-only' ? `
          <span class="bracket bl" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket br" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>` : ''}

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
            <span>SILHOUETTE: ${sil.toUpperCase()}</span>
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
            <span class="text-[9.5px] opacity-50 uppercase font-mono">${sil}</span>
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
            <span class="text-orange/80 font-mono uppercase">SILHOUETTE: ${sil} (${this.tokens.chamfer}px)</span>
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
          ${sil !== 'top-only' ? `
          <span class="bracket bl" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>
          <span class="bracket br" style="color: rgba(255,255,255,0.4); width: ${this.tokens.bracketSize}px; height: ${this.tokens.bracketSize}px"></span>` : ''}

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

    // Re-apply active simulation state
    this.applySimulatedState();
  }

  update() {
    // 1. Update polygon equation readout
    if (this.polygonReadoutEl) {
      const sil = this.tokens.silhouette || 'symmetric';
      const poly = getPolygon(this.tokens.chamfer, sil);
      this.polygonReadoutEl.textContent = `clip-path: ${poly.length > 50 ? poly.slice(0, 50) + '...' : poly}`;
      this.polygonReadoutEl.title = `clip-path: ${poly}`;
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
    if (this.glyphCategoryEl) {
      const meta = ICON_META[this.activeGlyph];
      if (meta && meta.category) {
        this.glyphCategoryEl.textContent = meta.category.toUpperCase();
      }
    }

    // Sync Specimen Tabs
    const specimenTabs = document.querySelectorAll('.cfg-specimen-tab');
    specimenTabs.forEach(tab => {
      if (tab.dataset.specimen === this.activeSpecimen) {
        tab.classList.add('bg-orange', 'text-near', 'font-bold');
        tab.classList.remove('hover:bg-white/10', 'text-cream/70');
      } else {
        tab.classList.remove('bg-orange', 'text-near', 'font-bold');
        tab.classList.add('hover:bg-white/10', 'text-cream/70');
      }
    });

    // Sync Silhouette Buttons
    const silBtns = document.querySelectorAll('.cfg-silhouette-btn');
    silBtns.forEach(btn => {
      if (btn.dataset.silhouette === (this.tokens.silhouette || 'symmetric')) {
        btn.classList.add('border-orange', 'bg-orange/15', 'text-orange', 'font-bold');
        btn.classList.remove('border-white/15', 'bg-black/40', 'text-cream/70');
      } else {
        btn.classList.remove('border-orange', 'bg-orange/15', 'text-orange', 'font-bold');
        btn.classList.add('border-white/15', 'bg-black/40', 'text-cream/70');
      }
    });

    if (this.silhouetteLabelEl && SILHOUETTES[this.tokens.silhouette || 'symmetric']) {
      this.silhouetteLabelEl.textContent = SILHOUETTES[this.tokens.silhouette || 'symmetric'].label;
    }

    // Sync State Simulator Buttons
    const stateBtns = document.querySelectorAll('.cfg-state-btn');
    stateBtns.forEach(btn => {
      if (btn.dataset.state === this.activeState) {
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/70');
      } else {
        btn.classList.remove('bg-orange', 'text-near', 'font-bold');
        btn.classList.add('hover:bg-white/10', 'text-cream/70');
      }
    });

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

    // Silhouette buttons
    const silBtns = document.querySelectorAll('.cfg-silhouette-btn');
    silBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setSilhouette(btn.dataset.silhouette);
      });
    });

    // State simulator buttons
    const stateBtns = document.querySelectorAll('.cfg-state-btn');
    stateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.autoCycleTimer) {
          clearInterval(this.autoCycleTimer);
          this.autoCycleTimer = null;
          this.updateAutoCycleUI(false);
        }
        this.setState(btn.dataset.state);
      });
    });

    // Auto-cycle toggle button
    const autoCycleBtn = document.getElementById('cfgAutoCycleBtn');
    autoCycleBtn?.addEventListener('click', () => {
      this.toggleAutoCycle();
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

    // Save Custom Preset button & Enter key
    const savePresetBtn = document.getElementById('cfgSavePresetBtn');
    const presetNameInput = document.getElementById('cfgPresetNameInput');

    const handleSavePreset = () => {
      const name = presetNameInput?.value?.trim();
      if (name) {
        this.saveCustomPreset(name);
        if (presetNameInput) presetNameInput.value = '';
      } else {
        this.showToast('Please enter a preset name');
      }
    };

    savePresetBtn?.addEventListener('click', handleSavePreset);
    presetNameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSavePreset();
    });

    // Randomize Spec button
    const randomizeBtn = document.getElementById('cfgRandomizeBtn');
    randomizeBtn?.addEventListener('click', () => {
      this.randomizeSpec();
    });

    // Share Spec button
    const shareSpecBtn = document.getElementById('cfgShareSpecBtn');
    shareSpecBtn?.addEventListener('click', () => {
      this.copyShareLink();
    });

    // Listen for external URL hash changes (deep linking navigation)
    window.addEventListener('hashchange', () => {
      if (this.loadFromHash()) {
        this.syncControls();
        this.update();
      }
    });

    // Copy export code button
    const copyBtn = document.getElementById('cfgCopyBtn');
    copyBtn?.addEventListener('click', () => {
      if (this.codeOutputEl) {
        navigator.clipboard?.writeText(this.codeOutputEl.textContent).then(() => {
          if (this.sfx) this.sfx.success();
          this.showToast(`Copied ${this.activeExportTab.toUpperCase()} configuration!`);
        });
      }
    });

    // 1-Click Download Current Spec button (.css / .js / .json / .tsx)
    const downloadSpecBtn = document.getElementById('cfgDownloadSpecBtn');
    downloadSpecBtn?.addEventListener('click', () => {
      this.downloadActiveSpec();
    });

    // 1-Click Download Preset Kit ZIP button
    const downloadZipBtn = document.getElementById('cfgDownloadZipBtn');
    downloadZipBtn?.addEventListener('click', () => {
      this.downloadPresetZip(downloadZipBtn);
    });

    // 1-Click Download Active Preset JSON button
    const downloadActivePresetBtn = document.getElementById('cfgDownloadActivePresetBtn');
    downloadActivePresetBtn?.addEventListener('click', () => {
      this.downloadActivePresetJson();
    });

    // 1-Click Download All Presets JSON button
    const downloadAllPresetsBtn = document.getElementById('cfgDownloadAllPresetsBtn');
    downloadAllPresetsBtn?.addEventListener('click', () => {
      this.downloadAllPresetsJson();
    });

    // Import Presets file input
    const importFileInput = document.getElementById('cfgImportPresetFileInput');
    importFileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        this.importPresetsFromFile(file);
        e.target.value = '';
      }
    });

    this.syncControls();
  }

  downloadActiveSpec() {
    if (!this.codeOutputEl) return;
    const content = this.codeOutputEl.textContent;
    const presetName = (this.tokens.name || 'blueprint').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    let filename = `kinetic-${presetName}-tokens.css`;
    let mime = 'text/css';

    if (this.activeExportTab === 'css') {
      filename = `kinetic-${presetName}-tokens.css`;
      mime = 'text/css';
    } else if (this.activeExportTab === 'tailwind') {
      filename = `tailwind.kinetic-${presetName}.config.js`;
      mime = 'application/javascript';
    } else if (this.activeExportTab === 'json') {
      filename = `kinetic-${presetName}-tokens.json`;
      mime = 'application/json';
    } else if (this.activeExportTab === 'react') {
      filename = 'BlueprintCard.tsx';
      mime = 'text/typescript';
    }

    downloadText(content, filename, mime);
    if (this.sfx) this.sfx.success();
    this.showToast(`Downloaded ${filename}!`);
  }

  downloadActivePresetJson() {
    const presetName = (this.tokens.name || 'custom').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const sil = this.tokens.silhouette || 'symmetric';
    const payload = {
      $schema: 'https://design-tokens.github.io/community-group/format/',
      id: presetName,
      name: this.tokens.name || 'Custom Blueprint Preset',
      timestamp: new Date().toISOString(),
      tokens: { ...this.tokens },
      specimen: this.activeSpecimen,
      glyph: this.activeGlyph,
      polygon: getPolygon(this.tokens.chamfer, sil)
    };
    downloadText(JSON.stringify(payload, null, 2), `kinetic-preset-${presetName}.json`, 'application/json');
    if (this.sfx) this.sfx.success();
    this.showToast(`Downloaded active preset: ${this.tokens.name || 'custom'}!`);
  }

  downloadAllPresetsJson() {
    const custom = this.getCustomPresets();
    const allPresets = {};

    // Standard factory presets
    Object.entries(PRESETS).forEach(([k, v]) => {
      allPresets[k] = {
        ...v,
        tokens: {
          chamfer: v.chamfer,
          accent: v.accent,
          accentHover: v.accentHover,
          surface: v.surface,
          surfaceCard: v.surfaceCard,
          surfaceWell: v.surfaceWell,
          textColor: v.textColor,
          gridSize: v.gridSize,
          gridOpacity: v.gridOpacity,
          strokeWidth: v.strokeWidth,
          bracketSize: v.bracketSize,
          silhouette: 'symmetric'
        },
        polygon: getPolygon(v.chamfer, 'symmetric')
      };
    });

    // Custom user presets
    custom.forEach(cp => {
      const sil = cp.tokens?.silhouette || 'symmetric';
      allPresets[cp.id] = {
        id: cp.id,
        name: cp.name,
        tokens: cp.tokens,
        specimen: cp.specimen,
        glyph: cp.glyph,
        polygon: getPolygon(cp.tokens?.chamfer || 13, sil)
      };
    });

    const payload = {
      $schema: 'https://design-tokens.github.io/community-group/format/',
      version: '1.0.0',
      system: 'Kinetic UI Blueprint Design System',
      description: 'Complete technical preset collection for high-assurance industrial telemetry & aerospace UI',
      exportedAt: new Date().toISOString(),
      totalPresets: Object.keys(allPresets).length,
      presets: allPresets
    };

    downloadText(JSON.stringify(payload, null, 2), 'kinetic-all-presets.json', 'application/json');
    if (this.sfx) this.sfx.success();
    this.showToast(`Downloaded all ${Object.keys(allPresets).length} presets!`);
  }

  async downloadPresetZip(triggerBtn = null) {
    let originalHtml = '';
    if (triggerBtn) {
      originalHtml = triggerBtn.innerHTML;
      triggerBtn.innerHTML = '<span>⏳</span><span>PACKING PRESET...</span>';
      triggerBtn.disabled = true;
    }
    if (this.sfx) this.sfx.telemetry();

    try {
      const zip = new JSZip();
      const presetName = (this.tokens.name || 'custom').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const folder = zip.folder(`kinetic-preset-${presetName}`);

      // 1. CSS variables
      folder.file('tokens.css', exportCSS(this.tokens));

      // 2. Tailwind Config
      folder.file('tailwind.config.js', exportTailwind(this.tokens));

      // 3. DTCG Tokens JSON
      folder.file('tokens.json', exportJSON(this.tokens));

      // 4. React Component
      folder.file('BlueprintCard.tsx', exportReact(this.tokens, this.activeSpecimen, this.activeGlyph));

      // 5. Preset Metadata & Spec
      const sil = this.tokens.silhouette || 'symmetric';
      const meta = {
        preset: this.tokens.name || 'Custom Blueprint Preset',
        id: presetName,
        createdAt: new Date().toISOString(),
        tokens: this.tokens,
        specimen: this.activeSpecimen,
        glyph: this.activeGlyph,
        polygon: getPolygon(this.tokens.chamfer, sil)
      };
      folder.file('preset.json', JSON.stringify(meta, null, 2));

      // 6. README.md
      const readme = `# Kinetic UI — Preset Package: ${this.tokens.name || 'Custom'}

Generated by Kinetic UI Interactive Blueprint Configurator.

## Contents
- \`tokens.css\`: CSS custom properties for 8-point chamfer geometry & color palette.
- \`tailwind.config.js\`: Tailwind extension for clip-paths and tactical colors.
- \`tokens.json\`: W3C DTCG standard design tokens format.
- \`BlueprintCard.tsx\`: Ready-to-use React / TSX component.
- \`preset.json\`: Raw token metadata.

## Quick Start
Drop \`tokens.css\` into your project entry and import \`BlueprintCard.tsx\`.

MIT License — Kinetic UI (https://github.com/SalAkBuK/kinetic-ui)
`;
      folder.file('README.md', readme);

      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, `kinetic-preset-${presetName}.zip`);

      if (this.sfx) this.sfx.success();
      this.showToast(`1-Click Preset ZIP downloaded!`);
    } catch (err) {
      console.error('Failed to generate preset ZIP:', err);
      this.showToast('Error generating ZIP archive');
    } finally {
      if (triggerBtn) {
        triggerBtn.innerHTML = originalHtml;
        triggerBtn.disabled = false;
      }
    }
  }

  importPresetsFromFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.presets && typeof data.presets === 'object') {
          const custom = this.getCustomPresets();
          let count = 0;
          Object.values(data.presets).forEach(p => {
            if (p.name && (p.chamfer || p.tokens)) {
              count++;
              custom.push({
                id: 'custom-' + Date.now() + '-' + count,
                name: p.name,
                tokens: p.tokens || {
                  chamfer: p.chamfer || 13,
                  accent: p.accent || '#f4551d',
                  accentHover: p.accentHover || '#ea4f1a',
                  surface: p.surface || '#2b2b29',
                  surfaceCard: p.surfaceCard || '#33332f',
                  surfaceWell: p.surfaceWell || '#e2dac9',
                  textColor: p.textColor || '#e9e2d3',
                  gridSize: p.gridSize || 84,
                  strokeWidth: p.strokeWidth || 1.35,
                  bracketSize: p.bracketSize || 13,
                  silhouette: p.silhouette || 'symmetric'
                },
                specimen: p.specimen || 'card',
                glyph: p.glyph || 'cluster'
              });
            }
          });
          this.saveCustomPresets(custom);
          this.renderCustomPresets();
          if (this.sfx) this.sfx.success();
          this.showToast(`Imported ${count} presets successfully!`);
        } else if (data.name && (data.tokens || data.chamfer)) {
          const custom = this.getCustomPresets();
          const newP = {
            id: 'custom-' + Date.now(),
            name: data.name,
            tokens: data.tokens || {
              chamfer: data.chamfer || 13,
              accent: data.accent || '#f4551d',
              accentHover: data.accentHover || '#ea4f1a',
              surface: data.surface || '#2b2b29',
              surfaceCard: data.surfaceCard || '#33332f',
              surfaceWell: data.surfaceWell || '#e2dac9',
              textColor: data.textColor || '#e9e2d3',
              gridSize: data.gridSize || 84,
              strokeWidth: data.strokeWidth || 1.35,
              bracketSize: data.bracketSize || 13,
              silhouette: data.silhouette || 'symmetric'
            },
            specimen: data.specimen || 'card',
            glyph: data.glyph || 'cluster'
          };
          custom.push(newP);
          this.saveCustomPresets(custom);
          this.renderCustomPresets();
          this.loadCustomPreset(newP.id);
          if (this.sfx) this.sfx.success();
          this.showToast(`Imported & applied preset: "${data.name}"!`);
        } else {
          this.showToast('Invalid preset JSON format');
        }
      } catch (err) {
        console.error('Error reading preset file:', err);
        this.showToast('Could not parse JSON preset');
      }
    };
    reader.readAsText(file);
  }
}

export function initConfigurator(options = {}) {
  return new BlueprintConfigurator(options);
}
