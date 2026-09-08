---
name: aesthetic-feature-cards
description: Generates high-end technical blueprint feature cards with chamfered silhouettes, dot grids, and orchestrated initial-load SVG stroke-drawing animations using Motion.dev or Web Animations API. Use when the user asks for aesthetic cards, technical UI cards, blueprint feature grids, or geometric line-art draw-on animations.
---

# Aesthetic Feature Cards Skill

This skill provides the architectural specifications, mathematical formulas, and animation choreography required to generate technical/industrial aesthetic feature cards inspired by Linear and high-end developer tools.

---

## 1. Visual Design Language

### Color Palette
- **Canvas / Background**: `ink` (`#2b2b29`), `ink2` (`#33332f`)
- **Card Surfaces**: `cream` (`#e9e2d3`), `cream2` (`#e2dac9`), `sand` (`#d8cdb4`)
- **Accent Surface**: `orange` (`#f4551d`), `orange2` (`#ea4f1a`)
- **Text & Stroke Near-Black**: `near` (`#16150f`)
- **Grid / Line Borders**: `line` (`#3d3d39`, or `rgba(255, 255, 255, 0.045)`)

### Background Grid (Blueprint Pattern)
```css
.blueprint {
  background-color: #2b2b29;
  background-image:
    linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size: 84px 84px;
  background-position: center top;
}
```

### Chamfered Polygon Silhouette
Cards use an 8-point polygon clip-path with a cut corner radius (`--c: 12px` to `13px`):
```css
.chamfer {
  --c: 13px;
  clip-path: polygon(
    var(--c) 0, calc(100% - var(--c)) 0,
    100% var(--c), 100% calc(100% - var(--c)),
    calc(100% - var(--c)) 100%, var(--c) 100%,
    0 calc(100% - var(--c)), 0 var(--c)
  );
}
```

### Media Panel Details
1. **Dotted Grid Background**:
   ```css
   .dotgrid {
     background-image: radial-gradient(currentColor 1px, transparent 1px);
     background-size: 7px 7px;
   }
   ```
2. **Corner Crop Brackets**:
   13px corner crop brackets on all four corners with 1px hair lines. Scale to `1.35` on hover.
3. **Seam Node**:
   A 45-degree rotated diamond (`12px x 12px`) positioned dynamically on the seam between the media block and caption block.

---

## 2. Animation Architecture

### Easing Functions
```javascript
const EASE_OUT = [0.23, 1, 0.32, 1];     // UI transitions, entrances, fades
const EASE_IN_OUT = [0.77, 0, 0.175, 1]; // Geometric SVG path stroke draw-on
```

### Choreography Sequence
1. **Header Label**:
   - Slide & Fade: `translateY(6px) -> 0`, `opacity: 0 -> 1`
   - Duration: `0.4s` (`EASE_OUT`)
2. **Card Shells**:
   - Cascade Delay: Desktop `index * 0.07s`, Mobile `0s`
   - Slide & Fade: `translateY(16px) -> 0`, `opacity: 0 -> 1`
   - Duration: `0.5s` (`EASE_OUT`)
3. **SVG Line-Art Stroke Draw-On (`.draw`)**:
   - `strokeDashoffset`: `[dataset.len, 0]`
   - Duration: `0.9s` (`EASE_IN_OUT`)
   - Start Delay: `lead + 0.12s + strokeIndex * 0.06s`
4. **Secondary Elements**:
   - Micro-glyphs (`+`/`-`), fan lines, hatch masks, or signal nodes fade in with a `0.35s - 0.5s` stagger after the main strokes start.

---

## 3. Geometric Artwork Formulas

- **Concentric Circles**: Outward to inward circles with equidistant radii.
- **Woven String Triangle**: Interpolate points between vertices using `lerp(a, b, t)` where `t = i / (steps + 1)`.
- **Compound Hatch Mask**: SVG `<pattern id="hatch">` at -45 deg masked with `<clipPath>`.
- **Radar Reticle**: Polar range circles + 45-degree ray line + coordinate blips.
- **Concentric Hexagons / Diamonds**: Symmetrical nested polygons with coordinate axes.

---

## 4. Micro-Interactions
- **Hover Lift**: `translateY(-4px)` (240ms duration)
- **Bracket Expansion**: `scale(1.35)` (240ms duration)
- **Card Press**: `scale(0.985)` (140ms duration on pointerdown)
- **Reduced Motion**: Gracefully fall back to opacity fades with no translation.

---

## 5. Procedural Web Audio Micro-Haptics

Add physical instrumentation feel using browser-native `AudioContext` with zero external assets:

| Sound Profile | Wave Shape | Frequency Envelope | Duration | Trigger Event |
| :--- | :--- | :--- | :--- | :--- |
| **Rotary Tick** | Sine | `2400Hz -> 1800Hz` (exp) | 6ms | Card & button hover (throttled 32ms) |
| **Relay Clack** | Triangle + Sine | `170Hz -> 45Hz` + `980Hz` snap | 35ms | Primary / secondary button clicks |
| **Servo Disengage**| Sawtooth + LP | `110Hz -> 320Hz` (Q: 3.5 filter sweep) | 130ms | Modal or drawer open |
| **Hydraulic Latch**| Sine | `260Hz -> 75Hz` (exp damp) | 85ms | Modal dismiss / ESC press |
| **Success Chime**  | Sine (dual tone)| `1175Hz -> 1760Hz` (rising fifth) | 90ms | Clipboard copy / confirmation |
| **Telemetry Burst**| Square (3x pulse)| `880Hz -> 1320Hz -> 1760Hz` (FM) | 3x 35ms | Live simulation / worker dispatch |

### Audio Rules:
- Resume suspended audio context upon first user gesture (`pointerdown`, `keydown`).
- Provide an accessible HUD audio toggle (`[SFX: ON / OFF]`) with `localStorage` persistence.
- Throttle hover ticks (min 30ms interval) to keep rapid cursor movement clean and rhythmic.

---

## 6. Blueprint SVG Icon System Guidelines

When creating UI icons to match this aesthetic, follow these geometric constraints:

### Vector Constraints
- **ViewBox**: `0 0 24 24` with 2px active padding (`2 2 22 22`).
- **Stroke Width**: Strict `1.35px` (`stroke-width="1.35"`).
- **Linecaps & Joins**: `stroke-linecap="round"` and `stroke-linejoin="round"`.
- **Stroke Color**: Strict `currentColor` for dynamic theme adaptability.
- **Fill**: Default `none`. Use `fill="currentColor" fill-opacity="0.15"` to `0.2` for accents or solid `fill="currentColor"` for micro terminal diamond nodes (`r="0.75"` to `1.5`).

### Characteristic Geometry Patterns
1. **45° Chamfered Corners**: Replace rounded fillets with 45-degree corner bevels:
   - Outer container: `M5 3H19L21 5V19L19 21H5L3 19V5L5 3Z`
2. **Terminal Diamond Nodes**: Center hubs and junction points terminate on a 4-point diamond:
   - `<path d="M12 9.5L14.5 12L12 14.5L9.5 12Z" />`
3. **Open Corner Crop Brackets**: Mark boundary perimeters with 90° corner brackets:
   - `M3 8V3H8`, `M16 3H21V8`, `M3 16V21H8`, `M16 21H21V16`
4. **Coordinate Crosshair Dashes**: Internal reference lines use sub-pixel dotted or dashed intervals:
   - `stroke-dasharray="1 1.5"` with `stroke-opacity="0.5"`


