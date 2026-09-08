/**
 * High-Density Telemetry Data Table Engine
 * Manages sorting, filtering, row expansion, inline canvas sparklines,
 * batch selections, and CSV/JSON export with procedural micro-haptics.
 */

export const INITIAL_NODES = [
  {
    id: 'node-iad-01',
    name: 'US-EAST-WORKER-01',
    status: 'online',
    region: 'us-east (iad)',
    latencyHistory: [0.38, 0.42, 0.40, 0.39, 0.45, 0.41, 0.38, 0.39, 0.44, 0.40, 0.37, 0.39],
    currentLatency: 0.39,
    throughput: '18.4k ops/s',
    load: 44,
    signature: '0x88ab...3c12',
    fullSignature: '0x88abf9420019bc3847562019aa123849102c3c12',
    runtime: 'v8-isolate',
    memory: '64.2 MB',
    zkProof: 'STARK-VERIFIED',
    tasksProcessed: 142890
  },
  {
    id: 'node-iad-02',
    name: 'US-EAST-WORKER-02',
    status: 'throttled',
    region: 'us-east (iad)',
    latencyHistory: [0.45, 0.52, 0.68, 0.74, 0.82, 0.88, 0.94, 0.89, 0.92, 0.87, 0.91, 0.88],
    currentLatency: 0.88,
    throughput: '9.2k ops/s',
    load: 86,
    signature: '0x99fe...1d44',
    fullSignature: '0x99fe04928172bc91029384729104820192841d44',
    runtime: 'v8-isolate',
    memory: '118.5 MB',
    zkProof: 'STARK-VERIFIED',
    tasksProcessed: 89420
  },
  {
    id: 'worker-fra-01',
    name: 'EU-CENTRAL-ROUTER',
    status: 'online',
    region: 'eu-central (fra)',
    latencyHistory: [0.32, 0.34, 0.31, 0.35, 0.33, 0.32, 0.34, 0.33, 0.31, 0.32, 0.33, 0.32],
    currentLatency: 0.32,
    throughput: '24.1k ops/s',
    load: 52,
    signature: '0x42ca...7e88',
    fullSignature: '0x42ca918274029183749281048291029384727e88',
    runtime: 'wasm-edge',
    memory: '42.1 MB',
    zkProof: 'STARK-VERIFIED',
    tasksProcessed: 289100
  },
  {
    id: 'worker-sin-03',
    name: 'AP-SOUTHEAST-EDGE',
    status: 'syncing',
    region: 'ap-southeast (sin)',
    latencyHistory: [0.65, 0.62, 0.70, 0.68, 0.72, 0.69, 0.67, 0.64, 0.66, 0.63, 0.65, 0.62],
    currentLatency: 0.62,
    throughput: '12.8k ops/s',
    load: 38,
    signature: '0x17db...8f91',
    fullSignature: '0x17db849201928374619283746192837461928f91',
    runtime: 'v8-isolate',
    memory: '56.0 MB',
    zkProof: 'BLOCK-SYNCING',
    tasksProcessed: 98120
  },
  {
    id: 'gateway-sfo-02',
    name: 'US-WEST-DISPATCH',
    status: 'online',
    region: 'us-west (sfo)',
    latencyHistory: [0.28, 0.29, 0.27, 0.30, 0.29, 0.28, 0.28, 0.29, 0.27, 0.28, 0.29, 0.28],
    currentLatency: 0.28,
    throughput: '31.2k ops/s',
    load: 61,
    signature: '0x33aa...5b29',
    fullSignature: '0x33aa948201948273619283746192837461925b29',
    runtime: 'wasm-edge',
    memory: '38.4 MB',
    zkProof: 'STARK-VERIFIED',
    tasksProcessed: 412050
  },
  {
    id: 'node-hnd-04',
    name: 'AP-NORTHEAST-AUDIT',
    status: 'degraded',
    region: 'ap-northeast (hnd)',
    latencyHistory: [0.72, 0.81, 0.95, 1.12, 1.25, 1.42, 1.38, 1.45, 1.52, 1.48, 1.55, 1.62],
    currentLatency: 1.62,
    throughput: '4.1k ops/s',
    load: 94,
    signature: '0x55cc...0a77',
    fullSignature: '0x55cc849201948273619283746192837461920a77',
    runtime: 'v8-isolate',
    memory: '164.0 MB',
    zkProof: 'VERIFY-TIMEOUT',
    tasksProcessed: 32400
  }
];

