/**
 * Interactive Blueprint Node Flow Graph & Circuit Pipeline Engine (Section 12)
 * Features draggable chamfered logic nodes, dynamic cubic Bézier spline cables,
 * kinetic energy pulse packets, and drag-and-drop socket patching.
 */

function getAccentColor(fallback = '#f4551d') {
  if (typeof window === 'undefined') return fallback;
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue('--orange').trim() || fallback;
}

/**
 * 1. Pipeline Node Model & View
 */
export class PipelineNode {
  constructor(spec, engine) {
    this.engine = engine;
    this.id = spec.id;
    this.type = spec.type || 'logic';
    this.title = spec.title || 'NODE PROCESSOR';
    this.tag = spec.tag || 'ISOLATE';
    this.color = spec.color || '#f4551d';
    this.x = spec.x || 60;
    this.y = spec.y || 60;
    this.width = spec.width || 210;
    this.height = spec.height || 140;

    this.inputs = spec.inputs || [];   // [{ id: 'in_1', label: 'RAW_DATA' }]
    this.outputs = spec.outputs || []; // [{ id: 'out_1', label: 'CLEAN' }]
    this.metricLabel = spec.metricLabel || 'THROUGHPUT';
    this.metricValue = spec.metricValue || '120.4k ops/s';
    this.status = spec.status || 'ACTIVE';

    this.el = null;
    this.metricEl = null;
    this.createDom();
  }

  createDom() {
    const node = document.createElement('div');
    node.id = `node_${this.id}`;
    node.className = 'pipeline-node rounded-lg bg-ink2/90 border border-white/15 p-3.5 font-mono text-xs shadow-2xl flex flex-col justify-between backdrop-blur-md';
    node.style.width = `${this.width}px`;
    node.style.left = `${this.x}px`;
    node.style.top = `${this.y}px`;
    node.style.borderColor = `${this.color}40`;

    // Corner tactical crop brackets
    const bTL = document.createElement('span');
    bTL.className = 'bracket tl border-t-2 border-l-2 border-white/30';
    const bTR = document.createElement('span');
    bTR.className = 'bracket tr border-t-2 border-r-2 border-white/30';
    const bBL = document.createElement('span');
    bBL.className = 'bracket bl border-b-2 border-l-2 border-white/30';
    const bBR = document.createElement('span');
    bBR.className = 'bracket br border-b-2 border-r-2 border-white/30';
    node.appendChild(bTL);
    node.appendChild(bTR);
    node.appendChild(bBL);
    node.appendChild(bBR);

    // Header bar with status LED & ID tag
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between pb-2 border-b border-white/10 text-[10px] pointer-events-none';

    const leftHeader = document.createElement('div');
    leftHeader.className = 'flex items-center gap-1.5 font-bold';
    leftHeader.style.color = this.color;
    leftHeader.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: ${this.color};"></span>
      <span>${this.id}</span>
    `;

    const rightHeader = document.createElement('span');
    rightHeader.className = 'text-[8.5px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-cream/60';
    rightHeader.textContent = this.tag;

    header.appendChild(leftHeader);
    header.appendChild(rightHeader);
    node.appendChild(header);

    // Title & Metric section
    const body = document.createElement('div');
    body.className = 'py-2 space-y-1.5 pointer-events-none';

    const titleEl = document.createElement('div');
    titleEl.className = 'text-[11px] font-semibold text-cream truncate';
    titleEl.textContent = this.title;

    const metricBox = document.createElement('div');
    metricBox.className = 'flex items-center justify-between text-[9.5px] text-cream/70 bg-black/40 px-2 py-1 rounded border border-white/5';
    metricBox.innerHTML = `
      <span class="text-cream/40 uppercase">${this.metricLabel}:</span>
      <span id="metric_${this.id}" class="font-bold text-cream">${this.metricValue}</span>
    `;
    this.metricEl = metricBox.querySelector(`#metric_${this.id}`);

    body.appendChild(titleEl);
    body.appendChild(metricBox);
    node.appendChild(body);

    // Sockets Row (Inputs on Left, Outputs on Right)
    const socketsRow = document.createElement('div');
    socketsRow.className = 'pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-cream/60 select-none';

    // Left input sockets container
    const inCol = document.createElement('div');
    inCol.className = 'space-y-1.5 flex flex-col items-start -ml-5';
    this.inputs.forEach(input => {
      const item = document.createElement('div');
      item.className = 'flex items-center gap-1.5';
      
      const socket = document.createElement('div');
      socket.id = `socket_${this.id}_${input.id}`;
      socket.className = 'node-socket in-socket';
      socket.dataset.nodeId = this.id;
      socket.dataset.portId = input.id;
      socket.dataset.isOutput = 'false';
      socket.title = `Input: ${input.label}`;

      const label = document.createElement('span');
      label.className = 'text-[8.5px] font-mono text-cream/50 pointer-events-none';
      label.textContent = input.label;

      item.appendChild(socket);
      item.appendChild(label);
      inCol.appendChild(item);
    });

    // Right output sockets container
    const outCol = document.createElement('div');
    outCol.className = 'space-y-1.5 flex flex-col items-end -mr-5';
    this.outputs.forEach(output => {
      const item = document.createElement('div');
      item.className = 'flex items-center gap-1.5 flex-row-reverse';

      const socket = document.createElement('div');
      socket.id = `socket_${this.id}_${output.id}`;
      socket.className = 'node-socket out-socket';
      socket.dataset.nodeId = this.id;
      socket.dataset.portId = output.id;
      socket.dataset.isOutput = 'true';
      socket.title = `Output: ${output.label} (Drag to connect)`;

      const label = document.createElement('span');
      label.className = 'text-[8.5px] font-mono text-cream/50 pointer-events-none';
      label.textContent = output.label;

      item.appendChild(socket);
      item.appendChild(label);
      outCol.appendChild(item);
    });

    socketsRow.appendChild(inCol);
    socketsRow.appendChild(outCol);
    node.appendChild(socketsRow);

    this.el = node;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    if (this.el) {
      this.el.style.left = `${Math.round(x)}px`;
      this.el.style.top = `${Math.round(y)}px`;
    }
  }

