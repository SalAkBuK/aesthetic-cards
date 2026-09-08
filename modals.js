/**
 * Specialized Industrial Modals, Global Command Palette & Telemetry Drawer Engine
 * Provides keyboard-driven command discovery, two-phase safety confirmation latches,
 * and slide-out telemetry drawer with procedural Web Audio API micro-haptics.
 */

export const COMMANDS = [
  // Navigation
  { id: 'nav-hero', category: 'NAVIGATION', label: 'Go to Hero & 3D Sensor Monitor', shortcut: 'G H', action: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-buttons', category: 'NAVIGATION', label: 'Section 01 // Buttons & Action Triggers', shortcut: '01', action: () => document.getElementById('buttons')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-cards', category: 'NAVIGATION', label: 'Section 02 // Chamfered Feature Cards', shortcut: '02', action: () => document.getElementById('cards')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-icons', category: 'NAVIGATION', label: 'Section 06 // Blueprint SVG Icon Library (32)', shortcut: '06', action: () => document.getElementById('icons')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-osc', category: 'NAVIGATION', label: 'Section 05 // Audio Oscilloscope & Spectrogram', shortcut: '05', action: () => document.getElementById('oscilloscope')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-cfg', category: 'NAVIGATION', label: 'Section 07 // Blueprint Configurator Studio', shortcut: '07', action: () => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-table', category: 'NAVIGATION', label: 'Section 08 // High-Density Telemetry Table', shortcut: '08', action: () => document.getElementById('telemetry')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-forms', category: 'NAVIGATION', label: 'Section 09 // Technical Forms & Parameter Rack', shortcut: '09', action: () => document.getElementById('forms')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-modals', category: 'NAVIGATION', label: 'Section 10 // Industrial Modals & Overlays', shortcut: '10', action: () => document.getElementById('modals')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-visualizations', category: 'NAVIGATION', label: 'Section 11 // Kinetic Visualizations & Telemetry Charts', shortcut: '11', action: () => document.getElementById('visualizations')?.scrollIntoView({ behavior: 'smooth' }) },

  // Actions
  { id: 'act-sfx', category: 'ACTIONS', label: 'Toggle Mechanical Audio Micro-Haptics', shortcut: 'S', action: (ctx) => { ctx.sfx?.toggle(); } },
  { id: 'act-safety', category: 'ACTIONS', label: 'Open Two-Phase Safety Confirmation Latch', shortcut: '⇧ D', action: (ctx) => { ctx.safetyLatch?.open({ title: 'EMERGENCY CLUSTER DRAIN', targetName: 'US-EAST-01', actionCode: 'DRAIN_CLUSTER' }); } },
  { id: 'act-drawer', category: 'ACTIONS', label: 'Toggle Full-Height Telemetry Drawer', shortcut: 'T', action: (ctx) => { ctx.telemetryDrawer?.toggle(); } },
  { id: 'act-csv', category: 'ACTIONS', label: 'Export Telemetry Table to CSV', shortcut: 'E', action: () => document.getElementById('batchExportBtn')?.click() },
  { id: 'act-download-tokens', category: 'ACTIONS', label: 'Download tokens.css Design System', shortcut: 'D', action: () => { const a = document.createElement('a'); a.href = './tokens.css'; a.download = 'tokens.css'; a.click(); } },

  // Presets
  { id: 'pre-ent', category: 'PRESETS', label: 'Apply Preset: 01 Production Enterprise', shortcut: 'P 1', action: () => document.querySelector('[data-param-preset="enterprise"]')?.click() },
  { id: 'pre-edge', category: 'PRESETS', label: 'Apply Preset: 02 Low-Latency Edge', shortcut: 'P 2', action: () => document.querySelector('[data-param-preset="edge"]')?.click() },
  { id: 'pre-sand', category: 'PRESETS', label: 'Apply Preset: 03 Debug / Sandbox', shortcut: 'P 3', action: () => document.querySelector('[data-param-preset="sandbox"]')?.click() }
];

export class CommandPalette {
  constructor(options = {}) {
    this.commands = options.commands || COMMANDS;
    this.sfx = options.sfx || null;
    this.ctx = options.context || {};
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredCommands = [...this.commands];

    this.overlayEl = document.getElementById(options.overlayId || 'commandPaletteOverlay');
    this.inputEl = document.getElementById(options.inputId || 'commandPaletteInput');
    this.listEl = document.getElementById(options.listId || 'commandPaletteList');
    this.statusCountEl = document.getElementById(options.countId || 'commandPaletteCount');

    this.init();
  }

  init() {
    // Global Keyboard Listener: Cmd+K / Ctrl+K & Escape
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelected();
        }
      }
    });

    // Close on overlay backdrop click
    this.overlayEl?.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) {
        this.close();
      }
    });

    // Search filter input
    this.inputEl?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      this.filter(q);
    });

    // Trigger buttons on page (e.g. Header Cmd+K trigger)
    document.querySelectorAll('[data-open-palette]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });
  }

  open() {
    if (this.isOpen || !this.overlayEl) return;
    this.isOpen = true;
    this.overlayEl.classList.remove('hidden');
    if (this.inputEl) {
      this.inputEl.value = '';
      this.inputEl.focus();
    }
    this.filter('');
    if (this.sfx) this.sfx.modalOpen();
  }

  close() {
    if (!this.isOpen || !this.overlayEl) return;
    this.isOpen = false;
    this.overlayEl.classList.add('hidden');
    if (this.sfx) this.sfx.modalClose();
  }

  toggle() {
    if (this.isOpen) this.close(); else this.open();
  }

  filter(query) {
    if (!query) {
      this.filteredCommands = [...this.commands];
    } else {
      this.filteredCommands = this.commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query) ||
        (cmd.shortcut && cmd.shortcut.toLowerCase().includes(query))
      );
    }
    this.selectedIndex = 0;
    this.render();
  }

  moveSelection(dir) {
    if (this.filteredCommands.length === 0) return;
    this.selectedIndex = (this.selectedIndex + dir + this.filteredCommands.length) % this.filteredCommands.length;
    if (this.sfx) this.sfx.tick();
    this.updateSelectionUI();
  }

  updateSelectionUI() {
    const items = this.listEl?.querySelectorAll('.command-item');
    items?.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  executeSelected() {
    const cmd = this.filteredCommands[this.selectedIndex];
    if (!cmd) return;
    if (this.sfx) this.sfx.click();
    this.close();
    cmd.action(this.ctx);
  }

  render() {
    if (!this.listEl) return;
    if (this.statusCountEl) {
      this.statusCountEl.textContent = `${this.filteredCommands.length} COMMANDS AVAILABLE`;
    }

    if (this.filteredCommands.length === 0) {
      this.listEl.innerHTML = `
        <div class="py-8 text-center text-cream/40 font-mono text-xs">
          NO MATCHING INSTRUCTIONS FOUND
        </div>
      `;
      return;
    }

    // Group by category
    let html = '';
    let currentCat = '';

    this.filteredCommands.forEach((cmd, idx) => {
      if (cmd.category !== currentCat) {
        currentCat = cmd.category;
        html += `
          <div class="px-3 pt-2.5 pb-1 text-[9.5px] uppercase font-bold tracking-widest text-cream/40 select-none">
            ${currentCat}
          </div>
        `;
      }

      const isSel = idx === this.selectedIndex;
      html += `
        <div class="command-item flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono select-none ${isSel ? 'is-selected' : ''}" data-cmd-idx="${idx}">
          <div class="flex items-center gap-2.5">
            <span class="text-orange text-[11px] select-none">❖</span>
            <span class="text-cream font-medium">${cmd.label}</span>
          </div>
          ${cmd.shortcut ? `
            <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-cream/60 border border-white/10 font-mono">${cmd.shortcut}</kbd>
          ` : ''}
        </div>
      `;
    });

    this.listEl.innerHTML = html;

    // Wire mouse clicks & hover
    this.listEl.querySelectorAll('.command-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = parseInt(item.dataset.cmdIdx, 10);
        this.updateSelectionUI();
      });
      item.addEventListener('click', () => {
        this.selectedIndex = parseInt(item.dataset.cmdIdx, 10);
        this.executeSelected();
      });
    });
  }
}

