import { animate, inView, stagger } from 'motion';

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
      shell.addEventListener('pointerenter', () => shell.classList.add('is-hover'));
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
}

