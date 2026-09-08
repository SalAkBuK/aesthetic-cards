/**
 * Global Theme Matrix & Phosphor CRT Display Engine (Option 2)
 * Provides system-wide multi-palette switching across 6 industrial color spaces
 * and authentic CRT cathode-ray scanlines, curvature, and phosphor text bloom.
 */

export const THEMES = {
  orange: {
    id: 'orange',
    name: 'Kinetic Orange',
    hex: '#f4551d',
    hoverHex: '#ea4f1a',
    rgb: '244 85 29',
    tag: 'AEROSPACE',
    glow: 'rgba(244, 85, 29, 0.45)',
    description: 'Default high-contrast aerospace telemetry'
  },
  amber: {
    id: 'amber',
    name: 'Synth Amber',
    hex: '#f59e0b',
    hoverHex: '#d97706',
    rgb: '245 158 11',
    tag: 'CATHODE CRT',
    glow: 'rgba(245, 158, 11, 0.45)',
    description: 'Vintage warm amber monochrome phosphor terminal'
  },
  cyan: {
    id: 'cyan',
    name: 'Quantum Cyan',
    hex: '#06b6d4',
    hoverHex: '#0891b2',
    rgb: '6 182 212',
    tag: 'AVIONICS',
    glow: 'rgba(6, 182, 212, 0.45)',
    description: 'Clean-room aerospace & satellite diagnostics'
  },
  emerald: {
    id: 'emerald',
    name: 'Radar Emerald',
    hex: '#10b981',
    hoverHex: '#059669',
    rgb: '16 185 129',
    tag: 'SONAR NIGHT',
    glow: 'rgba(16, 185, 129, 0.45)',
    description: 'Submarine sonar & military night-vision HUD'
  },
  ruby: {
    id: 'ruby',
    name: 'Alarm Ruby',
    hex: '#ef4444',
    hoverHex: '#dc2626',
    rgb: '239 68 68',
    tag: 'CRITICAL',
    glow: 'rgba(239, 68, 68, 0.45)',
    description: 'Emergency fault lockdown & radiation telemetry'
  },
  titanium: {
    id: 'titanium',
    name: 'Monochrome Titanium',
    hex: '#e5e5e5',
    hoverHex: '#d4d4d4',
    rgb: '229 229 229',
    tag: 'BRAUN / RAMS',
    glow: 'rgba(229, 229, 229, 0.35)',
    description: 'Minimalist Dieter Rams industrial functionalism'
  }
};

export class ThemeEngine {
  constructor(options = {}) {
    this.sfx = options.sfx || null;
    this.currentThemeId = localStorage.getItem('aesthetic_theme') || 'orange';
    this.crtActive = localStorage.getItem('aesthetic_crt') === 'true';

    this.themeMenuBtn = document.getElementById('themeMenuBtn');
    this.themeDropdown = document.getElementById('themeDropdown');
    this.activeSwatch = document.getElementById('themeActiveSwatch');
    this.activeLabel = document.getElementById('themeActiveLabel');
    this.crtToggleBtn = document.getElementById('crtToggle');
    this.crtDot = document.getElementById('crtDot');
    this.crtLabel = document.getElementById('crtLabel');

    this.init();
  }

  init() {
    this.renderDropdown();
    this.bindEvents();

    // Hydrate saved state
    this.setTheme(this.currentThemeId, true);
    this.applyCRT(true);
  }

  setTheme(themeId, silent = false) {
    const theme = THEMES[themeId] || THEMES.orange;
    this.currentThemeId = theme.id;
    localStorage.setItem('aesthetic_theme', theme.id);

    // Set data-theme on root & body
    document.documentElement.setAttribute('data-theme', theme.id);
    document.body.setAttribute('data-theme', theme.id);

    // Set inline CSS variables for instant propagation
    document.documentElement.style.setProperty('--orange', theme.hex);
    document.documentElement.style.setProperty('--orange-hover', theme.hoverHex);
    document.documentElement.style.setProperty('--orange-rgb', theme.rgb);
    document.documentElement.style.setProperty('--theme-glow', theme.glow);

    // Update UI Swatch and Label
    if (this.activeSwatch) {
      this.activeSwatch.style.backgroundColor = theme.hex;
      this.activeSwatch.style.boxShadow = `0 0 8px ${theme.hex}`;
    }
    if (this.activeLabel) {
      this.activeLabel.textContent = theme.name.split(' ')[1]?.toUpperCase() || theme.id.toUpperCase();
    }

    // Update checkmarks in dropdown
    if (this.themeDropdown) {
      this.themeDropdown.querySelectorAll('.theme-option').forEach(opt => {
        const check = opt.querySelector('.theme-check');
        if (opt.dataset.themeId === theme.id) {
          opt.classList.add('bg-white/10', 'text-white');
          if (check) check.classList.remove('hidden');
        } else {
          opt.classList.remove('bg-white/10', 'text-white');
          if (check) check.classList.add('hidden');
        }
      });
    }

    // Play micro-haptics audio
    if (!silent && this.sfx) {
      this.sfx.tick();
    }

    // Dispatch global custom event for dynamic canvas redrawing
    window.dispatchEvent(new CustomEvent('aesthetic:themechange', {
      detail: { themeId: theme.id, theme }
    }));
  }