export class SafetyLatchModal {
  constructor(options = {}) {
    this.sfx = options.sfx || null;
    this.isOpen = false;
    this.isArmed = false;
    this.requiredToken = 'CONFIRM OVERRIDE';
    this.onConfirmCallback = null;

    this.overlayEl = document.getElementById(options.overlayId || 'safetyLatchOverlay');
    this.titleEl = document.getElementById(options.titleId || 'safetyLatchTitle');
    this.targetEl = document.getElementById(options.targetId || 'safetyLatchTarget');
    this.switchEl = document.getElementById(options.switchId || 'safetyLatchArmSwitch');
    this.barrierEl = document.getElementById(options.barrierId || 'safetyLatchBarrier');
    this.inputEl = document.getElementById(options.inputId || 'safetyLatchTokenInput');
    this.confirmBtn = document.getElementById(options.confirmBtnId || 'safetyLatchConfirmBtn');
    this.cancelBtn = document.getElementById(options.cancelBtnId || 'safetyLatchCancelBtn');
    this.tokenPromptEl = document.getElementById(options.tokenPromptId || 'safetyLatchTokenPrompt');

    this.init();
  }

  init() {
    this.cancelBtn?.addEventListener('click', () => this.close());
    this.overlayEl?.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) this.close();
    });

    // Arming Toggle Switch
    this.switchEl?.addEventListener('change', (e) => {
      this.isArmed = e.target.checked;
      if (this.isArmed) {
        if (this.sfx) this.sfx.telemetry();
        this.barrierEl?.classList.add('opacity-0', 'pointer-events-none');
        this.inputEl?.removeAttribute('disabled');
        this.inputEl?.focus();
      } else {
        if (this.sfx) this.sfx.click();
        this.barrierEl?.classList.remove('opacity-0', 'pointer-events-none');
        this.inputEl?.setAttribute('disabled', 'true');
      }
      this.validate();
    });

    // Input token check
    this.inputEl?.addEventListener('input', () => {
      this.validate();
    });

    // Confirm execution
    this.confirmBtn?.addEventListener('click', () => {
      if (!this.canExecute()) return;
      if (this.sfx) this.sfx.click();
      const cb = this.onConfirmCallback;
      this.close();
      if (cb) cb();
      this.showToast('Destructive operation executed successfully');
    });

    // Trigger buttons on page
    document.querySelectorAll('[data-open-safety-latch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.safetyTitle || 'TERMINATE ISOLATED CLUSTER';
        const target = btn.dataset.safetyTarget || 'CLUSTER-IAD-PROD-01';
        this.open({ title, targetName: target });
      });
    });
  }

  open(config = {}) {
    if (!this.overlayEl) return;
    this.isOpen = true;
    this.isArmed = false;
    this.onConfirmCallback = config.onConfirm || null;
    this.requiredToken = config.token || 'CONFIRM OVERRIDE';

    if (this.titleEl) this.titleEl.textContent = config.title || 'HAZARD SAFETY INTERLOCK';
    if (this.targetEl) this.targetEl.textContent = config.targetName || 'TARGET SYSTEM';
    if (this.tokenPromptEl) this.tokenPromptEl.textContent = `Type "${this.requiredToken}" below to verify manual override`;

    if (this.switchEl) this.switchEl.checked = false;
    if (this.inputEl) {
      this.inputEl.value = '';
      this.inputEl.setAttribute('disabled', 'true');
    }
    this.barrierEl?.classList.remove('opacity-0', 'pointer-events-none');
    this.validate();

    this.overlayEl.classList.remove('hidden');
    if (this.sfx) this.sfx.modalOpen();
  }

  close() {
    if (!this.isOpen || !this.overlayEl) return;
    this.isOpen = false;
    this.overlayEl.classList.add('hidden');
    if (this.sfx) this.sfx.modalClose();
  }

  validate() {
    const inputVal = (this.inputEl?.value || '').trim();
    const matches = inputVal === this.requiredToken;
    const ready = this.isArmed && matches;

    if (this.confirmBtn) {
      if (ready) {
        this.confirmBtn.removeAttribute('disabled');
        this.confirmBtn.classList.remove('opacity-40', 'cursor-not-allowed');
        this.confirmBtn.classList.add('bg-ruby', 'text-white', 'shadow-lg', 'shadow-ruby/30');
      } else {
        this.confirmBtn.setAttribute('disabled', 'true');
        this.confirmBtn.classList.add('opacity-40', 'cursor-not-allowed');
        this.confirmBtn.classList.remove('bg-ruby', 'text-white', 'shadow-lg', 'shadow-ruby/30');
      }
    }
  }

  canExecute() {
    return this.isArmed && (this.inputEl?.value || '').trim() === this.requiredToken;
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2200);
    }
  }
}

