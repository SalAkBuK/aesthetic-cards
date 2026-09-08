# Aesthetic Feature Cards

A pixel-perfect recreation of [aesthetic-cards.vercel.app](https://aesthetic-cards.vercel.app/).

## Getting Started

### Development Server
```bash
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

Or serve `index.html` directly using any static server (e.g. `npx serve .`, `python -m http.server 3000`, or VS Code Live Server).

---

## Animation Architecture & Specifications

### 1. Entrance Choreography
- **Section Label (`#label`)**:
  - `opacity`: `0 -> 1`
  - `transform`: `translateY(6px) -> translateY(0px)`
  - Duration: `0.4s` (400ms)
  - Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

- **Card Shells (`.card-shell`)**:
  - Triggered via Motion `inView` (15% threshold, -10% bottom margin).
  - Cascade delay: Desktop stagger `lead = index * 0.07s` (0s, 0.07s, 0.14s). Mobile: 0s (individual scroll).
  - `opacity`: `0 -> 1`
  - `transform`: `translateY(16px) -> translateY(0px)`
  - Duration: `0.5s` (500ms)
  - Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

### 2. SVG Line-Art Draw-On
- **Strokes (`.draw`)**:
  - Calculated length dynamically via `getTotalLength()` and initialized with `stroke-dasharray` and `stroke-dashoffset`.
  - Duration: `0.9s` (900ms)
  - Easing: `cubic-bezier(0.77, 0, 0.175, 1)`
  - Stagger delay: `lead + 0.12s + strokeIndex * 0.06s`
  - **Card 1 (Smart Actions)**: 4 concentric ripple rings.
  - **Card 2 (Auto-Resolve)**: Chamfered triangle outline and vertical spine.
  - **Card 3 (Agent assist)**: 3 overlapping Venn circles.

### 3. Interior Micro-Animations
- **Card 1 Signs (`+` and `-` symbols)**:
  - `opacity`: `0 -> 1`
  - Duration: `0.35s` (350ms)
  - Stagger: `0.05s` with start delay `lead + 0.47s`
  - Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

- **Card 2 Geometric Fan (`.fan-line`)**:
  - 26 interpolated string lines (linear interpolation between apex and base vertices).
  - `opacity`: `0 -> 0.85`
  - Duration: `0.5s` (500ms)
  - Stagger: `0.012s` with start delay `lead + 0.27s`
  - Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

- **Card 3 Venn Hatching (`.hatch`)**:
  - Striped pattern fill masked to the intersection of Venn circles B and C.
  - `opacity`: `0 -> 0.9`
  - Duration: `0.45s` (450ms)
  - Delay: `lead + 0.62s`
  - Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

### 4. Interactive States (CSS & Event Listeners)
- **Hover**:
  - Gated behind `@media (hover: hover) and (pointer: fine)`.
  - Card lift: `translateY(-4px)` (240ms cubic-bezier(0.23, 1, 0.32, 1)).
  - Corner brackets: `scale(1.35)` (240ms cubic-bezier(0.23, 1, 0.32, 1)).
  - Line art stays fixed in relative position.
- **Press**:
  - Scale down: `scale(0.985)` (140ms duration).
- **Diamond Seam Nodes**:
  - Dynamically positioned along the exact center seam between top and bottom blocks via `placeNodes()`.
