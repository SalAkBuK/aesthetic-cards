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
