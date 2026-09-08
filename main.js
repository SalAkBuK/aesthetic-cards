import { animate, inView, stagger } from 'motion';
import { sfx } from './audio.js';
import { initHeroRadar } from './radar.js';
import { initOscilloscope } from './oscilloscope.js';
import { initThemeEngine } from './theme.js';
import { downloadCompleteZip } from './exporter.js';

// Initialize Theme & CRT Engine
const themeEngine = initThemeEngine({ sfx });
sfx.attachListeners();

// Motion.dev — https://motion.dev
// Animation choices follow the design-engineering rules:
// enter/exit = ease-out, UI durations under 300ms, transform/opacity only,
// nothing scales in from 0, hover gated behind a fine-pointer media query.

const EASE_OUT = [0.23, 1, 0.32, 1];
const EASE_IN_OUT = [0.77, 0, 0.175, 1];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

document.documentElement.classList.add('js');

/* ------------------------------------------------------------------ *
 * Build the woven triangle fan (card 002)
 * ------------------------------------------------------------------ */
const APEX = { x: 100, y: 32 };
const BL = { x: 28, y: 168 };
const BR = { x: 172, y: 168 };

function lerp(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const fan = document.querySelector('.fan');
if (fan) {
  const STEPS = 13;
  const svgNS = 'http://www.w3.org/2000/svg';
  for (let i = 1; i <= STEPS; i++) {
    const t = i / (STEPS + 1);
    // left corner -> points on the right edge, and mirrored
    const pairs = [
      [BL, lerp(APEX, BR, t)],
      [BR, lerp(APEX, BL, t)],
    ];
    for (const [from, to] of pairs) {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', from.x);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y);
      line.classList.add('fan-line');
      fan.appendChild(line);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Park the divider nodes on the seam between the two blocks
 * ------------------------------------------------------------------ */
function placeNodes() {
  document.querySelectorAll('[data-card]').forEach((card) => {
    const node = card.querySelector('.node');
    const blocks = card.querySelectorAll('.card > .block');
    if (!node || blocks.length < 2) return;
    const cardTop = card.getBoundingClientRect().top;
    // Centre of the seam between the media block and the caption block.
    const seam =
      (blocks[0].getBoundingClientRect().bottom + blocks[1].getBoundingClientRect().top) / 2;
    node.style.top = `${seam - cardTop - node.offsetHeight / 2}px`;
  });
}
placeNodes();
window.addEventListener('resize', placeNodes, { passive: true });
if (document.fonts?.ready) document.fonts.ready.then(placeNodes);

/* ------------------------------------------------------------------ *
 * Line-art draw-on setup
 * ------------------------------------------------------------------ */
const strokes = [...document.querySelectorAll('.draw')];
const shouldDraw = !reduced.matches;
for (const el of strokes) {
  const len = Math.ceil(el.getTotalLength?.() ?? 0);
  if (!len) continue;
  el.dataset.len = String(len);
  if (shouldDraw) {
    // Attributes (not a stylesheet rule) so Motion's writes win.
    el.setAttribute('stroke-dasharray', len);
    el.setAttribute('stroke-dashoffset', len);
  }
}

run({ animate, inView, stagger });

/* ------------------------------------------------------------------ *
 * Choreography
 * ------------------------------------------------------------------ */
function run({ animate, inView, stagger }) {
  const cards = [...document.querySelectorAll('.card-shell')];
  const label = document.getElementById('label');

  if (reduced.matches) {
    // Reduced motion keeps opacity, drops all movement.
    animate('#hud', { opacity: [0, 1] }, { duration: 0.25 });
    animate('.hero-reveal', { opacity: [0, 1] }, { duration: 0.3 });
    animate(label, { opacity: [0, 1] }, { duration: 0.25 });
    animate(cards, { opacity: [0, 1] }, { duration: 0.3, delay: stagger(0.05) });
    return;
  }

  /* --- Entrance ---------------------------------------------------- */
  // 1. HUD Entrance
  animate(
    '#hud',
    { opacity: [0, 1], transform: ['translateY(-10px)', 'translateY(0px)'] },
    { duration: 0.45, ease: EASE_OUT },
  );

  // 2. Hero Elements Cascade
  animate(
    '.hero-reveal',
    { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
    { duration: 0.55, ease: EASE_OUT, delay: stagger(0.09, { startDelay: 0.1 }) },
  );

  // 3. Features Section Label
  animate(
    label,
    { opacity: [0, 1], transform: ['translateY(6px)', 'translateY(0px)'] },
    { duration: 0.4, ease: EASE_OUT, delay: 0.45 },
  );

  cards.forEach((card, i) => {
    // Cards revealed together on desktop keep a cascade; stacked on mobile each
    // one is already separated in time by the scroll itself.
    const lead = window.innerWidth >= 640 ? (i % 3) * 0.07 : 0;

    inView(
      card,
      () => {
        animate(
          card,
          { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
          { duration: 0.5, ease: EASE_OUT, delay: lead },
        );

        const base = lead + 0.12;

        card.querySelectorAll('.draw').forEach((p, j) => {
          animate(
            p,
            { strokeDashoffset: [Number(p.dataset.len ?? 0), 0] },
            { duration: 0.9, ease: EASE_IN_OUT, delay: base + j * 0.06 },
          );
        });

        const signs = card.querySelectorAll('.sign');
        if (signs.length) {
          animate(
            signs,
            { opacity: [0, 1] },
            { duration: 0.35, ease: EASE_OUT, delay: stagger(0.05, { startDelay: base + 0.35 }) },
          );
        }

        const fanLines = card.querySelectorAll('.fan-line');
        if (fanLines.length) {
          animate(
            fanLines,
            { opacity: [0, 0.85] },
            { duration: 0.5, ease: EASE_OUT, delay: stagger(0.012, { startDelay: base + 0.15 }) },
          );
        }

        const hatch = card.querySelector('.hatch');
        if (hatch) {
          animate(hatch, { opacity: [0, 0.9] }, { duration: 0.45, ease: EASE_OUT, delay: base + 0.5 });
        }

        const signalDots = card.querySelectorAll('.signal-dot');
        if (signalDots.length) {
          animate(
            signalDots,
            { opacity: [0, 1] },
            { duration: 0.35, ease: EASE_OUT, delay: stagger(0.04, { startDelay: base + 0.3 }) },
          );
        }

        const blips = card.querySelectorAll('.blip-node');
        if (blips.length) {
          animate(
            blips,
            { opacity: [0, 1] },
            { duration: 0.4, ease: EASE_OUT, delay: stagger(0.06, { startDelay: base + 0.4 }) },
          );
        }

        const guardCore = card.querySelector('.guard-core');
        if (guardCore) {
          animate(
            guardCore,
            { opacity: [0, 1] },
            { duration: 0.35, ease: EASE_OUT, delay: base + 0.45 },
          );
        }
      },
      { amount: 0.15, margin: '0px 0px -10% 0px' },
    );
  });

  /* --- Hover / press ------------------------------------------------ */
  // Only the state flag lives here; the motion itself is CSS (see index.html).
  cards.forEach((shell) => {
    if (canHover.matches) {
      shell.addEventListener('pointerenter', () => {
        sfx.tick();
        shell.classList.add('is-hover');
      });
      shell.addEventListener('pointerleave', () => shell.classList.remove('is-hover'));
    }

    const release = () => shell.classList.remove('is-press');
    shell.addEventListener('pointerdown', () => shell.classList.add('is-press'));
    shell.addEventListener('pointerup', release);
    shell.addEventListener('pointercancel', release);
    shell.addEventListener('pointerleave', release);
  });

  /* --- CLI Copy Button --- */
  const copyCliBtn = document.getElementById('copyCliBtn');
  if (copyCliBtn) {
    copyCliBtn.addEventListener('click', () => {
      sfx.success();
      const text = document.getElementById('curlSnippet')?.textContent?.trim() || 'curl -fsSL https://get.kinetic.dev | sh';
      navigator.clipboard?.writeText(text).then(() => {
        copyCliBtn.innerHTML = `<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>`;
        setTimeout(() => {
          copyCliBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>`;
        }, 1800);
      });
    });
  }

  /* --- Simulated Latency Ticker --- */
  const latencyEl = document.getElementById('hudLatency');
  if (latencyEl) {
    setInterval(() => {
      const ping = Math.floor(9 + Math.random() * 6);
      latencyEl.textContent = `${ping}ms`;
    }, 3800);
  }

  /* --- Technical Dossier Modal Logic --- */
  const DOSSIERS = {
    1: {
      index: '001',
      tag: 'DOSSIER // DETERMINISTIC KERNEL',
      title: 'Deterministic Kernel Engine',
      desc: 'Sub-millisecond signal routing, runtime guardrails, and atomic state transitions.',
      specs: [
        { key: 'PROTOCOL', value: 'gRPC / HTTP3 Streaming' },
        { key: 'DISPATCH LATENCY', value: '0.42ms (p99)' },
        { key: 'IDEMPOTENCY GUARANTEE', value: 'Strict Two-Phase Commit' },
        { key: 'CONCURRENCY LIMIT', value: '64,000 workers / node' },
      ],
      code: {
        ts: `import { Kinetic } from '@kinetic/sdk';

const kinetic = new Kinetic({ apiKey: process.env.KINETIC_KEY });

// Execute verified atomic kernel dispatch with runtime guardrails
const result = await kinetic.kernel.dispatch({
  signal: 'kernel.state_transition',
  nodeId: 'node_alpha_09',
  payload: {
    epoch: 184209,
    stateVector: [0.94, 0.12, 0.88],
    commitHash: '0x8f2a49b01e4'
  },
  guardrails: {
    maxJitterMs: 0.5,
    requireQuorum: true
  }
});

console.log('Kernel State:', result.state); // 'COMMITTED'`,
        py: `from kinetic import Kinetic
import os

client = Kinetic(api_key=os.environ["KINETIC_KEY"])

# Dispatch atomic state transition
result = client.kernel.dispatch(
    signal="kernel.state_transition",
    node_id="node_alpha_09",
    payload={
        "epoch": 184209,
        "state_vector": [0.94, 0.12, 0.88],
        "commit_hash": "0x8f2a49b01e4",
    },
    guardrails={"max_jitter_ms": 0.5, "require_quorum": True},
)

print(f"Kernel Status: {result.status}")`,
        curl: `curl -X POST https://api.kinetic.dev/v1/kernel/dispatch \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signal": "kernel.state_transition",
    "nodeId": "node_alpha_09",
    "payload": {
      "epoch": 184209,
      "stateVector": [0.94, 0.12, 0.88]
    },
    "guardrails": { "requireQuorum": true }
  }'`
      },
      simOutput: {
        status: 'COMMITTED',
        epoch: 184209,
        dispatch_latency_ms: 0.38,
        quorum_verified: true,
        guardrails_passed: true,
        consensus_hash: '0x9e12...77bb'
      }
    },
    2: {
      index: '002',
      tag: 'DOSSIER // STREAM PIPELINE',
      title: 'Stream Pipeline Ingestion Engine',
      desc: 'Continuous event ingestion, zero-drop backpressure buffers, and real-time fault detection.',
      specs: [
        { key: 'INGESTION RATE', value: '4.8M events/sec' },
        { key: 'BUFFER TOPOLOGY', value: 'Ring Buffer / Zero-Copy Memory' },
        { key: 'BACKPRESSURE DROP', value: '0.000% Guaranteed' },
        { key: 'FAULT TOLERANCE', value: 'Sub-10ms Active-Active Failover' },
      ],
      code: {
        ts: `import { Kinetic } from '@kinetic/sdk';

const kinetic = new Kinetic({ apiKey: process.env.KINETIC_KEY });

// Connect to real-time ingestion pipeline with backpressure buffer
const pipeline = await kinetic.pipeline.stream({
  channel: 'telemetry.signals',
  bufferStrategy: 'ring-zero-copy',
  maxBatchSize: 10000,
  onBackpressure: 'throttle-source'
});

pipeline.on('event', (batch) => {
  console.log(\`Ingested \${batch.length} events with zero drop\`);
});`,
        py: `from kinetic import Kinetic
import os

client = Kinetic(api_key=os.environ["KINETIC_KEY"])

pipeline = client.pipeline.stream(
    channel="telemetry.signals",
    buffer_strategy="ring-zero-copy",
    max_batch_size=10000,
    on_backpressure="throttle-source",
)

for batch in pipeline:
    print(f"Ingested {len(batch)} events without drop")`,
        curl: `curl -N https://api.kinetic.dev/v1/pipeline/stream \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{"channel": "telemetry.signals", "bufferStrategy": "ring-zero-copy"}'`
      },
      simOutput: {
        pipeline_status: 'HEALTHY',
        events_per_second: 4820000,
        buffer_saturation: '12.4%',
        dropped_frames: 0,
        jitter_p99_us: 18
      }
    },
    3: {
      index: '003',
      tag: 'DOSSIER // TELEMETRY MESH',
      title: 'Distributed Telemetry Mesh',
      desc: 'Distributed node discovery, peer-to-peer gossip protocol, and verifiable state proofs.',
      specs: [
        { key: 'GOSSIP PROTOCOL', value: 'SWIM + Epidemic Dissemination' },
        { key: 'TOPOLOGY DISCOVERY', value: '< 25ms Convergence' },
        { key: 'PROOF MECHANISM', value: 'Merkle Mountain Range (MMR)' },
        { key: 'CLUSTER CAPACITY', value: '10,000+ Edge Nodes' },
      ],
      code: {
        ts: `import { Kinetic } from '@kinetic/sdk';

const kinetic = new Kinetic({ apiKey: process.env.KINETIC_KEY });

// Join peer-to-peer mesh and listen for gossip state updates
const mesh = await kinetic.mesh.join({
  clusterId: 'kinetic-prod-mesh',
  gossipIntervalMs: 50,
  verifyProofs: true
});

mesh.on('stateProof', (proof) => {
  console.log('Verified state proof from node:', proof.nodeId);
});`,
        py: `from kinetic import Kinetic
import os

client = Kinetic(api_key=os.environ["KINETIC_KEY"])

mesh = client.mesh.join(
    cluster_id="kinetic-prod-mesh",
    gossip_interval_ms=50,
    verify_proofs=True,
)

for proof in mesh.proofs():
    print(f"Verified state proof from node: {proof.node_id}")`,
        curl: `curl -N https://api.kinetic.dev/v1/mesh/peers \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{"clusterId": "kinetic-prod-mesh"}'`
      },
      simOutput: {
        mesh_status: 'CONVERGED',
        peer_count: 1024,
        gossip_round: 48920,
        merkle_root: '0x3c89...bf10',
        convergence_time_ms: 18.4
      }
    },
    4: {
      index: '004',
      tag: 'DOSSIER // SIGNAL ROUTING',
      title: 'Signal Routing & Priority Queue',
      desc: 'Weighted priority triage, cross-region mesh dispatch, and sub-millisecond worker routing.',
      specs: [
        { key: 'TOPOLOGY', value: 'Global Anycast Mesh' },
        { key: 'QUEUE CAPACITY', value: '1.2M Pending Concurrent Tasks' },
        { key: 'DISPATCH JITTER', value: '< 0.05ms' },
        { key: 'FAILOVER TIME', value: '12ms Auto-Recovery' },
      ],
      code: {
        ts: `await kinetic.router.dispatch({
  signalId: 'sig_voice_input_04',
  priority: 'URGENT',
  affinity: 'geo_nearest',
  maxLatencyBudgetMs: 50
});`,
        py: `client.router.dispatch(
    signal_id="sig_voice_input_04",
    priority="URGENT",
    affinity="geo_nearest",
    max_latency_budget_ms=50
)`,
        curl: `curl -X POST https://api.kinetic.dev/v1/router/dispatch \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{"priority": "URGENT", "maxLatencyBudgetMs": 50}'`
      },
      simOutput: {
        dispatched_to: 'worker_node_iad_09',
        hop_count: 1,
        routing_latency_ms: 0.18,
        queue_position: 0
      }
    },
    5: {
      index: '005',
      tag: 'DOSSIER // NEURAL SEARCH',
      title: 'Neural Hybrid Retrieval',
      desc: 'Sparse-dense hybrid vector indexing with sub-ms reciprocal rank fusion across enterprise knowledge.',
      specs: [
        { key: 'VECTOR INDEX', value: 'HNSW (M=16, efConstruction=200)' },
        { key: 'SPARSE INDEX', value: 'BM25 Okapi with Term Proximity' },
        { key: 'FUSION METHOD', value: 'Reciprocal Rank Fusion (RRF k=60)' },
        { key: 'SEARCH SPEED', value: '0.68ms Average' },
      ],
      code: {
        ts: `const results = await kinetic.search.query({
  query: 'SOC2 compliant data retention policies',
  topK: 3,
  hybridAlpha: 0.75, // 75% semantic, 25% keyword
  filter: { classification: 'internal' }
});`,
        py: `results = client.search.query(
    query="SOC2 compliant data retention policies",
    top_k=3,
    hybrid_alpha=0.75,
    filter={"classification": "internal"}
)`,
        curl: `curl -X POST https://api.kinetic.dev/v1/search/query \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{"query": "SOC2 compliance policies", "topK": 3}'`
      },
      simOutput: {
        matches_found: 3,
        top_score: 0.9412,
        latency_ms: 0.68,
        documents: ['sec_handbook_ch4.md', 'soc2_audit_2026.pdf']
      }
    },
    6: {
      index: '006',
      tag: 'DOSSIER // AUDIT & GUARDRAILS',
      title: 'Immutable Audit & Runtime Guardrails',
      desc: 'Cryptographically signed zero-knowledge proof trail with real-time PII scrubbing and policy enforcement.',
      specs: [
        { key: 'PROOF SYSTEM', value: 'ZK-STARK (Post-Quantum Resilient)' },
        { key: 'PII SCRUBBING', value: 'Zero-Retention Deterministic Redaction' },
        { key: 'SIGNATURE SCHEME', value: 'Ed25519 Elliptic Curve' },
        { key: 'AUDIT COMPLIANCE', value: 'SOC2 Type II / HIPAA / ISO 27001' },
      ],
      code: {
        ts: `const verification = await kinetic.audit.verifyTransaction({
  txHash: '0x49f82d1c...b02',
  expectedPolicyVersion: 'v2.4.1'
});

console.log('Cryptographic Proof Valid:', verification.isValid);`,
        py: `verification = client.audit.verify_transaction(
    tx_hash="0x49f82d1c...b02",
    expected_policy_version="v2.4.1"
)
print("Proof Valid:", verification.is_valid)`,
        curl: `curl https://api.kinetic.dev/v1/audit/verify/0x49f82d1c...b02 \\
  -H "Authorization: Bearer $KINETIC_KEY"`
      },
      simOutput: {
        isValid: true,
        zk_proof: '0x99482f...a10e',
        redacted_fields_count: 4,
        pii_leakage_risk: '0.0000%',
        timestamp: '2026-09-08T08:33:00Z'
      }
    },
    7: {
      index: '007',
      tag: 'DOSSIER // STATE CONSENSUS',
      title: 'State Consensus & Merkle DAG',
      desc: 'Byzantine quorum replication with zero-knowledge state commitments, Sparse Merkle Patricia Tries, and sub-millisecond finality.',
      specs: [
        { key: 'FAULT TOLERANCE', value: 'Byzantine Fault Tolerance (2f + 1)' },
        { key: 'CONSENSUS PROTOCOL', value: 'HotStuff-BFT Pipeline' },
        { key: 'STATE ACCUMULATOR', value: 'Sparse Merkle Patricia Trie' },
        { key: 'FINALITY LATENCY', value: 'Sub-Millisecond Quorum Finality (<0.4ms)' },
      ],
      code: {
        ts: `import { Kinetic } from '@kinetic/sdk';

const consensus = new Kinetic.Consensus({
  quorum: '2f_plus_1',
  protocol: 'HotStuff-BFT',
  accumulator: 'SparseMerkleTree'
});

// Commit state transition with verifiable Merkle proof
const receipt = await consensus.commitStateTransition({
  stateRoot: '0x7e1b40a...99cf',
  deltaPayload: txBatch,
  requireZKProof: true
});

console.log('Finality latency:', receipt.finalityMs); // 0.38ms`,
        py: `from kinetic import Consensus

engine = Consensus(
    quorum="2f_plus_1",
    protocol="HotStuff-BFT",
    accumulator="SparseMerkleTree"
)

receipt = engine.commit_state_transition(
    state_root="0x7e1b40a...99cf",
    delta_payload=tx_batch,
    require_zk_proof=True
)
print(f"Quorum Achieved: {receipt.quorum_achieved}")`,
        curl: `curl -X POST https://api.kinetic.dev/v1/consensus/commit \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{
    "protocol": "HotStuff-BFT",
    "quorum": "2f_plus_1",
    "stateRoot": "0x7e1b40a...99cf"
  }'`
      },
      simOutput: {
        status: 'QUORUM_COMMITTED',
        consensus_model: 'HotStuff-BFT (2f + 1)',
        validators_signed: '11/16 nodes (68.75%)',
        sparse_merkle_root: '0x7e1b40a92d1c...99cf',
        finality_latency_ms: 0.38,
        zk_stark_proof: '0x9924a...bc01 (VALID)'
      }
    },
    8: {
      index: '008',
      tag: 'DOSSIER // WAVE SYNTHESIS',
      title: 'Wave Synthesis & DSP Pipeline',
      desc: 'Precision digital signal processing engine with high-order harmonic synthesis, FFT spectral analysis, and picosecond-grade jitter stabilization.',
      specs: [
        { key: 'AUDIO PIPELINE', value: '192 kHz / 32-bit Float Audio' },
        { key: 'SPECTRAL TRANSFORM', value: '4096-Point Radix-4 FFT' },
        { key: 'PHASE JITTER', value: '< 1.4ps RMS Phase Jitter' },
        { key: 'HARMONIC TRACKING', value: 'Real-Time Dynamic Peak Locking' },
      ],
      code: {
        ts: `import { KineticDSP } from '@kinetic/dsp';

const dsp = new KineticDSP({
  sampleRate: 192000,
  bitDepth: 32,
  fftSize: 4096
});

// Run real-time harmonic FFT decomposition with jitter stabilization
const spectrum = await dsp.synthesizeHarmonics({
  fundamentalHz: 440.0,
  harmonicsCount: 16,
  jitterClockSync: 'hardware_ptp'
});

console.log('RMS Phase Jitter:', spectrum.phaseJitterPs); // 1.18ps`,
        py: `from kinetic_dsp import DSPStream

dsp = DSPStream(sample_rate=192000, bit_depth=32, fft_size=4096)

spectrum = dsp.synthesize_harmonics(
    fundamental_hz=440.0,
    harmonics_count=16,
    jitter_clock_sync="hardware_ptp"
)
print(f"FFT Peak Lock: {spectrum.peak_locked}")`,
        curl: `curl -X POST https://api.kinetic.dev/v1/dsp/synthesize \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{
    "sampleRate": 192000,
    "fftSize": 4096,
    "jitterStabilization": true
  }'`
      },
      simOutput: {
        stream_status: 'SYNCHRONIZED',
        sample_rate_khz: 192,
        bit_depth: '32-bit float',
        fft_resolution_bins: 4096,
        phase_jitter_rms_ps: 1.18,
        harmonic_thd_db: -128.4
      }
    },
    9: {
      index: '009',
      tag: 'DOSSIER // QUANTUM ENCLAVE',
      title: 'Quantum Enclave Secure Isolation',
      desc: 'Hardware security modules, memory-safe deterministic isolation, and post-quantum lattice cryptography with zero-trust enclave attestation.',
      specs: [
        { key: 'HARDWARE ISOLATION', value: 'Hardware TPM 2.0 / Nitro Hypervisor' },
        { key: 'PQC CIPHERSUITE', value: 'Kyber-1024 + Dilithium-3 Post-Quantum' },
        { key: 'MEMORY ISOLATION', value: 'Deterministic Memory Partitions' },
        { key: 'SECURITY BOUNDARY', value: 'Zero-Trust Enclave Attestation' },
      ],
      code: {
        ts: `import { QuantumEnclave } from '@kinetic/enclave';

const enclave = await QuantumEnclave.bootstrap({
  hypervisor: 'Nitro_TPM_2_0',
  cipherSuite: 'ML_KEM_1024_Kyber',
  signatureScheme: 'Dilithium_3'
});

// Execute confidential workload in isolated memory partition
const attestedReceipt = await enclave.executeConfidential({
  sealedPayload: encryptedBlob,
  verifyHardwarePcr: true
});

console.log('Enclave PCR Attested:', attestedReceipt.isVerified);`,
        py: `from kinetic_enclave import QuantumEnclave

enclave = QuantumEnclave.bootstrap(
    hypervisor="Nitro_TPM_2_0",
    cipher_suite="ML_KEM_1024_Kyber",
    signature_scheme="Dilithium_3"
)

receipt = enclave.execute_confidential(
    sealed_payload=encrypted_blob,
    verify_hardware_pcr=True
)
print(f"PQC Attested: {receipt.is_verified}")`,
        curl: `curl -X POST https://api.kinetic.dev/v1/enclave/execute \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{
    "isolation": "Nitro_TPM_2_0",
    "ciphersuite": "Kyber1024_Dilithium3",
    "verifyHardwarePcr": true
  }'`
      },
      simOutput: {
        enclave_state: 'ISOLATED_LOCKED',
        hypervisor: 'AWS Nitro / Hardware TPM 2.0',
        pqc_key_exchange: 'ML-KEM-1024 (Kyber-1024)',
        pqc_signature: 'ML-DSA-87 (Dilithium-3)',
        memory_partition_safe: true,
        attestation_pcr_match: true
      }
    }
  };

  const modal = document.getElementById('dossierModal');
  const dIndex = document.getElementById('dossierIndex');
  const dTag = document.getElementById('dossierTag');
  const dTitle = document.getElementById('dossierTitle');
  const dDesc = document.getElementById('dossierDesc');
  const dSpecs = document.getElementById('dossierSpecs');
  const dCode = document.getElementById('dossierCodeBlock');
  const closeBtn = document.getElementById('closeDossierBtn');
  const copyCodeBtn = document.getElementById('copyDossierCodeBtn');
  const copyCodeText = document.getElementById('copyCodeText');
  const runSimBtn = document.getElementById('runSimBtn');
  const simOutputBox = document.getElementById('simOutputBox');
  const simExecutionTime = document.getElementById('simExecutionTime');
  const simOutputPayload = document.getElementById('simOutputPayload');
  const tabs = document.querySelectorAll('.dossier-tab');

  let activeCardId = 1;
  let activeLang = 'ts';

  function renderDossier(id) {
    const data = DOSSIERS[id];
    if (!data) return;
    activeCardId = id;

    dIndex.textContent = data.index;
    dTag.textContent = data.tag;
    dTitle.textContent = data.title;
    dDesc.textContent = data.desc;

    // Render specs with dotted leader lines
    dSpecs.innerHTML = data.specs.map(s => `
      <div class="flex items-center justify-between gap-2">
        <span class="text-cream/60 shrink-0">${s.key}</span>
        <span class="leader h-[4px] flex-1 opacity-40"></span>
        <span class="text-cream font-semibold shrink-0">${s.value}</span>
      </div>
    `).join('');

    // Render code block
    dCode.textContent = data.code[activeLang];
    simOutputBox.classList.add('hidden');
  }

  function openDossier(id) {
    sfx.modalOpen();
    renderDossier(id);
    modal.classList.remove('hidden');
    animate(modal, { opacity: [0, 1] }, { duration: 0.25, ease: EASE_OUT });
    animate(modal.firstElementChild, { transform: ['scale(0.96) translateY(10px)', 'scale(1) translateY(0px)'] }, { duration: 0.3, ease: EASE_OUT });
  }

  function closeDossier() {
    sfx.modalClose();
    animate(modal, { opacity: [1, 0] }, { duration: 0.2, ease: EASE_OUT }).then(() => {
      modal.classList.add('hidden');
    });
  }

  // Click on card shells to open dossier
  cards.forEach((card) => {
    const id = Number(card.dataset.card);
    card.addEventListener('click', (e) => {
      // Don't trigger if user was selecting text
      if (window.getSelection()?.toString().length > 0) return;
      openDossier(id);
    });
  });

  closeBtn?.addEventListener('click', closeDossier);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeDossier();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeDossier();
    }
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sfx.click();
      tabs.forEach(t => {
        t.classList.remove('bg-white/20', 'font-medium', 'text-white');
        t.classList.add('text-white/60');
      });
      tab.classList.add('bg-white/20', 'font-medium', 'text-white');
      tab.classList.remove('text-white/60');
      activeLang = tab.dataset.lang;
      dCode.textContent = DOSSIERS[activeCardId].code[activeLang];
    });
  });

  // Copy code snippet
  copyCodeBtn?.addEventListener('click', () => {
    sfx.success();
    const code = DOSSIERS[activeCardId].code[activeLang];
    navigator.clipboard?.writeText(code).then(() => {
      copyCodeText.textContent = '✓ Copied!';
      setTimeout(() => { copyCodeText.textContent = 'Copy Snippet'; }, 2000);
    });
  });

  // Run simulation
  runSimBtn?.addEventListener('click', () => {
    sfx.telemetry();
    const data = DOSSIERS[activeCardId];
    simOutputBox.classList.remove('hidden');
    simExecutionTime.textContent = 'EXECUTING...';
    simOutputPayload.textContent = '// Sending payload to gateway...';

    setTimeout(() => {
      simExecutionTime.textContent = `LATENCY: ${data.simOutput.execution_time_ms ?? '0.42'}ms`;
      simOutputPayload.textContent = JSON.stringify(data.simOutput, null, 2);
    }, 280);
  });
}

// Initialize audio listeners
sfx.attachListeners();

// Initialize 3D Hero Radar & Acoustic Oscilloscope
const heroRadar = initHeroRadar('heroRadarCanvas', { sfx, modeBtnId: null, pingBtnId: null });
const heroOsc = initOscilloscope('heroOscCanvas', {
  sfx,
  mode: 'OSC',
  tint: 'amber',
  onMetrics: (m) => {
    if (activeSensor === 'osc') {
      if (azEl) azEl.textContent = m.peakFreq > 20 ? `f: ${m.peakFreq} Hz` : 'f: -- Hz';
      if (elEl) elEl.textContent = `Vpp: ${(m.peakV * 2.8).toFixed(2)}V`;
    }
  }
});

const tabRadar = document.getElementById('sensorTabRadar');
const tabOsc = document.getElementById('sensorTabOsc');
const canvasRadar = document.getElementById('heroRadarCanvas');
const canvasOsc = document.getElementById('heroOscCanvas');
const modeBtn = document.getElementById('radarModeBtn');
const pingBtn = document.getElementById('radarPingBtn');
const azEl = document.getElementById('radarAzimuth');
const elEl = document.getElementById('radarElevation');

let activeSensor = 'radar';
const oscModes = ['OSC', 'FFT', 'WATERFALL'];
let oscModeIdx = 0;

tabRadar?.addEventListener('click', () => {
  sfx.click();
  activeSensor = 'radar';
  canvasRadar?.classList.remove('hidden');
  canvasOsc?.classList.add('hidden');
  tabRadar.classList.add('bg-orange', 'text-near', 'font-bold');
  tabRadar.classList.remove('hover:bg-white/10', 'text-cream/70');
  tabOsc?.classList.remove('bg-orange', 'text-near', 'font-bold');
  tabOsc?.classList.add('hover:bg-white/10', 'text-cream/70');
  if (modeBtn && heroRadar) {
    modeBtn.textContent = `MODE: ${heroRadar.modes[heroRadar.currentModeIdx]}`;
  }
  if (pingBtn) pingBtn.textContent = 'PING ↵';
});

tabOsc?.addEventListener('click', () => {
  sfx.click();
  activeSensor = 'osc';
  canvasRadar?.classList.add('hidden');
  canvasOsc?.classList.remove('hidden');
  heroOsc?.resize();
  tabOsc.classList.add('bg-orange', 'text-near', 'font-bold');
  tabOsc.classList.remove('hover:bg-white/10', 'text-cream/70');
  tabRadar?.classList.remove('bg-orange', 'text-near', 'font-bold');
  tabRadar?.classList.add('hover:bg-white/10', 'text-cream/70');
  if (modeBtn) {
    modeBtn.textContent = `MODE: ${oscModes[oscModeIdx]}`;
  }
  if (pingBtn) pingBtn.textContent = 'BURST ↵';
  if (azEl) azEl.textContent = 'CH1: 1.0V';
  if (elEl) elEl.textContent = 'TIME: 1.0ms';
});

modeBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  sfx.click();
  if (activeSensor === 'radar' && heroRadar) {
    heroRadar.cycleMode();
    modeBtn.textContent = `MODE: ${heroRadar.modes[heroRadar.currentModeIdx]}`;
  } else if (activeSensor === 'osc' && heroOsc) {
    oscModeIdx = (oscModeIdx + 1) % oscModes.length;
    const nextMode = oscModes[oscModeIdx];
    heroOsc.setMode(nextMode);
    modeBtn.textContent = `MODE: ${nextMode}`;
    sfx.tick();
  }
});

pingBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (activeSensor === 'radar' && heroRadar) {
    heroRadar.triggerPing();
  } else {
    sfx.telemetry();
  }
});

// Complete Kit ZIP Downloader Triggers on Landing Page
const exportLandingKitBtn = document.getElementById('exportLandingKitBtn');
const heroDownloadKitBtn = document.getElementById('heroDownloadKitBtn');

exportLandingKitBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  downloadCompleteZip(exportLandingKitBtn, sfx);
});

heroDownloadKitBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  downloadCompleteZip(heroDownloadKitBtn, sfx);
});
