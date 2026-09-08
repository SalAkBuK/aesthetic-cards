import { animate, inView, stagger } from 'motion';
import { sfx } from './audio.js';
import { initHeroRadar } from './radar.js';

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
      tag: 'DOSSIER // SMART ACTIONS',
      title: 'Smart Actions Engine',
      desc: 'Deterministic tool-use orchestration with sub-millisecond dispatch and strict state verification.',
      specs: [
        { key: 'PROTOCOL', value: 'gRPC / HTTP3 Streaming' },
        { key: 'DISPATCH LATENCY', value: '0.42ms (p99)' },
        { key: 'IDEMPOTENCY GUARANTEE', value: 'Strict Two-Phase Commit' },
        { key: 'CONCURRENCY LIMIT', value: '64,000 workers / node' },
      ],
      code: {
        ts: `import { Kinetic } from '@kinetic/sdk';

const kinetic = new Kinetic({ apiKey: process.env.KINETIC_KEY });

// Execute verified transaction with automatic guardrails
const result = await kinetic.actions.execute({
  action: 'refund.process',
  params: {
    customerId: 'cus_941a8',
    amount: 4900,
    currency: 'USD',
    reason: 'service_credit'
  },
  guardrails: {
    maxThreshold: 10000,
    requireIdempotency: true
  }
});

console.log('Action State:', result.state); // 'RESOLVED'`,
        py: `from kinetic import Kinetic
import os

client = Kinetic(api_key=os.environ["KINETIC_KEY"])

# Execute verified action
result = client.actions.execute(
    action="refund.process",
    params={
        "customer_id": "cus_941a8",
        "amount": 4900,
        "currency": "USD"
    },
    guardrails={"max_threshold": 10000, "require_idempotency": True}
)

print(f"Action Status: {result.status}")`,
        curl: `curl -X POST https://api.kinetic.dev/v1/actions/execute \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "refund.process",
    "params": {
      "customerId": "cus_941a8",
      "amount": 4900,
      "currency": "USD"
    },
    "guardrails": { "requireIdempotency": true }
  }'`
      },
      simOutput: {
        status: 'RESOLVED',
        transaction_id: 'tx_984fbc71a02',
        execution_time_ms: 0.42,
        idempotency_key: 'idemp_3490b8f',
        guardrails_verified: true,
        audit_hash: '0x8f2a...e41c'
      }
    },
    2: {
      index: '002',
      tag: 'DOSSIER // AUTO-RESOLVE',
      title: 'Auto-Resolve Deflection Gateway',
      desc: 'Autonomous ticket & intent resolution using verified policy bounds with human-in-the-loop fallback.',
      specs: [
        { key: 'POLICY ENGINE', value: 'Open Policy Agent (Rego / WASM)' },
        { key: 'CONFIDENCE THRESHOLD', value: '>= 98.4% (Autonomous)' },
        { key: 'FALLBACK ROUTE', value: 'Instant Human Escalation (<100ms)' },
        { key: 'DEFLECTION RATE', value: '74.2% Avg Production' },
      ],
      code: {
        ts: `// Evaluate incoming ticket against compiled policy rules
const evaluation = await kinetic.autoResolve.evaluate({
  ticketId: 'tkt_7721',
  intent: 'plan_downgrade',
  userTier: 'enterprise',
  sentimentScore: 0.88
});

if (evaluation.canAutoResolve) {
  await evaluation.applyResolution({ notifyCustomer: true });
}`,
        py: `evaluation = client.auto_resolve.evaluate(
    ticket_id="tkt_7721",
    intent="plan_downgrade",
    user_tier="enterprise",
    sentiment_score=0.88
)

if evaluation.can_auto_resolve:
    evaluation.apply_resolution(notify_customer=True)`,
        curl: `curl -X POST https://api.kinetic.dev/v1/resolve/evaluate \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{"ticketId": "tkt_7721", "intent": "plan_downgrade"}'`
      },
      simOutput: {
        canAutoResolve: true,
        policy_id: 'pol_enterprise_downgrade_v4',
        confidence: 0.992,
        applied_guardrail: 'RETENTION_OFFER_APPLIED',
        resolution_state: 'SUCCESS'
      }
    },
    3: {
      index: '003',
      tag: 'DOSSIER // AGENT ASSIST',
      title: 'Agent Assist Co-Pilot',
      desc: 'Context-injected macro recommendations, brand-tone adherence, and citation validation.',
      specs: [
        { key: 'EMBEDDING DIMENSION', value: '1536-Dimensional Vector Space' },
        { key: 'CONTEXT CACHE', value: 'Prefix-Cached (0ms Cold Start)' },
        { key: 'CITATION RECALL', value: '99.8% Ground Truth Alignment' },
        { key: 'LATENCY', value: '120ms Time-To-First-Token' },
      ],
      code: {
        ts: `const stream = await kinetic.assist.generateSuggestions({
  conversationId: 'conv_84920',
  brandGuidelines: 'strict_concise',
  requireCitations: true
});

for await (const token of stream) {
  process.stdout.write(token.delta);
}`,
        py: `stream = client.assist.generate_suggestions(
    conversation_id="conv_84920",
    brand_guidelines="strict_concise",
    require_citations=True
)

for token in stream:
    print(token.delta, end="", flush=True)`,
        curl: `curl -N https://api.kinetic.dev/v1/assist/stream \\
  -H "Authorization: Bearer $KINETIC_KEY" \\
  -d '{"conversationId": "conv_84920"}'`
      },
      simOutput: {
        suggested_reply: 'Your subscription renewal has been updated with the 20% annual discount applied.',
        citations: ['kb_billing_faq_p14', 'policy_annual_discount_v2'],
        brand_tone_score: 0.98
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

// Initialize 3D Hero Radar
initHeroRadar('heroRadarCanvas', { sfx });