  getTheme() {
    return THEMES[this.currentThemeId] || THEMES.orange;
  }

  toggleCRT(silent = false) {
    this.crtActive = !this.crtActive;
    localStorage.setItem('aesthetic_crt', this.crtActive ? 'true' : 'false');
    this.applyCRT(silent);
    return this.crtActive;
  }

  setCRT(state, silent = false) {
    this.crtActive = Boolean(state);
    localStorage.setItem('aesthetic_crt', this.crtActive ? 'true' : 'false');
    this.applyCRT(silent);
  }

  applyCRT(silent = false) {
    if (this.crtActive) {
      document.body.classList.add('crt-active');
      if (this.crtToggleBtn) {
        this.crtToggleBtn.classList.add('crt-enabled');
        this.crtToggleBtn.classList.remove('crt-muted');
      }
      if (this.crtDot) {
        this.crtDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
        this.crtDot.style.boxShadow = '0 0 6px #10b981';
      }
      if (this.crtLabel) {
        this.crtLabel.textContent = 'CRT: ON';
        this.crtLabel.className = 'text-[10px] font-mono text-emerald-400 font-bold';
      }
    } else {
      document.body.classList.remove('crt-active');
      if (this.crtToggleBtn) {
        this.crtToggleBtn.classList.remove('crt-enabled');
        this.crtToggleBtn.classList.add('crt-muted');
      }
      if (this.crtDot) {
        this.crtDot.className = 'w-2 h-2 rounded-full bg-cream/30';
        this.crtDot.style.boxShadow = 'none';
      }
      if (this.crtLabel) {
        this.crtLabel.textContent = 'CRT: OFF';
        this.crtLabel.className = 'text-[10px] font-mono text-cream/50';
      }
    }

    if (!silent && this.sfx) {
      this.sfx.click();
    }
  }

  renderDropdown() {
    if (!this.themeDropdown) return;
    this.themeDropdown.innerHTML = Object.values(THEMES).map(t => {
      const isSelected = t.id === this.currentThemeId;
      return `
        <button 
          class="theme-option w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/10 text-cream/70 hover:text-white transition cursor-pointer text-left ${isSelected ? 'bg-white/10 text-white' : ''}" 
          data-theme-id="${t.id}"
        >
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${t.hex}; box-shadow: 0 0 6px ${t.hex};"></span>
            <div class="flex flex-col">
              <span class="text-[11px] font-semibold text-cream">${t.name}</span>
              <span class="text-[8.5px] text-cream/40 font-mono">${t.tag}</span>
            </div>
          </div>
          <span class="theme-check text-xs font-bold ${isSelected ? '' : 'hidden'}" style="color: ${t.hex};">✓</span>
        </button>
      `;
    }).join('');
  }

  bindEvents() {
    // CRT toggle click
    this.crtToggleBtn?.addEventListener('click', () => {
      this.toggleCRT();
    });

    // Theme dropdown toggle
    this.themeMenuBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.sfx) this.sfx.tick();
      this.themeDropdown?.classList.toggle('hidden');
    });

    // Theme options in dropdown
    this.themeDropdown?.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-option');
      if (!btn) return;
      const themeId = btn.dataset.themeId;
      if (themeId) {
        this.setTheme(themeId);
        this.themeDropdown?.classList.add('hidden');
      }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!this.themeDropdown?.classList.contains('hidden') && !e.target.closest('#themeSelectorContainer')) {
        this.themeDropdown?.classList.add('hidden');
      }
    });

    // Close dropdown on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.themeDropdown?.classList.contains('hidden')) {
        this.themeDropdown?.classList.add('hidden');
      }
    });
  }
}

/**
 * Main Theme Engine Initializer
 */
let globalThemeEngine = null;

export function initThemeEngine(options = {}) {
  if (!globalThemeEngine) {
    globalThemeEngine = new ThemeEngine(options);
  }
  return globalThemeEngine;
}

