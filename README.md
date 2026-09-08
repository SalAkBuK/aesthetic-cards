# Aesthetic Feature Cards

A high-end technical "blueprint" feature cards grid with chamfered silhouettes, dot grids, and orchestrated initial-load SVG stroke-drawing animations using Motion.dev.

Inspired by [aesthetic-cards.vercel.app](https://aesthetic-cards.vercel.app/) and developer-first design systems like Linear.

---

## Features

- **6 Unique Technical Cards:**
  - `001` **Smart Actions** (Orange accent): Concentric ripple rings with `+`/`-` math symbols.
  - `002` **Auto-Resolve** (Cream): Chamfered triangle with 26 interpolated woven fan lines.
  - `003` **Agent assist** (Cream): 3-circle Venn diagram with masked diagonal hatch pattern.
  - `004` **Signal Routing** (Cream): Nested geometric diamonds with coordinate crosshairs & signal pulse nodes.
  - `005` **Neural Search** (Orange accent): Polar radar range rings with diagonal sweep ray & vector coordinate blips.
  - `006` **Audit & Guardrails** (Cream): Concentric precision hexagons with tri-spoke axes and central shield core.
- **Architectural Details:**
  - Blueprint coordinate grid (`84px × 84px`)
  - 8-point chamfered polygon clip-paths (`--c: 13px`)
  - Radial dot grids with 13px corner crop brackets (`scale(1.35)` on hover)
  - 45° diamond divider nodes dynamically aligned to block seams
- **Initial Load Vector Orchestration:**
  - `0.4s` header slide-down
  - Staggered desktop cascade (`70ms` lead per card)
  - `0.9s` SVG path drawing with `cubic-bezier(0.77, 0, 0.175, 1)`
  - Micro-glyph and thread staggers (`cubic-bezier(0.23, 1, 0.32, 1)`)
- **Included Agent Skill:**
  - Pre-configured agent skill in [`.agent/skills/aesthetic-feature-cards/SKILL.md`](./.agent/skills/aesthetic-feature-cards/SKILL.md) for Antigravity, Cursor, and Claude Code.

---

## Getting Started

### Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

Or open `index.html` directly using any static web server (`npx serve .`, `python -m http.server 3000`, or VS Code Live Server).

---

## Animation Architecture & Specifications

### Easing Curves
```javascript
const EASE_OUT = [0.23, 1, 0.32, 1];     // Entrances, lifts, fades
const EASE_IN_OUT = [0.77, 0, 0.175, 1]; // SVG stroke draw-on
```

### 1. Entrance Choreography
- **Section Label (`#label`)**:
  - `opacity`: `0 -> 1`
  - `transform`: `translateY(6px) -> translateY(0px)`
  - Duration: `0.4s` (`EASE_OUT`)

- **Card Shells (`.card-shell`)**:
  - Triggered via Motion `inView` (15% threshold, -10% bottom margin).
  - Cascade delay: Desktop stagger `lead = index * 0.07s`. Mobile: `0s`.
  - `opacity`: `0 -> 1`
  - `transform`: `translateY(16px) -> translateY(0px)`
  - Duration: `0.5s` (`EASE_OUT`)

### 2. SVG Line-Art Draw-On
- **Strokes (`.draw`)**:
  - Calculated length dynamically via `getTotalLength()` and initialized with `stroke-dasharray` and `stroke-dashoffset`.
  - Duration: `0.9s` (`EASE_IN_OUT`)
  - Stagger delay: `lead + 0.12s + strokeIndex * 0.06s`

### 3. Micro-Interactions
- **Hover**: Card lifts `translateY(-4px)` with corner crop brackets scaling to `1.35` (240ms `EASE_OUT`).
- **Press**: Scales down to `0.985` (140ms duration on pointerdown).
- **Reduced Motion**: Gracefully falls back to simple opacity fades.

---

## Universal Prompt for LLMs

To generate similar cards with Claude, ChatGPT, v0, or Cursor:

```markdown
Create a set of high-end technical "blueprint" aesthetic feature cards inspired by Linear and high-end developer tools.

### 1. Visual Style & Color Palette
- Background: Technical dark ink #2b2b29 with a subtle white blueprint coordinate grid:
  linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px) 84px 84px.
- Palette:
  - Surface Cream: #e9e2d3 with media well #e2dac9 and text #16150f
  - Accent Orange: #f4551d with media well #ea4f1a (apply to 1 or 2 anchor cards)
  - Lines / Borders: #3d3d39
- Typography: Clean sans (Inter / system-ui) paired with uppercase monospace indicators (JetBrains Mono / monospace) with letter-spacing 0.18em.

### 2. Card Anatomy & Geometry
Each card consists of two chamfered blocks with an 8-point polygon clip-path (--c: 12px cut corners):
- polygon(var(--c) 0, calc(100% - var(--c)) 0, 100% var(--c), 100% calc(100% - var(--c)), calc(100% - var(--c)) 100%, var(--c) 100%, 0 calc(100% - var(--c)), 0 var(--c))
- Top Block: Header with Title (20px font-semibold) + Monospace Index ("001", "002", etc.), followed by a 1:1 square media viewport.
- Media Viewport: Radial-gradient dot grid background (7px spacing) with four 13px corner crop brackets (.bracket) in the corners.
- Bottom Block: Chamfered footer with 2-line feature description (12.5px) + a vertical 4-dot micro indicator.
- Seam Nodes: A 45-degree rotated 10px diamond positioned on the center seam between the top and bottom blocks of adjacent cards.

### 3. SVG Geometric Line-Art
Inside each card's square media panel, place pure inline geometric line art (stroke 1.35px, fill none):
- Card 1 (Smart Actions): 4 concentric ripple circles with math + and − symbols stacked vertically.
- Card 2 (Auto-Resolve): An equilateral triangle with a vertical center spine and 26 woven geometric string lines interpolated between vertices.
- Card 3 (Agent assist): 3 overlapping Venn circles with a diagonal striped hatch pattern masked to their center intersection.
- Additional Cards: Radar coordinate sweeps with target blips, nested concentric diamonds with coordinate crosshairs, or concentric hexagonal shields.

### 4. Initial Load Animation Choreography
Use Web Animations API or Motion.dev with two specific cubic bezier curves:
- EASE_OUT = cubic-bezier(0.23, 1, 0.32, 1) (snappy entrances & micro-interactions)
- EASE_IN_OUT = cubic-bezier(0.77, 0, 0.175, 1) (smooth vector drawing)

Sequence:
1. Section Label ("FEATURES"): Slides down translateY(6px) -> 0 and fades in opacity: 0 -> 1 (400ms, EASE_OUT).
2. Card Shells: Staggered entrance translateY(16px) -> 0 and opacity: 0 -> 1 (500ms, EASE_OUT, cascade delay: index * 70ms).
3. Vector Line-Art Draw-On: Calculate getTotalLength() for all strokes. Animate strokeDashoffset from length to 0 (900ms, EASE_IN_OUT, delay: lead + 120ms + strokeIndex * 60ms).
4. Micro-Glyphs: Symbols, hatch pattern, or string lines fade in with a 350ms - 500ms stagger after the main strokes start.

### 5. Hover & Press States
- On desktop fine hover: Card lifts translateY(-4px) (240ms EASE_OUT) while the corner brackets scale to 1.35.
- On pointerdown: Card scales down to 0.985 (140ms).
- Gracefully handle prefers-reduced-motion by falling back to simple opacity fades with no translation or stroke delays.
```

---

## License
MIT
