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
- **Procedural Web Audio Micro-Haptics:**
  - Zero external audio files or network requests — 100% synthesized in real time via browser `AudioContext`.
  - Inspired by **Teenage Engineering OP-1** hardware and Dieter Rams industrial instruments.
  - **Rotary Detent Tick**: 6ms sine sweep (2400Hz → 1800Hz) on card & button hover.
  - **Relay Clack**: Dual-layer 35ms mechanical solenoid snap on button click.
  - **Servo Disengage**: 130ms lowpass-filtered sawtooth sweep on modal open.
  - **Hydraulic Latch**: 85ms damped descending sine clamp on modal dismiss.
  - **Harmonic Success Chime**: 90ms rising fifth interval (D6 → A6) on clipboard copy.
  - **Telemetry Burst**: Rapid 3-pulse FM square wave sequence on simulation execution.
  - HUD audio toggle `[SFX: ON / OFF]` with `localStorage` persistence.
- **Reusable Theme System & Component Catalog:**
  - Standalone [`tokens.css`](./tokens.css) containing chamfer polygon formulas, blueprint grids, and button/badge/input primitives.
  - Dedicated interactive documentation and copy-paste showcase in [`components.html`](./components.html).
- **Custom Blueprint SVG Icon Library (32 Glyphs):**
  - Proprietary technical vector icons engineered specifically for industrial & developer-first interfaces.
  - Consistent **24×24 grid**, sharp **1.35px stroke-width**, 45° chamfered cuts, open corner brackets, and terminal diamond nodes.
  - Exported as ES module [`icons.js`](./icons.js) with metadata, `renderIcon()`, and React/TSX component generator.
  - Interactive searchable **Icon Explorer** with 1-click SVG / React copying in [`components.html#icons`](./components.html#icons).
  - 4 specialized categories:
    - *Compute & Telemetry*: `cluster`, `shard`, `pipeline`, `qubit`, `latency`, `cpu`, `neural`, `database`.
    - *Industrial Hardware*: `rotary`, `toggle`, `oscilloscope`, `relay`, `slider`, `meter`, `fuse`, `crystal`.
    - *Security & Guardrails*: `shield-zk`, `key-crypto`, `audit`, `reticle`, `vault`, `fingerprint`, `badge-check`, `hazard`.
    - *Interface & Controls*: `crosshair`, `terminal`, `brackets`, `split-flap`, `chevron-chamfer`, `search-reticle`, `copy-blueprint`, `sound-wave`.
- **Interactive Cursor-Reactive 3D Wireframe & Telemetry Radar:**
  - High-performance, zero-dependency Canvas 2D engine embedded in the Hero section.
  - Multi-mode real-time sensor array:
    - `GIMBAL`: Nested 3-axis gyro rings with pitch/roll/yaw angle markers.
    - `ICOSA`: 3D wireframe icosahedron (12 vertices, 30 edges) with perspective depth scaling and terminal diamond nodes.
    - `RADAR`: Polar range reticle with sweeping phosphor trail, pulsing target blips, and acoustic ping ripples.
  - Cursor-tracking parallax with smooth lerp inertia (`smooth += (target - smooth) * 0.08`).
- **Interactive Audio Oscilloscope & Spectrogram Engine:**
  - Real-time hardware CRT oscilloscope and FFT spectrum analyzer powered by Web Audio `AnalyserNode`.
  - Classic Tektronix 10×8 subdivision graticule with center crosshair sub-ticks and phosphor trail persistence.
  - Three real-time diagnostic modes:
    - `OSC`: Time-domain waveform with positive zero-crossing trigger stabilization and peak-to-peak ($V_{pp}$) telemetry.
    - `FFT`: 52 log-spaced frequency spectrum bars with floating peak-hold gravity decay caps.
    - `WATERFALL`: Continuous scrolling frequency-time sonogram heatmap.
  - Three phosphor themes: `AMBER` (`#f4551d`), `GREEN` (`#39ff14`), and `CREAM` (`#e9e2d3`).
  - Integrated Signal Generator test bench: Sine, Square, Sawtooth, and Chirp sweeps with 40Hz–2400Hz carrier tuning.
  - Live dual-sensor integration in the Hero monitor (`RADAR 3D` / `ACOUSTIC OSC`) and Soundboard lab in `components.html`.
- **Interactive Blueprint Configurator & Token Studio:**
  - Real-time token laboratory embedded in `components.html#configurator`.
  - Dynamic 8-point chamfer polygon equation calculation (`--c: 4px` to `24px`).
  - Swatch and native hex color picker for accents (`#f4551d`, `#f59e0b`, `#10b981`, `#06b6d4`, `#8b5cf6`, `#ef4444`).
  - Interactive grid density (`40px`–`128px`), bracket sizing (`8px`–`22px`), and vector stroke weight selector (`1.0px`–`2.2px`).
  - Live Specimen sandbox card + global page theme injection toggle.
  - 4 one-click preset themes: `Industrial`, `Teenage OP-1`, `Cyberpunk`, and `Architectural Bone (Light)`.
  - Multi-format token export: Raw CSS Variables, `tailwind.config.js` extension, and DTCG JSON schema.
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

## 3D Wireframe & Telemetry Radar Engine

A zero-dependency Canvas 2D telemetry monitor simulating a hardware vector display (analogous to vector CRT instruments and aerospace HUD monitors).

### 1. 3D Perspective Projection
Coordinates in 3D model space \((x, y, z)\) are rotated by yaw (\(\alpha\)) and pitch (\(\beta\)) before perspective scaling:

$$\begin{aligned}
x_1 &= x \cos\alpha + z \sin\alpha \\
z_1 &= -x \sin\alpha + z \cos\alpha \\
y_2 &= y \cos\beta - z_1 \sin\beta \\
z_2 &= y \sin\beta + z_1 \cos\beta \\
p &= \frac{\text{fov}}{\text{fov} + z_2 \cdot \text{scale}}
\end{aligned}$$

Screen coordinates:
$$\text{screenX} = c_x + x_1 \cdot \text{scale} \cdot p, \quad \text{screenY} = c_y + y_2 \cdot \text{scale} \cdot p$$

### 2. Cursor Parallax & Inertia
Yaw and pitch are coupled to pointer movements with an exponential lerp damping filter:
```javascript
smoothYaw   += (targetYaw   - smoothYaw)   * 0.08;
smoothPitch += (targetPitch - smoothPitch) * 0.08;
```

### 3. Display Modes
- **`GIMBAL`**: Nested 3-axis rotation rings (yaw, pitch, roll) with tick marks and orientation reticle.
- **`ICOSA`**: 3D wireframe icosahedron with 12 vertices, 30 edges, and terminal diamond nodes.
- **`RADAR`**: Polar coordinate range rings, sweeping phosphor beam with trail decay, animated target blips, and acoustic ripple rings.

---

## Audio Oscilloscope & Spectrogram Engine

A real-time laboratory diagnostic monitor inspired by Tektronix oscilloscopes and Braun audio instruments, rendering at 60fps via Web Audio `AnalyserNode` and HTML5 Canvas 2D.

### 1. Web Audio API Signal Pipeline
Audio signals generated by micro-haptic synthesized transducers pass through an `AnalyserNode` before destination:
$$\text{Oscillators / Noise} \longrightarrow \text{Gain} \longrightarrow \text{MasterGain} \longrightarrow \mathbf{AnalyserNode} \longrightarrow \text{AudioContext.destination}$$

- `fftSize = 1024`: Provides 512 frequency spectrum bins and 1024 time-domain waveform sample points.
- `smoothingTimeConstant = 0.82`: Ensures smooth CRT phosphor-like decay.

### 2. Auto-Trigger Zero-Crossing Stabilization
To prevent periodic waveforms from flickering or jittering horizontally, the engine scans the time-domain buffer for the first positive-slope zero crossing before rendering:
```javascript
let startIndex = 0;
for (let i = 0; i < 512; i++) {
  if (timeData[i] < 128 && timeData[i + 1] >= 128) {
    startIndex = i;
    break;
  }
}
```

### 3. Logarithmic Spectrum Analysis & Peak-Hold
Frequencies are mapped logarithmically across 52 bars with simulated gravity peak-hold caps:
$$\text{bin}(i) = \min\left(N-1, \left\lfloor \left(\frac{i}{\text{bars}-1}\right)^{2.2} \times (N-1) \right\rfloor\right)$$

### 4. CRT Graticule Grid & Phosphor Themes
- 10 horizontal divisions × 8 vertical divisions with dotted sub-divisions (`[1, 4]` dash array).
- Center axes with 5 sub-division tick marks per major division.
- Semi-transparent background fills (`rgba(25, 24, 21, 0.26)`) simulating vector phosphor decay.
- Switchable themes: `AMBER` (`#f4551d`), `GREEN` (`#39ff14`), and `CREAM` (`#e9e2d3`).

---

## Blueprint Configurator & Design Token System

The Design System includes a real-time token configurator engine ([`configurator.js`](./configurator.js)) accessible in [`components.html#configurator`](./components.html#configurator).

### 1. Mathematical Chamfer Calculation
Corner cut radius is parameterized via `--c` and resolved dynamically as an 8-point polygon:
```css
clip-path: polygon(
  var(--c) 0, calc(100% - var(--c)) 0,
  100% var(--c), 100% calc(100% - var(--c)),
  calc(100% - var(--c)) 100%, var(--c) 100%,
  0 calc(100% - var(--c)), 0 var(--c)
);
```

### 2. Available Token Parameters
- **Chamfer Radius (`--c`)**: Scalable from `4px` (micro-chip) to `24px` (heavy hardware chassis). Default: `13px`.
- **Accent Palette**: 6 high-contrast swatches plus custom hex color picker.
- **Surface Modes**: Dark Ink (`#2b2b29`), Midnight Navy (`#0d1117`), Graphite Obsidian (`#181a18`), and Architectural Bone (`#f4efe6`).
- **Blueprint Grid**: Cell spacing (`40px`–`128px`) and opacity (`0.01`–`0.15`).
- **Vector Stroke Weight**: `1.0px` (Fine), `1.35px` (Standard Rams), `1.75px` (Bold), `2.2px` (Heavy).

### 3. Preset Profiles
- **`01 INDUSTRIAL BLUEPRINT`**: Dieter Rams / Linear dark aesthetic.
- **`02 TEENAGE ENGINEERING OP-1`**: Slate well `#181a18`, phosphor green `#39ff14` accent.
- **`03 CYBERPUNK TERMINAL`**: Deep obsidian `#0d1117`, sharp 6px chamfer, cyan `#06b6d4` accent.
- **`04 ARCHITECTURAL DRAFTING`**: Light mode parchment `#f4efe6`, charcoal ink `#1c1c1a`, ruby `#ef4444`.

---

## High-Density Telemetry Data Table & Log Inspector

Engineered for infrastructure dashboards, telemetry feeds, and cluster management ([`table.js`](./table.js) & [`components.html#telemetry`](./components.html#telemetry)).

### 1. Architectural Highlights
- **Monospace Density**: Compact typography (`JetBrains Mono`, `10.5px`–`12px`) with strict visual alignment.
- **Inline Micro-Sparklines**: High-performance `<canvas>` sparklines with automatic HiDPI device pixel ratio scaling (`dpr = window.devicePixelRatio || 1`).
- **Chamfered Polygon Checkboxes**: Custom 8-point polygon checkboxes (`.checkbox-chamfer`) matching the hardware design language.
- **Bi-Directional Column Sorting**: Instant sorting on latency, node identifier, load, and status with interactive arrow indicators.
- **Live Search & Status Filtering**: Real-time multi-attribute query filtering matching IDs, names, regions, and cryptographic signatures.
- **Zero-Knowledge Audit Drawers**: Expandable row inspector displaying runtime engines, memory footprints, tasks processed, and formatted JSON state payloads with one-click copy.
- **Batch Operations**: Multi-row selection toolbar with `DRAIN TRAFFIC` and `EXPORT CSV` triggers.
- **Procedural Haptics Integration**: Coupled with Web Audio API micro-haptics (`sfx.click()`, `sfx.tick()`, `sfx.modalOpen()`, `sfx.telemetry()`, `sfx.success()`).

### 2. Usage & Controller Initialization
```javascript
import { initTelemetryTable } from './table.js';
import { sfx } from './audio.js';

const telemetryTable = initTelemetryTable({
  sfx,
  tableBodyId: 'telemetryTableBody',
  searchId: 'telemetrySearch',
  statusSelectId: 'telemetryStatusFilter',
  selectedCountId: 'telemetrySelectedCount',
  batchActionsId: 'telemetryBatchActions',
  selectAllId: 'telemetrySelectAll'
});
```

---

## Technical Forms & Hardware Parameter Rack

Hardware-inspired configuration rack engineered for precision parameter tuning and environment management ([`forms.js`](./forms.js) & [`components.html#forms`](./components.html#forms)).

### 1. Architectural Highlights
- **Multi-State Segmented Switches**: Chamfered 3-way toggle buttons for operational failover modes (`COLD`, `WARM`, `HOT`), sandbox runtime engines (`V8 ISOLATE`, `WASM EDGE`, `CONTAINER`), and dispatch topologies (`ANYCAST MESH`, `ROUND ROBIN`, `GEO NEAREST`).
- **Precision Numeric Steppers**: Tactile step buttons (`.stepper-btn`, `--c: 4px`) with audio micro-detent feedback (`sfx.tick()`) for worker thread allocation (1–64) and ingestion batch windows (8–512ms).
- **Dual-Threshold Rate Limiting**: Interactive double-slider floor/burst limiter with synchronized track illumination.
- **Dynamic Key-Value Environment Rack**: Real-time type-checked configuration editor supporting `STRING`, `NUMBER`, `BOOLEAN`, and `SECRET` types with toggleable secret masking.
- **Live Reactive Exporters**: Generates production-ready `.env` and `config.yaml` specs dynamically as parameters change, with one-click clipboard copy.
- **Pre-Configured Hardware Presets**: One-click switching between `01 PRODUCTION ENTERPRISE`, `02 LOW-LATENCY EDGE`, and `03 DEBUG / SANDBOX`.

### 2. Usage & Controller Initialization
```javascript
import { initParameterRack } from './forms.js';
import { sfx } from './audio.js';

const paramRack = initParameterRack({
  sfx,
  containerId: 'paramRackContainer',
  envPairsListId: 'paramEnvPairsList',
  codeOutputId: 'paramCodeOutput',
  formatLabelId: 'paramFormatLabel'
});
```

---

## Specialized Industrial Modals & Global `⌘K` Command Palette

High-assurance overlay systems engineered for precision control, mission-critical safety interlocks, and full-height live telemetry streaming ([`modals.js`](./modals.js) & [`components.html#modals`](./components.html#modals)).

### 1. Architectural Highlights
- **Global `⌘K` / `Ctrl+K` Command Palette**:
  - Fuzzy-searchable action discovery covering section navigation, hardware safety triggers, telemetry diagnostics, audio toggling, and LLM prompt exports.
  - Full keyboard accessibility: `↑` / `↓` arrow navigation, `↵ Enter` execution, `Esc` dismissal, and backdrop click trapping.
  - Color-coded monospace category chips (`NAVIGATION`, `SAFETY`, `TELEMETRY`, `SYSTEM`).
- **Two-Phase Safety Confirmation Latch**:
  - Industrial circuit-breaker interlock designed for destructive operations.
  - **Phase 1 (Mechanical Arming)**: Physical toggle switch disarms a frosted barrier overlay (`#safetyLatchBarrier`).
  - **Phase 2 (Typed Token Authorization)**: Requires typing exact confirmation token (`CONFIRM OVERRIDE`) before the execute button unlocks.
  - Styled with CSS diagonal warning hazard stripes (`.hazard-stripe` / `.hazard-stripe-danger`).
- **Slide-Out Full-Height Telemetry Drawer (Right-Rail)**:
  - Slide-over diagnostic console (`.drawer-panel`) with snappy transition curves (`cubic-bezier(0.23, 1, 0.32, 1)`).
  - Real-time simulated gRPC event streaming log feed with auto-scrolling and buffer truncation.
  - Live hardware allocation gauges (CPU utilization, isolate memory meters) and consensus quorum status.
- **Procedural Haptics Integration**: Coupled with Web Audio API micro-haptics (`sfx.modalOpen()`, `sfx.modalClose()`, `sfx.click()`, `sfx.tick()`, `sfx.telemetry()`, `sfx.success()`).

### 2. Usage & Controller Initialization
```javascript
import { initIndustrialModals } from './modals.js';
import { sfx } from './audio.js';

const industrialModals = initIndustrialModals({
  sfx,
  paletteOverlayId: 'commandPaletteOverlay',
  paletteInputId: 'commandPaletteInput',
  paletteListId: 'commandPaletteList',
  paletteCountId: 'commandPaletteCount',
  paletteTriggerSelector: '[data-open-palette]',
  safetyLatchOverlayId: 'safetyLatchOverlay',
  safetyLatchArmSwitchId: 'safetyLatchArmSwitch',
  safetyLatchBarrierId: 'safetyLatchBarrier',
  safetyLatchTokenInputId: 'safetyLatchTokenInput',
  safetyLatchConfirmBtnId: 'safetyLatchConfirmBtn',
  safetyLatchTriggerSelector: '[data-open-safety-latch]',
  drawerOverlayId: 'telemetryDrawerOverlay',
  drawerPanelId: 'telemetryDrawerPanel',
  drawerLogContainerId: 'drawerLogContainer',
  drawerTriggerSelector: '[data-open-drawer]'
});
```

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
