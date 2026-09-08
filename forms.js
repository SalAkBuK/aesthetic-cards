/**
 * Technical Forms & Hardware Parameter Rack Engine
 * Provides key-value config management, numeric steppers, multi-state switches,
 * dual/precision sliders, and real-time ENV/YAML generation with audio micro-haptics.
 */

export const DEFAULT_PARAMETERS = {
  clusterProfile: 'enterprise', // 'edge', 'enterprise', 'sandbox'
  failoverMode: 'hot', // 'cold', 'warm', 'hot'
  isolationEngine: 'wasm', // 'v8', 'wasm', 'container'
  routingStrategy: 'anycast', // 'anycast', 'rr', 'geo'
  workerThreads: 8,
  batchWindowMs: 64,
  rateLimitMin: 25, // k ops/s
  rateLimitMax: 120, // k ops/s
  enableZeroKnowledge: true,
  strictTls: true,
  telemetryStream: true,
  envPairs: [
    { id: 'p1', key: 'KINETIC_CLUSTER_ID', value: 'us-east-cluster-09', type: 'string', secret: false },
    { id: 'p2', key: 'GRPC_MAX_CONCURRENT_STREAMS', value: '8192', type: 'number', secret: false },
    { id: 'p3', key: 'ZK_STARK_VERIFIER_KEY', value: '0x99fe4b21840294827', type: 'secret', secret: true },
    { id: 'p4', key: 'ENFORCE_TWO_PHASE_COMMIT', value: 'true', type: 'boolean', secret: false }
  ]
};

export const PRESETS = {
  enterprise: {
    clusterProfile: 'enterprise',
    failoverMode: 'hot',
    isolationEngine: 'wasm',
    routingStrategy: 'geo',
    workerThreads: 16,
    batchWindowMs: 32,
    rateLimitMin: 40,
    rateLimitMax: 150,
    enableZeroKnowledge: true,
    strictTls: true,
    telemetryStream: true,
    envPairs: [
      { id: 'p1', key: 'KINETIC_CLUSTER_ID', value: 'iad-enterprise-prod-01', type: 'string', secret: false },
      { id: 'p2', key: 'GRPC_MAX_CONCURRENT_STREAMS', value: '16384', type: 'number', secret: false },
      { id: 'p3', key: 'ZK_STARK_VERIFIER_KEY', value: '0x8849bca00192847291a', type: 'secret', secret: true },
      { id: 'p4', key: 'SLA_GUARANTEE_TIER', value: 'MISSION_CRITICAL', type: 'string', secret: false }
    ]
  },
  edge: {
    clusterProfile: 'edge',
    failoverMode: 'warm',
    isolationEngine: 'v8',
    routingStrategy: 'anycast',
    workerThreads: 4,
    batchWindowMs: 16,
    rateLimitMin: 15,
    rateLimitMax: 80,
    enableZeroKnowledge: true,
    strictTls: true,
    telemetryStream: true,
    envPairs: [
      { id: 'p1', key: 'KINETIC_EDGE_NODE', value: 'fra-worker-edge-03', type: 'string', secret: false },
      { id: 'p2', key: 'MAX_MEMORY_PER_ISOLATE_MB', value: '128', type: 'number', secret: false },
      { id: 'p3', key: 'ANYCAST_HOP_LIMIT', value: '4', type: 'number', secret: false }
    ]
  },
  sandbox: {
    clusterProfile: 'sandbox',
    failoverMode: 'cold',
    isolationEngine: 'container',
    routingStrategy: 'rr',
    workerThreads: 2,
    batchWindowMs: 128,
    rateLimitMin: 5,
    rateLimitMax: 30,
    enableZeroKnowledge: false,
    strictTls: false,
    telemetryStream: true,
    envPairs: [
      { id: 'p1', key: 'DEBUG_VERBOSE', value: '1', type: 'number', secret: false },
      { id: 'p2', key: 'LOCAL_MOCK_GATEWAY', value: 'http://127.0.0.1:9090', type: 'string', secret: false }
    ]
  }
};

export class ParameterRack {
  constructor(options = {}) {
    this.state = JSON.parse(JSON.stringify(DEFAULT_PARAMETERS));
    this.sfx = options.sfx || (typeof window !== 'undefined' ? window.sfx : null);
    this.activeExportFormat = 'env';
    this.revealedSecrets = new Set();

    this.containerEl = document.getElementById(options.containerId || 'paramRackContainer');
    this.envPairsEl = document.getElementById(options.envPairsListId || 'paramEnvPairsList');
    this.codeOutputEl = document.getElementById(options.codeOutputId || 'paramCodeOutput');
    this.exportFormatLabelEl = document.getElementById(options.formatLabelId || 'paramFormatLabel');

    this.init();
  }