  getSocketPoint(portId, isOutput) {
    const socket = this.el?.querySelector(`#socket_${this.id}_${portId}`);
    if (!socket || !this.engine.viewport) {
      return {
        x: isOutput ? this.x + this.width : this.x,
        y: this.y + 110
      };
    }
    const vpRect = this.engine.viewport.getBoundingClientRect();
    const sockRect = socket.getBoundingClientRect();
    return {
      x: sockRect.left - vpRect.left + sockRect.width / 2,
      y: sockRect.top - vpRect.top + sockRect.height / 2
    };
  }

  updateMetric(val) {
    if (this.metricEl) {
      this.metricEl.textContent = val;
    }
  }
}

/**
 * 2. Dynamic Cubic Bézier Spline Cable with Kinetic Energy Pulse
 */
export class PipelineCable {
  constructor(spec, engine) {
    this.engine = engine;
    this.id = spec.id;
    this.fromNodeId = spec.fromNodeId;
    this.fromPortId = spec.fromPortId;
    this.toNodeId = spec.toNodeId;
    this.toPortId = spec.toPortId;
    this.color = spec.color || '#f4551d';
    this.progress = Math.random();
    this.speed = spec.speed || 0.005;

    this.pathEl = null;
    this.pulseEl = null;
    this.createDom();
  }