export class TelemetryTable {
  constructor(options = {}) {
    this.data = [...INITIAL_NODES];
    this.filteredData = [...this.data];
    this.sortCol = options.sortCol || 'currentLatency';
    this.sortOrder = options.sortOrder || 'asc';
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.selectedIds = new Set();
    this.expandedIds = new Set();
    this.sfx = options.sfx || (typeof window !== 'undefined' ? window.sfx : null);

    this.tableBodyEl = document.getElementById(options.tableBodyId || 'telemetryTableBody');
    this.searchEl = document.getElementById(options.searchId || 'telemetrySearch');
    this.statusSelectEl = document.getElementById(options.statusSelectId || 'telemetryStatusFilter');
    this.selectedCountEl = document.getElementById(options.selectedCountId || 'telemetrySelectedCount');
    this.batchActionsEl = document.getElementById(options.batchActionsId || 'telemetryBatchActions');
    this.selectAllEl = document.getElementById(options.selectAllId || 'telemetrySelectAll');

    this.init();
  }

  init() {
    this.searchEl?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.applyFilter();
    });

    this.statusSelectEl?.addEventListener('change', (e) => {
      this.statusFilter = e.target.value;
      if (this.sfx) this.sfx.click();
      this.applyFilter();
    });

    this.selectAllEl?.addEventListener('change', (e) => {
      const checked = e.target.checked;
      if (checked) {
        this.filteredData.forEach(row => this.selectedIds.add(row.id));
      } else {
        this.selectedIds.clear();
      }
      if (this.sfx) this.sfx.click();
      this.render();
      this.updateSelectionToolbar();
    });

    // Sortable column headers
    document.querySelectorAll('[data-sort]').forEach(header => {
      header.addEventListener('click', () => {
        const col = header.dataset.sort;
        if (this.sortCol === col) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortCol = col;
          this.sortOrder = 'asc';
        }
        if (this.sfx) this.sfx.click();
        this.applySort();
        this.render();
      });
    });

    // Batch Action Buttons
    document.getElementById('batchDrainBtn')?.addEventListener('click', () => {
      if (this.selectedIds.size === 0) return;
      if (this.sfx) this.sfx.telemetry();
      const count = this.selectedIds.size;
      this.data.forEach(node => {
        if (this.selectedIds.has(node.id)) {
          node.status = 'throttled';
        }
      });
      this.applyFilter();
      this.showToast(`Draining traffic on ${count} cluster node(s)`);
    });

    document.getElementById('batchExportBtn')?.addEventListener('click', () => {
      this.exportSelectedCSV();
    });

    this.applySort();
    this.render();
  }

  applySort() {
    this.filteredData.sort((a, b) => {
      let valA = a[this.sortCol];
      let valB = b[this.sortCol];

      if (typeof valA === 'string') {
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    // Update sort arrow indicators in UI
    document.querySelectorAll('[data-sort]').forEach(header => {
      const col = header.dataset.sort;
      const arrow = header.querySelector('.sort-arrow');
      if (arrow) {
        if (col === this.sortCol) {
          arrow.textContent = this.sortOrder === 'asc' ? '▲' : '▼';
          arrow.classList.remove('opacity-20');
          arrow.classList.add('text-orange');
        } else {
          arrow.textContent = '⇅';
          arrow.classList.add('opacity-20');
          arrow.classList.remove('text-orange');
        }
      }
    });
  }

  applyFilter() {
    this.filteredData = this.data.filter(row => {
      const matchesSearch = !this.searchQuery || 
        row.id.toLowerCase().includes(this.searchQuery) ||
        row.name.toLowerCase().includes(this.searchQuery) ||
        row.region.toLowerCase().includes(this.searchQuery) ||
        row.signature.toLowerCase().includes(this.searchQuery);

      const matchesStatus = this.statusFilter === 'all' || row.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });

    this.applySort();
    this.render();
  }

  toggleRowExpand(id) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
      if (this.sfx) this.sfx.modalClose();
    } else {
      this.expandedIds.add(id);
      if (this.sfx) this.sfx.modalOpen();
    }
    this.render();
  }

  toggleSelect(id) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    if (this.sfx) this.sfx.tick();
    this.updateSelectionToolbar();
    this.render();
  }

  updateSelectionToolbar() {
    const count = this.selectedIds.size;
    if (this.selectedCountEl) {
      this.selectedCountEl.textContent = `${count} SELECTED`;
    }
    if (this.batchActionsEl) {
      if (count > 0) {
        this.batchActionsEl.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        this.batchActionsEl.classList.add('opacity-0', 'pointer-events-none');
      }
    }
    if (this.selectAllEl) {
      this.selectAllEl.checked = count > 0 && count === this.filteredData.length;
    }
  }

  drawSparkline(canvas, history, status) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 80;
    const h = canvas.clientHeight || 20;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...history) * 0.9;
    const max = Math.max(...history) * 1.1;
    const range = max - min || 1;
    const step = w / (history.length - 1);

    // Color based on status
    let strokeColor = '#f4551d';
    let fillColor = 'rgba(244, 85, 29, 0.12)';
    if (status === 'online') {
      strokeColor = '#10b981';
      fillColor = 'rgba(16, 185, 129, 0.12)';
    } else if (status === 'throttled') {
      strokeColor = '#f59e0b';
      fillColor = 'rgba(245, 158, 11, 0.12)';
    } else if (status === 'degraded') {
      strokeColor = '#ef4444';
      fillColor = 'rgba(239, 68, 68, 0.12)';
    }

    ctx.beginPath();
    ctx.moveTo(0, h);

    history.forEach((val, i) => {
      const x = i * step;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    history.forEach((val, i) => {
      const x = i * step;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.35;
    ctx.stroke();

    // End point beacon
    const lastX = (history.length - 1) * step;
    const lastY = h - ((history[history.length - 1] - min) / range) * (h - 4) - 2;
    ctx.fillStyle = strokeColor;
    ctx.fillRect(lastX - 1.5, lastY - 1.5, 3, 3);
  }

  render() {
    if (!this.tableBodyEl) return;

    if (this.filteredData.length === 0) {
      this.tableBodyEl.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-cream/40 font-mono text-xs border border-dashed border-white/10 rounded-lg">
            NO TELEMETRY NODES MATCHING CRITERIA
          </td>
        </tr>
      `;
      return;
    }

    this.tableBodyEl.innerHTML = this.filteredData.map(node => {
      const isSelected = this.selectedIds.has(node.id);
      const isExpanded = this.expandedIds.has(node.id);

      // Status pill
      let statusBadge = `<span class="badge-tech"><span class="beacon-dot online animate-pulse"></span> ONLINE</span>`;
      if (node.status === 'throttled') {
        statusBadge = `<span class="badge-tech text-amber border-amber/40"><span class="beacon-dot warning"></span> THROTTLED</span>`;
      } else if (node.status === 'degraded') {
        statusBadge = `<span class="badge-tech text-ruby border-ruby/40"><span class="beacon-dot error"></span> DEGRADED</span>`;
      } else if (node.status === 'syncing') {
        statusBadge = `<span class="badge-tech text-cyan-400 border-cyan-400/40"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> SYNCING</span>`;
      }

      return `
        <tr class="table-row-tech ${isSelected ? 'bg-orange/5' : ''} border-b border-white/5 hover:bg-white/[0.03] transition group" data-node-id="${node.id}">
          <!-- Checkbox -->
          <td class="py-2.5 px-2.5 w-8 text-center">
            <input type="checkbox" class="checkbox-chamfer node-select" data-id="${node.id}" ${isSelected ? 'checked' : ''} />
          </td>

          <!-- Status -->
          <td class="py-2.5 px-2.5 font-mono text-[10.5px] whitespace-nowrap">
            ${statusBadge}
          </td>

          <!-- Node ID & Name -->
          <td class="py-2.5 px-2.5 font-mono">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-cream group-hover:text-white text-[11.5px] whitespace-nowrap">${node.id}</span>
              <span class="text-[8.5px] px-1 py-0.2 rounded bg-white/5 text-cream/50 border border-white/10 hidden xl:inline-block whitespace-nowrap">${node.name}</span>
            </div>
            <span class="text-[9.5px] text-cream/40 block font-mono">${node.region}</span>
          </td>

          <!-- Latency with Inline Micro-Sparkline -->
          <td class="py-2.5 px-2.5 font-mono">
            <div class="flex items-center gap-2">
              <div class="w-16 h-4">
                <canvas class="sparkline-canvas block w-full h-full" data-spark-id="${node.id}"></canvas>
              </div>
              <span class="font-bold text-[11px] sm:text-xs ${node.currentLatency > 1.0 ? 'text-ruby' : node.currentLatency > 0.6 ? 'text-amber' : 'text-emerald-400'} whitespace-nowrap">
                ${node.currentLatency.toFixed(2)}ms
              </span>
            </div>
          </td>

          <!-- Throughput & Load -->
          <td class="py-2.5 px-2.5 font-mono text-[11px] text-cream/80 whitespace-nowrap hidden md:table-cell">
            <div class="flex items-center gap-1.5">
              <span>${node.throughput}</span>
              <span class="text-[9px] text-cream/40">(${node.load}%)</span>
            </div>
          </td>

          <!-- Hash Signature -->
          <td class="py-2.5 px-2.5 font-mono text-[10.5px] whitespace-nowrap hidden lg:table-cell">
            <button class="copy-sig-btn hover:text-orange text-cream/60 transition flex items-center gap-1" data-full="${node.fullSignature}" title="Click to copy full hash signature">
              <code>${node.signature}</code>
              <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            </button>
          </td>

          <!-- Row Expand Action -->
          <td class="py-2.5 px-2.5 text-right">
            <button class="row-expand-btn px-2 py-1 rounded bg-white/5 hover:bg-orange hover:text-near text-cream font-mono text-[10px] transition flex items-center gap-1 ml-auto" data-id="${node.id}">
              <span>${isExpanded ? 'CLOSE' : 'TRACE'}</span>
              <span class="text-[9px] font-bold">${isExpanded ? '▲' : '▼'}</span>
            </button>
          </td>
        </tr>

        <!-- Expandable Trace Drawer Row -->
        ${isExpanded ? `
          <tr class="bg-near/80 border-b border-orange/30">
            <td colspan="7" class="p-4 font-mono text-xs space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10 text-[10.5px]">
                <div class="flex items-center gap-2">
                  <span class="text-orange font-bold">NODE AUDIT TRACE // ${node.id}</span>
                  <span class="text-white/20">|</span>
                  <span class="text-emerald-400 font-semibold">${node.zkProof}</span>
                </div>
                <div class="flex items-center gap-3 text-cream/60 text-[10px]">
                  <span>RUNTIME: <strong class="text-cream">${node.runtime}</strong></span>
                  <span>MEMORY: <strong class="text-cream">${node.memory}</strong></span>
                  <span>PROCESSED: <strong class="text-cream">${node.tasksProcessed.toLocaleString()}</strong></span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
                <!-- Raw JSON Specification -->
                <div class="p-2.5 rounded bg-black/50 border border-white/10 overflow-x-auto">
                  <div class="text-[9.5px] uppercase text-cream/40 mb-1.5 flex justify-between items-center">
                    <span>STATE PAYLOAD</span>
                    <button class="copy-payload-btn text-orange hover:text-white transition text-[9px]" data-json='${JSON.stringify(node)}'>COPY JSON</button>
                  </div>
                  <pre class="text-cream/90 text-[10.5px] leading-relaxed"><code>${JSON.stringify({
                    nodeId: node.id,
                    status: node.status,
                    p99_latency_ms: Math.max(...node.latencyHistory),
                    active_load_pct: node.load,
                    zk_proof_signature: node.fullSignature,
                    runtime_engine: node.runtime
                  }, null, 2)}</code></pre>
                </div>

                <!-- Network Route & Telemetry Matrix -->
                <div class="p-2.5 rounded bg-black/50 border border-white/10 space-y-2">
                  <span class="text-[9.5px] uppercase text-cream/40 block mb-1">TELEMETRY MATRIX</span>
                  <div class="space-y-1 text-[10.5px]">
                    <div class="flex justify-between items-center text-cream/70">
                      <span>PACKET JITTER:</span>
                      <span class="text-emerald-400 font-semibold">&lt; 0.04ms</span>
                    </div>
                    <div class="flex justify-between items-center text-cream/70">
                      <span>TLS 1.3 CIPHER:</span>
                      <span class="text-cream font-semibold">ChaCha20-Poly1305</span>
                    </div>
                    <div class="flex justify-between items-center text-cream/70">
                      <span>UPTIME (90 DAYS):</span>
                      <span class="text-cream font-semibold">99.994%</span>
                    </div>
                    <div class="flex justify-between items-center text-cream/70">
                      <span>FAILOVER PEER:</span>
                      <span class="text-orange font-semibold">node-iad-02 (HOT)</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        ` : ''}
      `;
    }).join('');

    // Post-render: Draw Sparklines on canvases
    this.filteredData.forEach(node => {
      const sparkCanvas = this.tableBodyEl.querySelector(`[data-spark-id="${node.id}"]`);
      if (sparkCanvas) {
        this.drawSparkline(sparkCanvas, node.latencyHistory, node.status);
      }
    });

    // Wire Row Checkboxes
    this.tableBodyEl.querySelectorAll('.node-select').forEach(chk => {
      chk.addEventListener('change', (e) => {
        e.stopPropagation();
        this.toggleSelect(chk.dataset.id);
      });
    });

    // Wire Row Expand Buttons
    this.tableBodyEl.querySelectorAll('.row-expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleRowExpand(btn.dataset.id);
      });
    });

    // Wire Copy Hash Buttons
    this.tableBodyEl.querySelectorAll('.copy-sig-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.sfx) this.sfx.success();
        navigator.clipboard?.writeText(btn.dataset.full).then(() => {
          this.showToast('Copied full Ed25519 signature!');
        });
      });
    });

    // Wire Copy Payload Buttons
    this.tableBodyEl.querySelectorAll('.copy-payload-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.sfx) this.sfx.success();
        navigator.clipboard?.writeText(btn.dataset.json).then(() => {
          this.showToast('Copied state payload JSON!');
        });
      });
    });
  }

  exportSelectedCSV() {
    const targets = this.selectedIds.size > 0 
      ? this.data.filter(n => this.selectedIds.has(n.id))
      : this.data;

    let csv = 'Node ID,Name,Status,Region,Current Latency (ms),Throughput,Load (%),Signature\n';
    targets.forEach(n => {
      csv += `"${n.id}","${n.name}","${n.status}","${n.region}",${n.currentLatency},"${n.throughput}",${n.load},"${n.fullSignature}"\n`;
    });

    if (this.sfx) this.sfx.success();
    navigator.clipboard?.writeText(csv).then(() => {
      this.showToast(`Exported ${targets.length} nodes to CSV!`);
    });
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

export function initTelemetryTable(options = {}) {
  return new TelemetryTable(options);
}
