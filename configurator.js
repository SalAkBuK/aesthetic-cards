/**
 * Blueprint Design System Token Configurator Engine
 * Generates dynamic 8-point chamfer polygon clip-paths, live CSS variable bindings,
 * and multi-format design token export (CSS, Tailwind, DTCG JSON).
 */

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

export class BlueprintConfigurator {
  constructor(options = {}) {
    this.tokens = { ...PRESETS.industrial };
    this.applyGlobally = false;
    this.activeExportTab = 'css';
    this.sfx = options.sfx || (typeof window !== 'undefined' ? window.sfx : null);

    this.specimenEl = document.getElementById(options.specimenId || 'configSpecimen');
    this.codeOutputEl = document.getElementById(options.codeOutputId || 'configCodeOutput');
    this.polygonReadoutEl = document.getElementById(options.polygonReadoutId || 'configPolygonReadout');

    this.initControls();
    this.update();
  }

  setToken(key, value) {
    this.tokens[key] = value;
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
  }

  resetDocument() {
    const root = document.documentElement;
    root.style.removeProperty('--c');
    root.style.removeProperty('--orange');
    root.style.removeProperty('--orange-hover');
  }

  update() {
    const polygon = getPolygon(this.tokens.chamfer);

    // 1. Update polygon equation readout
    if (this.polygonReadoutEl) {
      this.polygonReadoutEl.textContent = `clip-path: polygon(${this.tokens.chamfer}px 0, calc(100% - ${this.tokens.chamfer}px) 0...)`;
    }

    // 2. Update Specimen Sandbox Card
    if (this.specimenEl) {
      this.specimenEl.style.setProperty('--c', `${this.tokens.chamfer}px`);
      this.specimenEl.style.setProperty('--accent', this.tokens.accent);
      this.specimenEl.style.clipPath = polygon;
      this.specimenEl.style.backgroundColor = this.tokens.surfaceCard;
      this.specimenEl.style.color = this.tokens.textColor;

      // Update inner media well and brackets
      const media = this.specimenEl.querySelector('.specimen-media');
      if (media) {
        media.style.clipPath = getPolygon(Math.max(4, this.tokens.chamfer - 4));
        media.style.backgroundColor = this.tokens.surfaceWell;
      }

      // Update corner brackets size
      const brackets = this.specimenEl.querySelectorAll('.bracket');
      brackets.forEach(b => {
        b.style.width = `${this.tokens.bracketSize}px`;
        b.style.height = `${this.tokens.bracketSize}px`;
      });

      // Update dynamic vector stroke
      const vectors = this.specimenEl.querySelectorAll('.specimen-vector');
      vectors.forEach(v => {
        v.style.stroke = this.tokens.accent;
        v.style.strokeWidth = `${this.tokens.strokeWidth}px`;
      });

      // Update button & badge accents
      const btn = this.specimenEl.querySelector('.specimen-btn');
      if (btn) {
        btn.style.backgroundColor = this.tokens.accent;
        btn.style.clipPath = getPolygon(Math.min(8, this.tokens.chamfer));
      }

      const badge = this.specimenEl.querySelector('.specimen-badge');
      if (badge) {
        badge.style.borderColor = `${this.tokens.accent}80`;
        badge.style.color = this.tokens.accent;
      }
    }

    // 3. Update Code Output
    if (this.codeOutputEl) {
      if (this.activeExportTab === 'css') {
        this.codeOutputEl.textContent = exportCSS(this.tokens);
      } else if (this.activeExportTab === 'tailwind') {
        this.codeOutputEl.textContent = exportTailwind(this.tokens);
      } else if (this.activeExportTab === 'json') {
        this.codeOutputEl.textContent = exportJSON(this.tokens);
      }
    }

    // 4. Update Document if global apply is ON
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
  }

  initControls() {
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
        if (this.sfx) this.sfx.click();
      });
    });

    // Native color picker
    const colorPicker = document.getElementById('cfgColorPicker');
    colorPicker?.addEventListener('input', (e) => {
      this.setToken('accent', e.target.value);
      this.setToken('accentHover', e.target.value);
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