  createDom() {
    // SVG Path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.id = `cable_${this.id}`;
    path.setAttribute('class', 'cable-path');
    path.setAttribute('stroke', this.color);
    path.setAttribute('stroke-opacity', '0.75');
    path.setAttribute('data-cable-id', this.id);
    path.setAttribute('title', `Cable ${this.id} — Click to disconnect`);
    this.pathEl = path;

    // Kinetic Energy Pulse Particle
    const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulse.setAttribute('class', 'pulse-particle');
    pulse.setAttribute('r', '3.5');
    pulse.setAttribute('fill', this.color);
    pulse.setAttribute('stroke', '#ffffff');
    pulse.setAttribute('stroke-width', '1');
    this.pulseEl = pulse;

    // Click to disconnect
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      this.engine.disconnect(this.id);
    });

    path.addEventListener('pointerenter', () => {
      if (this.engine.sfx) this.engine.sfx.tick();
    });
  }

  updatePath() {
    const fromNode = this.engine.nodes.get(this.fromNodeId);
    const toNode = this.engine.nodes.get(this.toNodeId);
    if (!fromNode || !toNode || !this.pathEl) return;

    const p1 = fromNode.getSocketPoint(this.fromPortId, true);
    const p2 = toNode.getSocketPoint(this.toPortId, false);

    // Smooth Cubic Bézier Tangent Calculation
    const dx = Math.max(45, Math.abs(p2.x - p1.x) * 0.55);
    const d = `M ${p1.x},${p1.y} C ${p1.x + dx},${p1.y} ${p2.x - dx},${p2.y} ${p2.x},${p2.y}`;
    this.pathEl.setAttribute('d', d);

    this.updatePulse();
  }

  updatePulse() {
    if (!this.pulseEl || !this.pathEl) return;
    try {
      const len = this.pathEl.getTotalLength();
      if (!len || isNaN(len)) return;

      this.progress = (this.progress + this.speed) % 1;
      const pt = this.pathEl.getPointAtLength(this.progress * len);
      this.pulseEl.setAttribute('cx', pt.x);
      this.pulseEl.setAttribute('cy', pt.y);
    } catch {
      // Path calculation fallback
    }
  }

  surge() {
    this.speed = 0.025;
    setTimeout(() => {
      this.speed = 0.005;
    }, 1200);
  }
}

/**
 * 3. Master Blueprint Pipeline Engine
 */