  init() {
    this.bindSteppers();
    this.bindSwitches();
    this.bindSliders();
    this.bindToggles();
    this.bindPresets();
    this.bindExportTabs();
    this.bindAddEnvPair();

    this.renderEnvPairs();
    this.updateExportCode();
  }

  bindSteppers() {
    const workerVal = document.getElementById('paramWorkersVal');
    document.getElementById('paramWorkersDec')?.addEventListener('click', () => {
      if (this.state.workerThreads > 1) {
        this.state.workerThreads = Math.max(1, this.state.workerThreads - 1);
        if (workerVal) workerVal.textContent = String(this.state.workerThreads).padStart(2, '0');
        if (this.sfx) this.sfx.tick();
        this.updateExportCode();
      }
    });
    document.getElementById('paramWorkersInc')?.addEventListener('click', () => {
      if (this.state.workerThreads < 64) {
        this.state.workerThreads = Math.min(64, this.state.workerThreads + 1);
        if (workerVal) workerVal.textContent = String(this.state.workerThreads).padStart(2, '0');
        if (this.sfx) this.sfx.tick();
        this.updateExportCode();
      }
    });

    const batchVal = document.getElementById('paramBatchVal');
    document.getElementById('paramBatchDec')?.addEventListener('click', () => {
      if (this.state.batchWindowMs > 8) {
        this.state.batchWindowMs = Math.max(8, this.state.batchWindowMs - 8);
        if (batchVal) batchVal.textContent = `${this.state.batchWindowMs}ms`;
        if (this.sfx) this.sfx.tick();
        this.updateExportCode();
      }
    });
    document.getElementById('paramBatchInc')?.addEventListener('click', () => {
      if (this.state.batchWindowMs < 512) {
        this.state.batchWindowMs = Math.min(512, this.state.batchWindowMs + 8);
        if (batchVal) batchVal.textContent = `${this.state.batchWindowMs}ms`;
        if (this.sfx) this.sfx.tick();
        this.updateExportCode();
      }
    });
  }