export class TelemetryDrawer {
  constructor(options = {}) {
    this.sfx = options.sfx || null;
    this.isOpen = false;
    this.logInterval = null;

    this.overlayEl = document.getElementById(options.overlayId || 'telemetryDrawerOverlay');
    this.panelEl = document.getElementById(options.panelId || 'telemetryDrawerPanel');
    this.closeBtn = document.getElementById(options.closeBtnId || 'telemetryDrawerCloseBtn');
    this.logContainerEl = document.getElementById(options.logContainerId || 'drawerLogContainer');

    this.init();
  }

  init() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlayEl?.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) this.close();
    });

    document.querySelectorAll('[data-open-drawer]').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
  }

  open() {
    if (this.isOpen || !this.panelEl) return;
    this.isOpen = true;
    this.overlayEl?.classList.remove('hidden');
    // Animate slide-in
    setTimeout(() => {
      this.panelEl?.classList.remove('translate-x-full');
    }, 10);

    if (this.sfx) this.sfx.modalOpen();
    this.startLiveLogs();
  }

  close() {
    if (!this.isOpen || !this.panelEl) return;
    this.isOpen = false;
    this.panelEl.classList.add('translate-x-full');
    setTimeout(() => {
      this.overlayEl?.classList.add('hidden');
    }, 280);

    if (this.sfx) this.sfx.modalClose();
    this.stopLiveLogs();
  }

  toggle() {
    if (this.isOpen) this.close(); else this.open();
  }

  startLiveLogs() {
    this.stopLiveLogs();
    if (!this.logContainerEl) return;

    const MOCK_EVENTS = [
      { level: 'INF', source: 'mesh.routing', msg: 'Ingress node-iad-01 routed 1,420 ops (p99 0.38ms)' },
      { level: 'OK ', source: 'zk.verifier', msg: 'STARK receipt 0x88ab...3c12 successfully validated' },
      { level: 'WRN', source: 'traffic.guard', msg: 'Node-iad-02 traffic throttled by rate ceiling' },
      { level: 'INF', source: 'tls.cipher', msg: 'Handshake completed with ChaCha20-Poly1305' },
      { level: 'INF', source: 'isolate.v8', msg: 'Garbage collection finished in 0.08ms' },
      { level: 'OK ', source: 'consensus', msg: 'BFT epoch #84920 synchronized with 6/6 quorum' }
    ];

    this.logInterval = setInterval(() => {
      if (!this.isOpen) return;
      const ev = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      const now = new Date().toISOString().substring(11, 19);
      const color = ev.level === 'OK ' ? 'text-emerald-400' : ev.level === 'WRN' ? 'text-amber-400' : 'text-cream/70';

      const line = document.createElement('div');
      line.className = 'flex items-center gap-2 text-[10px] font-mono leading-tight';
      line.innerHTML = `
        <span class="text-cream/40">${now}</span>
        <span class="font-bold ${color}">[${ev.level}]</span>
        <span class="text-orange/80">${ev.source}:</span>
        <span class="text-cream/90 truncate">${ev.msg}</span>
      `;
      this.logContainerEl.appendChild(line);
      if (this.logContainerEl.children.length > 25) {
        this.logContainerEl.removeChild(this.logContainerEl.children[0]);
      }
      this.logContainerEl.scrollTop = this.logContainerEl.scrollHeight;
    }, 1800);
  }

  stopLiveLogs() {
    if (this.logInterval) {
      clearInterval(this.logInterval);
      this.logInterval = null;
    }
  }
}

export function initIndustrialModals(options = {}) {
  const sfx = options.sfx || (typeof window !== 'undefined' ? window.sfx : null);

  const safetyLatch = new SafetyLatchModal({ sfx });
  const telemetryDrawer = new TelemetryDrawer({ sfx });
  const commandPalette = new CommandPalette({
    sfx,
    context: { sfx, safetyLatch, telemetryDrawer }
  });

  return { commandPalette, safetyLatch, telemetryDrawer };
}