export class BlueprintPipelineEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.sfx = options.sfx || null;

    this.viewport = this.container.querySelector('.pipeline-viewport');
    this.svgCablesLayer = this.container.querySelector('#pipelineCablesLayer');
    this.svgPulsesLayer = this.container.querySelector('#pipelinePulsesLayer');
    this.rubberbandPath = this.container.querySelector('#pipelineRubberband');

    this.nodes = new Map();
    this.cables = [];
    this.draggingNode = null;
    this.dragOffset = { x: 0, y: 0 };
    this.activePatch = null;

    // Telemetry readouts
    this.nodeCountEl = document.getElementById('pipelineNodeCount');
    this.cableCountEl = document.getElementById('pipelineCableCount');
    this.busRateEl = document.getElementById('pipelineBusRate');
    this.quorumStatusEl = document.getElementById('pipelineQuorumStatus');

    this.init();
  }

  init() {
    this.bindViewportEvents();
    this.bindToolbarEvents();
    this.loadDefaultTopology();
    this.startLoop();
  }

  loadDefaultTopology() {
    this.clear();

    const isMobile = window.innerWidth < 768;

    // 1. Ingest Sensor Node
    this.addNode({
      id: 'ND-01',
      type: 'ingest',
      title: 'TELEMETRY INGEST STREAM',
      tag: 'SOURCE // A-01',
      color: '#f4551d',
      x: 35,
      y: 40,
      width: 200,
      inputs: [],
      outputs: [
        { id: 'raw', label: 'RAW_DATA' },
        { id: 'clk', label: 'SYNC_CLK' }
      ],
      metricLabel: 'STREAM RATE',
      metricValue: '128.4k ops/s'
    });

    // 2. Threshold Gate Filter Node
    this.addNode({
      id: 'ND-02',
      type: 'filter',
      title: 'THRESHOLD SIGNAL GATE',
      tag: 'FILTER // B-02',
      color: '#f59e0b',
      x: isMobile ? 40 : 280,
      y: isMobile ? 210 : 30,
      width: 200,
      inputs: [
        { id: 'stream_in', label: 'RAW_STREAM' }
      ],
      outputs: [
        { id: 'clean', label: 'FILTERED' },
        { id: 'alarm', label: 'OVERLOAD' }
      ],
      metricLabel: 'GATE PASS',
      metricValue: '94.2% PASS'
    });

    // 3. FFT Quantizer Node
    this.addNode({
      id: 'ND-03',
      type: 'transform',
      title: 'SPECTRAL FFT QUANTIZER',
      tag: 'DSP // C-03',
      color: '#06b6d4',
      x: isMobile ? 40 : 280,
      y: isMobile ? 380 : 220,
      width: 200,
      inputs: [
        { id: 'in_sig', label: 'IN_SIG' },
        { id: 'in_clk', label: 'CLK_REF' }
      ],
      outputs: [
        { id: 'fft_out', label: 'FFT_BINS' }
      ],
      metricLabel: 'NYQUIST BIN',
      metricValue: '1024 BINS'
    });

    // 4. Multi-Thread Cluster Dispatcher
    this.addNode({
      id: 'ND-04',
      type: 'isolate',
      title: 'ISOLATE WORKER CLUSTER',
      tag: 'DISPATCH // D-04',
      color: '#10b981',
      x: isMobile ? 40 : 530,
      y: isMobile ? 550 : 60,
      width: 210,
      inputs: [
        { id: 'tasks_in', label: 'PAYLOAD_IN' }
      ],
      outputs: [
        { id: 'quorum', label: 'QUORUM_SYNC' }
      ],
      metricLabel: 'CORE LOAD',
      metricValue: '8 CORES 68%'
    });

    // 5. Persistent Ledger Sink Node
    this.addNode({
      id: 'ND-05',
      type: 'sink',
      title: 'COLD TELEMETRY LAKE',
      tag: 'PERSIST // E-05',
      color: '#a855f7',
      x: isMobile ? 40 : 780,
      y: isMobile ? 720 : 120,
      width: 210,
      inputs: [
        { id: 'stream_a', label: 'QUORUM_IN' },
        { id: 'stream_b', label: 'SPECTRUM_IN' }
      ],
      outputs: [
        { id: 'ack', label: 'ACK_LEDGER' }
      ],
      metricLabel: 'DROP RATIO',
      metricValue: '0.000% LOSS'
    });

    // Establish Default Circuit Cables
    this.connect('ND-01', 'raw', 'ND-02', 'stream_in', '#f4551d');
    this.connect('ND-01', 'clk', 'ND-03', 'in_clk', '#06b6d4');
    this.connect('ND-02', 'clean', 'ND-04', 'tasks_in', '#f59e0b');
    this.connect('ND-03', 'fft_out', 'ND-05', 'stream_b', '#06b6d4');
    this.connect('ND-04', 'quorum', 'ND-05', 'stream_a', '#10b981');

    this.updateTelemetryReadout();
  }

  addNode(spec) {
    const node = new PipelineNode(spec, this);
    this.nodes.set(node.id, node);
    this.viewport?.appendChild(node.el);
    this.bindNodeEvents(node);
    this.updateTelemetryReadout();
    return node;
  }

  connect(fromNodeId, fromPortId, toNodeId, toPortId, color) {
    const cableId = `${fromNodeId}_${fromPortId}_to_${toNodeId}_${toPortId}`;
    if (this.cables.some(c => c.id === cableId)) return null;

    const sourceNode = this.nodes.get(fromNodeId);
    const cableColor = color || sourceNode?.color || '#f4551d';

    const cable = new PipelineCable({
      id: cableId,
      fromNodeId,
      fromPortId,
      toNodeId,
      toPortId,
      color: cableColor
    }, this);

    this.cables.push(cable);
    this.svgCablesLayer?.appendChild(cable.pathEl);
    this.svgPulsesLayer?.appendChild(cable.pulseEl);

    cable.updatePath();
    this.updateTelemetryReadout();
    return cable;
  }

  disconnect(cableId) {
    const idx = this.cables.findIndex(c => c.id === cableId);
    if (idx === -1) return;

    const cable = this.cables[idx];
    if (cable.pathEl?.parentNode) cable.pathEl.parentNode.removeChild(cable.pathEl);
    if (cable.pulseEl?.parentNode) cable.pulseEl.parentNode.removeChild(cable.pulseEl);

    this.cables.splice(idx, 1);
    if (this.sfx) this.sfx.modalClose();
    this.updateTelemetryReadout();
  }

  clear() {
    this.cables.forEach(c => {
      if (c.pathEl?.parentNode) c.pathEl.parentNode.removeChild(c.pathEl);
      if (c.pulseEl?.parentNode) c.pulseEl.parentNode.removeChild(c.pulseEl);
    });
    this.cables = [];

    this.nodes.forEach(n => {
      if (n.el?.parentNode) n.el.parentNode.removeChild(n.el);
    });
    this.nodes.clear();
  }

  bindNodeEvents(node) {
    // Node Dragging pointer handler
    node.el.addEventListener('pointerdown', (e) => {
      if (e.target.classList.contains('node-socket')) return;
      e.preventDefault();

      this.draggingNode = node;
      node.el.classList.add('dragging');
      if (this.sfx) this.sfx.tick();

      const vpRect = this.viewport.getBoundingClientRect();
      this.dragOffset = {
        x: (e.clientX - vpRect.left) - node.x,
        y: (e.clientY - vpRect.top) - node.y
      };

      node.el.setPointerCapture(e.pointerId);
    });

    node.el.addEventListener('pointermove', (e) => {
      if (this.draggingNode !== node) return;
      const vpRect = this.viewport.getBoundingClientRect();
      const newX = Math.max(10, Math.min(vpRect.width - node.width - 10, (e.clientX - vpRect.left) - this.dragOffset.x));
      const newY = Math.max(10, Math.min(vpRect.height - node.height - 10, (e.clientY - vpRect.top) - this.dragOffset.y));

      node.updatePosition(newX, newY);
      this.renderCables();
    });

    const stopDrag = (e) => {
      if (this.draggingNode === node) {
        node.el.classList.remove('dragging');
        this.draggingNode = null;
        if (node.el.hasPointerCapture(e.pointerId)) {
          node.el.releasePointerCapture(e.pointerId);
        }
      }
    };

    node.el.addEventListener('pointerup', stopDrag);
    node.el.addEventListener('pointercancel', stopDrag);

    // Socket Patching Events
    node.el.querySelectorAll('.out-socket').forEach(socket => {
      socket.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();

        const nodeId = socket.dataset.nodeId;
        const portId = socket.dataset.portId;
        const pt = node.getSocketPoint(portId, true);

        this.activePatch = {
          fromNodeId: nodeId,
          fromPortId: portId,
          startX: pt.x,
          startY: pt.y,
          color: node.color
        };

        if (this.rubberbandPath) {
          this.rubberbandPath.setAttribute('stroke', node.color);
          this.rubberbandPath.classList.remove('hidden');
        }

        if (this.sfx) this.sfx.tick();
      });
    });
  }

  bindViewportEvents() {
    if (!this.viewport) return;

    // Viewport dragging for Rubberband Spline
    this.viewport.addEventListener('pointermove', (e) => {
      if (!this.activePatch || !this.rubberbandPath) return;

      const vpRect = this.viewport.getBoundingClientRect();
      const currentX = e.clientX - vpRect.left;
      const currentY = e.clientY - vpRect.top;

      const p1 = { x: this.activePatch.startX, y: this.activePatch.startY };
      const p2 = { x: currentX, y: currentY };
      const dx = Math.max(40, Math.abs(p2.x - p1.x) * 0.55);

      const d = `M ${p1.x},${p1.y} C ${p1.x + dx},${p1.y} ${p2.x - dx},${p2.y} ${p2.x},${p2.y}`;
      this.rubberbandPath.setAttribute('d', d);

      const hoverEl = document.elementFromPoint(e.clientX, e.clientY);
      const inSocket = hoverEl?.closest('.in-socket');

      this.viewport.querySelectorAll('.in-socket').forEach(s => s.classList.remove('snap-active'));
      if (inSocket && inSocket.dataset.nodeId !== this.activePatch.fromNodeId) {
        inSocket.classList.add('snap-active');
      }
    });

    const finishPatch = (e) => {
      if (!this.activePatch) return;

      const hoverEl = document.elementFromPoint(e.clientX, e.clientY);
      const inSocket = hoverEl?.closest('.in-socket');

      if (inSocket && inSocket.dataset.nodeId !== this.activePatch.fromNodeId) {
        const toNodeId = inSocket.dataset.nodeId;
        const toPortId = inSocket.dataset.portId;

        this.connect(
          this.activePatch.fromNodeId,
          this.activePatch.fromPortId,
          toNodeId,
          toPortId,
          this.activePatch.color
        );

        if (this.sfx) this.sfx.click();
      }

      this.viewport.querySelectorAll('.in-socket').forEach(s => s.classList.remove('snap-active'));
      if (this.rubberbandPath) this.rubberbandPath.classList.add('hidden');
      this.activePatch = null;
    };

    this.viewport.addEventListener('pointerup', finishPatch);
    this.viewport.addEventListener('pointercancel', finishPatch);
  }

  bindToolbarEvents() {
    // Add Node Button
    const addBtn = document.getElementById('pipelineAddNodeBtn');
    let nextNodeIdx = 6;
    addBtn?.addEventListener('click', () => {
      if (this.sfx) this.sfx.click();
      const id = `ND-0${nextNodeIdx++}`;
      const types = [
        { type: 'buffer', title: 'DYNAMIC RING BUFFER', tag: 'CACHE', color: '#ec4899', mLabel: 'CAPACITY', mVal: '4.8 MB / 8 MB' },
        { type: 'crc', title: 'CRC32 INTEGRITY CHECK', tag: 'CHECKSUM', color: '#38bdf8', mLabel: 'PARITY', mVal: '0xFA88C291' },
        { type: 'rate', title: 'LEAKY BUCKET LIMITER', tag: 'THROTTLE', color: '#eab308', mLabel: 'LIMIT', mVal: '500 ops/burst' }
      ];
      const template = types[(nextNodeIdx - 7) % types.length];

      this.addNode({
        id,
        type: template.type,
        title: template.title,
        tag: `${template.tag} // ${id}`,
        color: template.color,
        x: 100 + Math.random() * 250,
        y: 60 + Math.random() * 160,
        width: 210,
        inputs: [{ id: 'in_data', label: 'DATA_IN' }],
        outputs: [{ id: 'out_data', label: 'DATA_OUT' }],
        metricLabel: template.mLabel,
        metricValue: template.mVal
      });

      this.renderCables();
    });

    // Auto Layout Button
    const autoLayoutBtn = document.getElementById('pipelineAutoLayoutBtn');
    autoLayoutBtn?.addEventListener('click', () => {
      if (this.sfx) this.sfx.click();
      this.autoLayout();
    });

    // Pulse Burst Button
    const pulseBurstBtn = document.getElementById('pipelinePulseBurstBtn');
    pulseBurstBtn?.addEventListener('click', () => {
      if (this.sfx) this.sfx.telemetry();
      this.triggerPulseBurst();
    });

    // Reset Graph Button
    const resetBtn = document.getElementById('pipelineResetBtn');
    resetBtn?.addEventListener('click', () => {
      if (this.sfx) this.sfx.modalClose();
      this.loadDefaultTopology();
      this.renderCables();
    });
  }

  autoLayout() {
    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? [40, 40, 40, 40, 40] : [40, 290, 540, 790, 1040];
    const nodeArr = Array.from(this.nodes.values());

    nodeArr.forEach((node, idx) => {
      const targetX = cols[idx % cols.length];
      const targetY = isMobile ? 30 + idx * 170 : 40 + (idx % 2 === 1 ? 160 : 30);
      node.updatePosition(targetX, targetY);
    });

    this.renderCables();
  }

  triggerPulseBurst() {
    this.cables.forEach(cable => cable.surge());
    if (this.busRateEl) {
      this.busRateEl.textContent = '148.6 MB/s';
      setTimeout(() => {
        if (this.busRateEl) this.busRateEl.textContent = '48.2 MB/s';
      }, 1500);
    }
  }

  renderCables() {
    this.cables.forEach(cable => cable.updatePath());
  }

  updateTelemetryReadout() {
    if (this.nodeCountEl) this.nodeCountEl.textContent = `${this.nodes.size} NODES`;
    if (this.cableCountEl) this.cableCountEl.textContent = `${this.cables.length} WIRES`;
    if (this.quorumStatusEl) {
      this.quorumStatusEl.textContent = this.cables.length >= 4 ? 'TOPOLOGY STABLE' : 'PARTIAL TOPOLOGY';
      this.quorumStatusEl.className = this.cables.length >= 4 
        ? 'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        : 'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber/20 text-amber border border-amber/40';
    }
  }

  startLoop() {
    let lastMetricTick = Date.now();
    const step = () => {
      this.cables.forEach(c => c.updatePulse());

      const now = Date.now();
      if (now - lastMetricTick > 800) {
        lastMetricTick = now;
        const n1 = this.nodes.get('ND-01');
        if (n1) n1.updateMetric(`${(120 + (Math.random() * 12)).toFixed(1)}k ops/s`);

        const n4 = this.nodes.get('ND-04');
        if (n4) n4.updateMetric(`8 CORES ${Math.round(62 + Math.random() * 15)}%`);
      }

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/**
 * Section 12 Main Initializer
 */
export function initBlueprintPipeline(options = {}) {
  return new BlueprintPipelineEngine('pipelineContainer', options);
}