  bindSwitches() {
    document.querySelectorAll('[data-switch-failover]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.switchFailover;
        this.state.failoverMode = mode;
        if (this.sfx) this.sfx.click();
        document.querySelectorAll('[data-switch-failover]').forEach(b => {
          b.classList.remove('bg-orange', 'text-near', 'font-bold');
          b.classList.add('hover:bg-white/10', 'text-cream/60');
        });
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/60');
        this.updateExportCode();
      });
    });

    document.querySelectorAll('[data-switch-isolation]').forEach(btn => {
      btn.addEventListener('click', () => {
        const engine = btn.dataset.switchIsolation;
        this.state.isolationEngine = engine;
        if (this.sfx) this.sfx.click();
        document.querySelectorAll('[data-switch-isolation]').forEach(b => {
          b.classList.remove('bg-orange', 'text-near', 'font-bold');
          b.classList.add('hover:bg-white/10', 'text-cream/60');
        });
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/60');
        this.updateExportCode();
      });
    });

    document.querySelectorAll('[data-switch-routing]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = btn.dataset.switchRouting;
        this.state.routingStrategy = r;
        if (this.sfx) this.sfx.click();
        document.querySelectorAll('[data-switch-routing]').forEach(b => {
          b.classList.remove('bg-orange', 'text-near', 'font-bold');
          b.classList.add('hover:bg-white/10', 'text-cream/60');
        });
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('hover:bg-white/10', 'text-cream/60');
        this.updateExportCode();
      });
    });
  }

  bindSliders() {
    const minSlider = document.getElementById('paramRateMin');
    const maxSlider = document.getElementById('paramRateMax');
    const minVal = document.getElementById('paramRateMinVal');
    const maxVal = document.getElementById('paramRateMaxVal');
    const trackBar = document.getElementById('paramRateTrackBar');

    const updateSliderUI = () => {
      let min = parseInt(minSlider?.value || 25, 10);
      let max = parseInt(maxSlider?.value || 120, 10);

      if (min > max - 10) {
        min = max - 10;
        if (minSlider) minSlider.value = min;
      }

      this.state.rateLimitMin = min;
      this.state.rateLimitMax = max;

      if (minVal) minVal.textContent = `${min}k`;
      if (maxVal) maxVal.textContent = `${max}k ops/s`;

      if (trackBar) {
        const leftPct = (min / 200) * 100;
        const widthPct = ((max - min) / 200) * 100;
        trackBar.style.left = `${leftPct}%`;
        trackBar.style.width = `${widthPct}%`;
      }
    };

    minSlider?.addEventListener('input', () => {
      updateSliderUI();
      if (this.sfx) this.sfx.tick();
      this.updateExportCode();
    });

    maxSlider?.addEventListener('input', () => {
      updateSliderUI();
      if (this.sfx) this.sfx.tick();
      this.updateExportCode();
    });

    updateSliderUI();
  }

  bindToggles() {
    const zkToggle = document.getElementById('paramZkToggle');
    zkToggle?.addEventListener('change', (e) => {
      this.state.enableZeroKnowledge = e.target.checked;
      if (this.sfx) this.sfx.click();
      this.updateExportCode();
    });

    const tlsToggle = document.getElementById('paramTlsToggle');
    tlsToggle?.addEventListener('change', (e) => {
      this.state.strictTls = e.target.checked;
      if (this.sfx) this.sfx.click();
      this.updateExportCode();
    });

    const streamToggle = document.getElementById('paramStreamToggle');
    streamToggle?.addEventListener('change', (e) => {
      this.state.telemetryStream = e.target.checked;
      if (this.sfx) this.sfx.click();
      this.updateExportCode();
    });
  }

  bindPresets() {
    document.querySelectorAll('[data-param-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.paramPreset;
        const p = PRESETS[key];
        if (!p) return;

        this.state = JSON.parse(JSON.stringify(p));
        if (this.sfx) this.sfx.telemetry();

        document.querySelectorAll('[data-param-preset]').forEach(b => {
          b.classList.remove('bg-orange', 'text-near', 'font-bold');
          b.classList.add('bg-white/5', 'hover:bg-white/10', 'text-cream/70');
        });
        btn.classList.add('bg-orange', 'text-near', 'font-bold');
        btn.classList.remove('bg-white/5', 'hover:bg-white/10', 'text-cream/70');

        this.syncUIFromState();
        this.renderEnvPairs();
        this.updateExportCode();
        this.showToast(`Loaded Preset: ${key.toUpperCase()}`);
      });
    });
  }

  syncUIFromState() {
    const workerVal = document.getElementById('paramWorkersVal');
    if (workerVal) workerVal.textContent = String(this.state.workerThreads).padStart(2, '0');

    const batchVal = document.getElementById('paramBatchVal');
    if (batchVal) batchVal.textContent = `${this.state.batchWindowMs}ms`;

    const minSlider = document.getElementById('paramRateMin');
    const maxSlider = document.getElementById('paramRateMax');
    if (minSlider) minSlider.value = this.state.rateLimitMin;
    if (maxSlider) maxSlider.value = this.state.rateLimitMax;

    document.querySelectorAll('[data-switch-failover]').forEach(b => {
      const match = b.dataset.switchFailover === this.state.failoverMode;
      b.className = match
        ? 'param-switch-pill px-2.5 py-1 rounded text-[10px] uppercase font-bold bg-orange text-near transition'
        : 'param-switch-pill px-2.5 py-1 rounded text-[10px] uppercase hover:bg-white/10 text-cream/60 transition';
    });

    document.querySelectorAll('[data-switch-isolation]').forEach(b => {
      const match = b.dataset.switchIsolation === this.state.isolationEngine;
      b.className = match
        ? 'param-switch-pill px-2.5 py-1 rounded text-[10px] uppercase font-bold bg-orange text-near transition'
        : 'param-switch-pill px-2.5 py-1 rounded text-[10px] uppercase hover:bg-white/10 text-cream/60 transition';
    });

    document.querySelectorAll('[data-switch-routing]').forEach(b => {
      const match = b.dataset.switchRouting === this.state.routingStrategy;
      b.className = match
        ? 'param-switch-pill px-2.5 py-1 rounded text-[10px] uppercase font-bold bg-orange text-near transition'
        : 'param-switch-pill px-2.5 py-1 rounded text-[10px] uppercase hover:bg-white/10 text-cream/60 transition';
    });

    const zkToggle = document.getElementById('paramZkToggle');
    if (zkToggle) zkToggle.checked = this.state.enableZeroKnowledge;

    const tlsToggle = document.getElementById('paramTlsToggle');
    if (tlsToggle) tlsToggle.checked = this.state.strictTls;

    const streamToggle = document.getElementById('paramStreamToggle');
    if (streamToggle) streamToggle.checked = this.state.telemetryStream;

    const trackBar = document.getElementById('paramRateTrackBar');
    const minVal = document.getElementById('paramRateMinVal');
    const maxVal = document.getElementById('paramRateMaxVal');
    if (minVal) minVal.textContent = `${this.state.rateLimitMin}k`;
    if (maxVal) maxVal.textContent = `${this.state.rateLimitMax}k ops/s`;
    if (trackBar) {
      trackBar.style.left = `${(this.state.rateLimitMin / 200) * 100}%`;
      trackBar.style.width = `${((this.state.rateLimitMax - this.state.rateLimitMin) / 200) * 100}%`;
    }
  }

  bindExportTabs() {
    document.querySelectorAll('[data-param-export-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const fmt = tab.dataset.paramExportTab;
        this.activeExportFormat = fmt;
        if (this.sfx) this.sfx.click();

        document.querySelectorAll('[data-param-export-tab]').forEach(t => {
          t.classList.remove('bg-white/20', 'text-white', 'font-bold');
          t.classList.add('hover:bg-white/10', 'text-cream/60');
        });
        tab.classList.add('bg-white/20', 'text-white', 'font-bold');
        tab.classList.remove('hover:bg-white/10', 'text-cream/60');

        if (this.exportFormatLabelEl) {
          this.exportFormatLabelEl.textContent = fmt === 'env' ? '.ENV SPECIFICATION' : 'CONFIG.YAML SPECIFICATION';
        }

        this.updateExportCode();
      });
    });

    document.getElementById('paramCopyCodeBtn')?.addEventListener('click', () => {
      const code = this.generateCode(this.activeExportFormat);
      if (this.sfx) this.sfx.success();
      navigator.clipboard?.writeText(code).then(() => {
        this.showToast(`Copied ${this.activeExportFormat.toUpperCase()} config to clipboard!`);
      });
    });
  }

  bindAddEnvPair() {
    document.getElementById('paramAddEnvBtn')?.addEventListener('click', () => {
      if (this.sfx) this.sfx.click();
      const newId = `p_${Date.now()}`;
      this.state.envPairs.push({
        id: newId,
        key: 'NEW_CONFIG_KEY',
        value: 'default_value',
        type: 'string',
        secret: false
      });
      this.renderEnvPairs();
      this.updateExportCode();
    });
  }

  renderEnvPairs() {
    if (!this.envPairsEl) return;

    this.envPairsEl.innerHTML = this.state.envPairs.map((pair) => {
      const isRevealed = this.revealedSecrets.has(pair.id);
      const isSecret = pair.type === 'secret';

      return `
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded bg-black/40 border border-white/10 hover:border-white/20 transition group" data-pair-id="${pair.id}">
          <div class="flex-1 min-w-[140px]">
            <input 
              type="text" 
              class="w-full bg-white/5 border border-white/15 focus:border-orange text-cream font-mono text-[11px] px-2 py-1 rounded focus:outline-none transition uppercase pair-key-input"
              value="${pair.key}"
              placeholder="CONFIG_KEY"
              data-id="${pair.id}"
            />
          </div>

          <div class="w-24 shrink-0">
            <select 
              class="w-full bg-white/5 border border-white/15 focus:border-orange text-cream/80 font-mono text-[10px] px-1.5 py-1 rounded focus:outline-none pair-type-select cursor-pointer"
              data-id="${pair.id}"
            >
              <option value="string" ${pair.type === 'string' ? 'selected' : ''}>STRING</option>
              <option value="number" ${pair.type === 'number' ? 'selected' : ''}>NUMBER</option>
              <option value="boolean" ${pair.type === 'boolean' ? 'selected' : ''}>BOOLEAN</option>
              <option value="secret" ${pair.type === 'secret' ? 'selected' : ''}>SECRET</option>
            </select>
          </div>

          <div class="flex-1 min-w-[140px] relative">
            <input 
              type="${isSecret && !isRevealed ? 'password' : 'text'}" 
              class="w-full bg-white/5 border border-white/15 focus:border-orange text-cream font-mono text-[11px] px-2 py-1 ${isSecret ? 'pr-7' : ''} rounded focus:outline-none transition pair-val-input"
              value="${pair.value}"
              placeholder="Value"
              data-id="${pair.id}"
            />
            ${isSecret ? `
              <button 
                class="absolute right-1.5 top-1 text-cream/40 hover:text-orange transition text-[10px] p-0.5 toggle-secret-btn" 
                data-id="${pair.id}" 
                title="${isRevealed ? 'Mask secret' : 'Reveal secret'}"
              >
                ${isRevealed ? '👁' : '✱'}
              </button>
            ` : ''}
          </div>

          <button 
            class="p-1 rounded hover:bg-ruby/20 text-cream/40 hover:text-ruby transition self-center sm:self-auto delete-pair-btn" 
            data-id="${pair.id}"
            title="Remove parameter"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      `;
    }).join('');

    this.envPairsEl.querySelectorAll('.pair-key-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const id = e.target.dataset.id;
        const pair = this.state.envPairs.find(p => p.id === id);
        if (pair) pair.key = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
        this.updateExportCode();
      });
    });

    this.envPairsEl.querySelectorAll('.pair-val-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const id = e.target.dataset.id;
        const pair = this.state.envPairs.find(p => p.id === id);
        if (pair) pair.value = e.target.value;
        this.updateExportCode();
      });
    });

    this.envPairsEl.querySelectorAll('.pair-type-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const pair = this.state.envPairs.find(p => p.id === id);
        if (pair) {
          pair.type = e.target.value;
          pair.secret = pair.type === 'secret';
          if (this.sfx) this.sfx.click();
          this.renderEnvPairs();
          this.updateExportCode();
        }
      });
    });

    this.envPairsEl.querySelectorAll('.toggle-secret-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (this.revealedSecrets.has(id)) {
          this.revealedSecrets.delete(id);
        } else {
          this.revealedSecrets.add(id);
        }
        if (this.sfx) this.sfx.click();
        this.renderEnvPairs();
      });
    });

    this.envPairsEl.querySelectorAll('.delete-pair-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.state.envPairs = this.state.envPairs.filter(p => p.id !== id);
        if (this.sfx) this.sfx.modalClose();
        this.renderEnvPairs();
        this.updateExportCode();
      });
    });
  }

  generateCode(format = 'env') {
    const s = this.state;
    if (format === 'yaml') {
      let yaml = `# Kinetic Infrastructure Configuration\n`;
      yaml += `version: "2026.09"\n`;
      yaml += `profile: "${s.clusterProfile}"\n\n`;
      yaml += `runtime:\n`;
      yaml += `  engine: "${s.isolationEngine}"\n`;
      yaml += `  worker_threads: ${s.workerThreads}\n`;
      yaml += `  batch_window_ms: ${s.batchWindowMs}\n\n`;
      yaml += `mesh:\n`;
      yaml += `  routing: "${s.routingStrategy}"\n`;
      yaml += `  failover_policy: "${s.failoverMode}"\n`;
      yaml += `  rate_limit:\n`;
      yaml += `    min_k_ops: ${s.rateLimitMin}\n`;
      yaml += `    max_k_ops: ${s.rateLimitMax}\n\n`;
      yaml += `security:\n`;
      yaml += `  zero_knowledge_proofs: ${s.enableZeroKnowledge}\n`;
      yaml += `  strict_tls: ${s.strictTls}\n`;
      yaml += `  telemetry_stream: ${s.telemetryStream}\n\n`;
      yaml += `parameters:\n`;
      s.envPairs.forEach(p => {
        const val = p.type === 'number' || p.type === 'boolean' ? p.value : `"${p.value}"`;
        yaml += `  ${p.key.toLowerCase()}: ${val}\n`;
      });
      return yaml;
    }

    let env = `# Kinetic Cluster Environment Variables\n`;
    env += `KINETIC_PROFILE=${s.clusterProfile}\n`;
    env += `KINETIC_FAILOVER_MODE=${s.failoverMode}\n`;
    env += `KINETIC_ISOLATION_ENGINE=${s.isolationEngine}\n`;
    env += `KINETIC_ROUTING_STRATEGY=${s.routingStrategy}\n`;
    env += `KINETIC_WORKER_THREADS=${s.workerThreads}\n`;
    env += `KINETIC_BATCH_WINDOW_MS=${s.batchWindowMs}\n`;
    env += `KINETIC_RATE_LIMIT_MIN=${s.rateLimitMin}k\n`;
    env += `KINETIC_RATE_LIMIT_MAX=${s.rateLimitMax}k\n`;
    env += `KINETIC_ENABLE_ZK_PROOFS=${s.enableZeroKnowledge}\n`;
    env += `KINETIC_STRICT_TLS=${s.strictTls}\n`;
    env += `KINETIC_TELEMETRY_STREAM=${s.telemetryStream}\n\n`;
    env += `# User Config Parameters\n`;
    s.envPairs.forEach(p => {
      env += `${p.key}=${p.value}\n`;
    });
    return env;
  }

  updateExportCode() {
    if (!this.codeOutputEl) return;
    this.codeOutputEl.textContent = this.generateCode(this.activeExportFormat);
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

export function initParameterRack(options = {}) {
  return new ParameterRack(options);
}
