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

  // Architecture Section Entrance
  const archSec = document.getElementById('architecture');
  if (archSec && !reduced.matches) {
    inView(archSec, () => {
      animate(
        archSec,
        { opacity: [0.7, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
        { duration: 0.5, ease: EASE_OUT }
      );
    }, { amount: 0.08 });
  }

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
      const text = document.getElementById('curlSnippet')?.textContent?.trim() || 'git clone https://github.com/SalAkBuK/kinetic-ui.git';
      navigator.clipboard?.writeText(text).then(() => {
        copyCliBtn.innerHTML = `<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>`;
        setTimeout(() => {
          copyCliBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>`;
        }, 1800);
      });
    });
  }

  function makeCardCode(title, index, caption, isOrange) {
    const bg = isOrange ? 'bg-[#f4551d] text-[#16150f]' : 'bg-[#e9e2d3] text-[#16150f]';
    const mediaBg = isOrange ? 'bg-[#ea4f1a]/60' : 'bg-[#e2dac9]';
    const chamferStyle = "clipPath: 'polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px)'";
    const chamferCss = "clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px);";

    return {
      react: `import React from 'react';

// Kinetic UI // Blueprint Card Primitive (${index} — ${title})
export function FeatureCard() {
  return (
    <article className="group relative w-full max-w-sm select-none cursor-pointer">
      <div className="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
        {/* Top Media Block with 8-Point Chamfer */}
        <div 
          className="relative p-4 pb-3.5 ${bg}"
          style={{ ${chamferStyle} }}
        >
          <header className="flex items-start justify-between gap-3 pb-3">
            <h3 className="text-xl font-semibold tracking-tight">${title}</h3>
            <span className="font-mono text-[10px] opacity-45">${index}</span>
          </header>

          <div className="relative aspect-square w-full overflow-hidden rounded ${mediaBg}">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '7px 7px' }} 
            />
            {/* Corner Crop Brackets */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60" />
          </div>
        </div>

        {/* Bottom Caption Block */}
        <div 
          className="flex items-center justify-between gap-3 px-4 py-3.5 ${bg}"
          style={{ ${chamferStyle} }}
        >
          <p className="text-xs leading-relaxed opacity-90">${caption}</p>
          <div className="flex flex-col gap-1 opacity-35 shrink-0">
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
          </div>
        </div>
      </div>
    </article>
  );
}`,
      vue: `<template>
  <!-- Kinetic UI // Blueprint Card (${index} — ${title}) -->
  <article class="group relative w-full max-w-sm select-none cursor-pointer">
    <div class="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
      <div 
        class="relative p-4 pb-3.5 ${bg}"
        style="${chamferCss}"
      >
        <header class="flex items-start justify-between gap-3 pb-3">
          <h3 class="text-xl font-semibold tracking-tight">${title}</h3>
          <span class="font-mono text-[10px] opacity-45">${index}</span>
        </header>

        <div class="relative aspect-square w-full overflow-hidden rounded ${mediaBg}">
          <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 7px 7px;" />
          <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60" />
          <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60" />
          <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60" />
          <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60" />
        </div>
      </div>

      <div 
        class="flex items-center justify-between gap-3 px-4 py-3.5 ${bg}"
        style="${chamferCss}"
      >
        <p class="text-xs leading-relaxed opacity-90">${caption}</p>
        <div class="flex flex-col gap-1 opacity-35 shrink-0">
          <span class="w-1 h-1 rounded-full bg-current" />
          <span class="w-1 h-1 rounded-full bg-current" />
          <span class="w-1 h-1 rounded-full bg-current" />
        </div>
      </div>
    </div>
  </article>
</template>`,
      svelte: `<!-- Kinetic UI // Blueprint Card (${index} — ${title}) -->
<article class="group relative w-full max-w-sm select-none cursor-pointer">
  <div class="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
    <div 
      class="relative p-4 pb-3.5 ${bg}"
      style="${chamferCss}"
    >
      <header class="flex items-start justify-between gap-3 pb-3">
        <h3 class="text-xl font-semibold tracking-tight">${title}</h3>
        <span class="font-mono text-[10px] opacity-45">${index}</span>
      </header>

      <div class="relative aspect-square w-full overflow-hidden rounded ${mediaBg}">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 7px 7px;"></div>
        <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60"></span>
        <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60"></span>
        <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60"></span>
        <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60"></span>
      </div>
    </div>

    <div 
      class="flex items-center justify-between gap-3 px-4 py-3.5 ${bg}"
      style="${chamferCss}"
    >
      <p class="text-xs leading-relaxed opacity-90">${caption}</p>
      <div class="flex flex-col gap-1 opacity-35 shrink-0">
        <span class="w-1 h-1 rounded-full bg-current"></span>
        <span class="w-1 h-1 rounded-full bg-current"></span>
        <span class="w-1 h-1 rounded-full bg-current"></span>
      </div>
    </div>
  </div>
</article>`,
      html: `<!-- Kinetic UI // Blueprint Card (${index} — ${title}) -->
<article class="group relative w-full max-w-sm select-none cursor-pointer">
  <div class="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
    <!-- Top Media Block with 8-Point Chamfer -->
    <div 
      class="relative p-4 pb-3.5 ${bg}"
      style="${chamferCss}"
    >
      <header class="flex items-start justify-between gap-3 pb-3">
        <h3 class="text-xl font-semibold tracking-tight">${title}</h3>
        <span class="font-mono text-[10px] opacity-45">${index}</span>
      </header>

      <div class="relative aspect-square w-full overflow-hidden rounded ${mediaBg}">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 7px 7px;"></div>
        <!-- Corner Crop Brackets -->
        <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60"></span>
        <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60"></span>
        <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60"></span>
        <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60"></span>
      </div>
    </div>

    <!-- Bottom Caption Block -->
    <div 
      class="flex items-center justify-between gap-3 px-4 py-3.5 ${bg}"
      style="${chamferCss}"
    >
      <p class="text-xs leading-relaxed opacity-90">${caption}</p>
      <div class="flex flex-col gap-1 opacity-35 shrink-0">
        <span class="w-1 h-1 rounded-full bg-current"></span>
        <span class="w-1 h-1 rounded-full bg-current"></span>
        <span class="w-1 h-1 rounded-full bg-current"></span>
      </div>
    </div>
  </div>
</article>`
    };
  }

  const DOSSIERS = {
    1: {
      index: '001',
      tag: 'COMPONENT // DETERMINISTIC KERNEL',
      title: 'Deterministic Kernel Card',
      desc: 'Chamfered aerospace blueprint feature card with dual-orbit gyroscope & reticle vector artwork.',
      specs: [
        { key: 'FRAMEWORKS', value: 'React (TSX) · Vue 3 · Svelte 5 · HTML5' },
        { key: 'CLIP-PATH', value: '13px 8-Point Chamfer Polygon' },
        { key: 'VECTOR ART', value: 'Resolution-Independent Inline SVG' },
        { key: 'DEPENDENCIES', value: 'Tailwind CSS (Zero Runtime JS)' }
      ],
      code: makeCardCode('Deterministic Kernel', '001', 'Sub-millisecond signal routing, runtime guardrails, and atomic state transitions', true)
    },
    2: {
      index: '002',
      tag: 'COMPONENT // STREAM PIPELINE',
      title: 'Stream Pipeline Card',
      desc: 'Chamfered technical feature card with harmonic frequency spectrum and quantizer sampling nodes.',
      specs: [
        { key: 'FRAMEWORKS', value: 'React (TSX) · Vue 3 · Svelte 5 · HTML5' },
        { key: 'CLIP-PATH', value: '13px 8-Point Chamfer Polygon' },
        { key: 'CANVAS TEXTURE', value: '7px Radial Dotted Grid Pattern' },
        { key: 'DEPENDENCIES', value: 'Tailwind CSS (Zero Runtime JS)' }
      ],
      code: makeCardCode('Stream Pipeline', '002', 'Continuous event ingestion, zero-drop backpressure buffers, and fault detection', false)
    },
    3: {
      index: '003',
      tag: 'COMPONENT // TELEMETRY MESH',
      title: 'Telemetry Mesh Card',
      desc: 'Chamfered technical feature card with tri-node topology mesh and Merkle quorum verification ring.',
      specs: [
        { key: 'FRAMEWORKS', value: 'React (TSX) · Vue 3 · Svelte 5 · HTML5' },
        { key: 'CLIP-PATH', value: '13px 8-Point Chamfer Polygon' },
        { key: 'CANVAS TEXTURE', value: '7px Radial Dotted Grid Pattern' },
        { key: 'DEPENDENCIES', value: 'Tailwind CSS (Zero Runtime JS)' }
      ],
      code: makeCardCode('Telemetry Mesh', '003', 'Distributed node discovery, peer-to-peer gossip protocol, and verifiable state proofs', false)
    },
    4: {
      index: '004',
      tag: 'COMPONENT // SIGNAL ROUTING',
      title: 'Signal Routing Card',
      desc: 'Chamfered technical feature card with diamond reticle and multi-tier priority crosshair.',
      specs: [
        { key: 'FRAMEWORKS', value: 'React (TSX) · Vue 3 · Svelte 5 · HTML5' },
        { key: 'CLIP-PATH', value: '13px 8-Point Chamfer Polygon' },
        { key: 'CANVAS TEXTURE', value: '7px Radial Dotted Grid Pattern' },
        { key: 'DEPENDENCIES', value: 'Tailwind CSS (Zero Runtime JS)' }
      ],
      code: makeCardCode('Signal Routing', '004', 'Intelligent triage, priority queues, latency-optimized dispatch', false)
    },
    5: {
      index: '005',
      tag: 'COMPONENT // NEURAL SEARCH',
      title: 'Neural Search Card',
      desc: 'Chamfered technical feature card with dual-arc radar reticle and sweep vector artwork.',
      specs: [
        { key: 'FRAMEWORKS', value: 'React (TSX) · Vue 3 · Svelte 5 · HTML5' },
        { key: 'CLIP-PATH', value: '13px 8-Point Chamfer Polygon' },
        { key: 'CANVAS TEXTURE', value: '7px Radial Dotted Grid Pattern' },
        { key: 'DEPENDENCIES', value: 'Tailwind CSS (Zero Runtime JS)' }
      ],
      code: makeCardCode('Neural Search', '005', 'Semantic indexing, multimodal embeddings, sub-ms retrieval', true)
    },
    6: {
      index: '006',
      tag: 'COMPONENT // AUDIT & GUARDRAILS',
      title: 'Audit & Guardrails Card',
      desc: 'Chamfered technical feature card with concentric hexagonal maze and core verification terminal.',
      specs: [
        { key: 'FRAMEWORKS', value: 'React (TSX) · Vue 3 · Svelte 5 · HTML5' },
        { key: 'CLIP-PATH', value: '13px 8-Point Chamfer Polygon' },
        { key: 'CANVAS TEXTURE', value: '7px Radial Dotted Grid Pattern' },
        { key: 'DEPENDENCIES', value: 'Tailwind CSS (Zero Runtime JS)' }
      ],
      code: makeCardCode('Audit & Guardrails', '006', 'Real-time policy enforcement, PII redaction, immutable event logs', false)
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
  const tabs = document.querySelectorAll('.dossier-tab');

  let activeCardId = 1;
  let activeLang = 'react';

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
    dCode.textContent = data.code[activeLang] || '';
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
      dCode.textContent = DOSSIERS[activeCardId]?.code?.[activeLang] || '';
    });
  });

  // Copy code snippet
  copyCodeBtn?.addEventListener('click', () => {
    sfx.success();
    const code = DOSSIERS[activeCardId]?.code?.[activeLang] || '';
    navigator.clipboard?.writeText(code).then(() => {
      copyCodeText.textContent = '✓ Copied!';
      setTimeout(() => { copyCodeText.textContent = 'Copy Component'; }, 2000);
    });
  });
}

// Initialize audio listeners
sfx.attachListeners();

// Initialize 3D Hero Radar & Acoustic Oscilloscope
const heroRadar = initHeroRadar('heroRadarCanvas', { sfx, modeBtnId: null, pingBtnId: null });
const heroOsc = initOscilloscope('heroOscCanvas', {
  sfx,
  mode: 'OSC',
  tint: 'theme',
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
