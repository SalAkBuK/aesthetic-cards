/**
 * Custom Blueprint SVG Icon Library
 * 32 Technical Glyphs engineered for industrial, developer-first, and blueprint UI themes.
 * Standard: 24x24 viewBox, 1.35px stroke, chamfered silhouettes, terminal diamond nodes.
 */

export const ICONS = {
  // --- Category A: Compute & Telemetry ---
  'cluster': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M12 9.5L14.5 12L12 14.5L9.5 12Z" />
  <path d="M12 2.5L14 4.5L12 6.5L10 4.5Z" />
  <path d="M12 17.5L14 19.5L12 21.5L10 19.5Z" />
  <path d="M3 10L5 12L3 14L1 12Z" />
  <path d="M21 10L23 12L21 14L19 12Z" />
  <path d="M12 6.5V9.5M12 14.5V17.5M5 12H9.5M14.5 12H19" />
  <path d="M6 6L7.5 7.5M18 6L16.5 7.5M6 18L7.5 16.5M18 18L16.5 16.5" />
</svg>`,

  'shard': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M6 3H18L21 6V18L18 21H6L3 18V6L6 3Z" />
  <path d="M3 12H21M12 3V21" />
  <path d="M12 9.5L14.5 12L12 14.5L9.5 12Z" />
  <circle cx="7.5" cy="7.5" r="0.75" fill="currentColor" />
  <circle cx="16.5" cy="7.5" r="0.75" fill="currentColor" />
  <circle cx="7.5" cy="16.5" r="0.75" fill="currentColor" />
  <circle cx="16.5" cy="16.5" r="0.75" fill="currentColor" />
</svg>`,

  'pipeline': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M3 7H7L9 12L7 17H3L5 12Z" />
  <path d="M10 7H14L16 12L14 17H10L12 12Z" />
  <path d="M17 7H20L22 12L20 17H17L19 12Z" />
  <path d="M9 12H10M16 12H17" stroke-dasharray="1 1.5" />
</svg>`,

  'qubit': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <circle cx="12" cy="12" r="8" />
  <ellipse cx="12" cy="12" rx="8" ry="3" />
  <path d="M12 2V22M10 4.5L12 2L14 4.5" />
  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
</svg>`,

  'latency': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M2 5H22M2 3V7M22 3V7" />
  <path d="M2 19H22M2 17V21M22 17V21" />
  <path d="M2 12C4.5 12 5.5 7 7.5 7C9.5 7 10.5 17 12.5 17C14.5 17 15.5 9 17.5 9C19.5 9 20.5 12 22 12" />
  <path d="M7.5 5V7M12.5 17V19" stroke-dasharray="1 1" />
</svg>`,

  'cpu': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M7 4H17L20 7V17L17 20H7L4 17V7L7 4Z" />
  <rect x="8.5" y="8.5" width="7" height="7" rx="0.5" />
  <path d="M12 10.5L13.5 12L12 13.5L10.5 12Z" fill="currentColor" />
  <path d="M9 1V4M12 1V4M15 1V4M9 20V23M12 20V23M15 20V23M1 9H4M1 12H4M1 15H4M20 9H23M20 12H23M20 15H23" />
</svg>`,

  'neural': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M4 6L12 8.5M4 12L12 8.5M4 18L12 8.5M4 6L12 15.5M4 12L12 15.5M4 18L12 15.5M12 8.5L20 9M12 15.5L20 9M12 8.5L20 15M12 15.5L20 15" stroke-opacity="0.5" />
  <circle cx="4" cy="6" r="1.5" fill="currentColor" />
  <circle cx="4" cy="12" r="1.5" fill="currentColor" />
  <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  <circle cx="12" cy="8.5" r="1.5" fill="currentColor" />
  <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
  <circle cx="20" cy="9" r="1.5" fill="currentColor" />
  <circle cx="20" cy="15" r="1.5" fill="currentColor" />
</svg>`,

  'database': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M5 4H19L21 6.5L19 9H5L3 6.5L5 4Z" />
  <path d="M3 6.5V13L5 15.5H19L21 13V6.5" />
  <path d="M3 13V19.5L5 22H19L21 19.5V13" />
  <path d="M9 4V9M15 4V9M9 10.5V15.5M15 10.5V15.5M9 17V22M15 17V22" stroke-opacity="0.5" />
</svg>`,

  // --- Category B: Industrial Hardware & Controls ---
  'rotary': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <circle cx="12" cy="12" r="9" />
  <circle cx="12" cy="12" r="5" />
  <path d="M12 12L12 7" />
  <path d="M12 3V1M21 12H23M12 21V23M3 12H1M18.36 5.64L19.78 4.22M5.64 18.36L4.22 19.78M18.36 18.36L19.78 19.78M5.64 5.64L4.22 4.22" stroke-opacity="0.6" />
</svg>`,

  'toggle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M4 17H20L18 21H6L4 17Z" />
  <path d="M9 17L10.5 13H13.5L15 17" />
  <path d="M12 13L16.5 4.5" />
  <circle cx="16.5" cy="4.5" r="2" fill="currentColor" fill-opacity="0.2" />
  <circle cx="8" cy="19" r="0.75" fill="currentColor" />
  <circle cx="16" cy="19" r="0.75" fill="currentColor" />
</svg>`,

  'oscilloscope': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M4 4H20L22 6V18L20 20H4L2 18V6L4 4Z" />
  <path d="M2 12H22M12 4V20" stroke-dasharray="1 1.5" stroke-opacity="0.4" />
  <path d="M5 14L8 14L10 8L13 16L15 10L17 12L19 12" />
</svg>`,

  'relay': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M3 15L5 11L7 15L9 11L11 15L13 11L15 15" />
  <path d="M4 17H14" />
  <path d="M18 5V9M18 15V19" />
  <path d="M14 7.5L18 11.5" />
  <circle cx="14" cy="7.5" r="1" fill="currentColor" />
  <circle cx="18" cy="9" r="1" />
  <circle cx="18" cy="15" r="1" />
</svg>`,

  'slider': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M12 3V21" />
  <path d="M8 6H10M8 12H10M8 18H10M14 6H16M14 12H16M14 18H16" stroke-opacity="0.5" />
  <path d="M7 9H17L18.5 10.5V13.5L17 15H7L5.5 13.5V10.5L7 9Z" fill="currentColor" fill-opacity="0.15" />
  <path d="M9 12H15" />
</svg>`,

  'meter': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M3 19L5 5H19L21 19H3Z" />
  <path d="M6.5 13.5A7.5 7.5 0 0 1 17.5 13.5" />
  <path d="M7.5 11.5L8.5 12.5M12 8V9.5M16.5 11.5L15.5 12.5" stroke-opacity="0.6" />
  <path d="M12 18L15 9.5" />
  <circle cx="12" cy="18" r="1.5" />
</svg>`,

  'fuse': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <rect x="2" y="8" width="3.5" height="8" rx="0.5" fill="currentColor" fill-opacity="0.1" />
  <rect x="18.5" y="8" width="3.5" height="8" rx="0.5" fill="currentColor" fill-opacity="0.1" />
  <path d="M5.5 8H18.5M5.5 16H18.5" />
  <path d="M5.5 12H8L10 9.5L14 14.5L16 12H18.5" />
</svg>`,

  'crystal': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M5 7H19L21 9V15L19 17H5L3 15V9L5 7Z" />
  <rect x="8" y="9.5" width="8" height="5" rx="0.5" stroke-dasharray="2 1" />
  <path d="M10 8V16M14 8V16" />
  <path d="M8 17V22M16 17V22" />
</svg>`,

  // --- Category C: Security, Guardrails & Proofs ---
  'shield-zk': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M12 2L20 5V12.5C20 17 16 20.5 12 22C8 20.5 4 17 4 12.5V5L12 2Z" />
  <path d="M12 2V22M4 9H20M4 14.5H20" stroke-opacity="0.4" />
  <path d="M12 9.5L14.5 12L12 14.5L9.5 12Z" fill="currentColor" fill-opacity="0.2" />
</svg>`,

  'key-crypto': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M4 9L8 5L12 9L8 13L4 9Z" />
  <path d="M7 9L8 8L9 9L8 10Z" fill="currentColor" />
  <path d="M12 9H21" />
  <path d="M17 9V13M19 9V12M21 9V14" />
</svg>`,

  'audit': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M4 4H10L11.5 5.5V10.5L10 12H4L2.5 10.5V5.5L4 4Z" />
  <path d="M14 12H20L21.5 13.5V18.5L20 20H14L12.5 18.5V13.5L14 12Z" />
  <path d="M11.5 8H14.5V12" stroke-dasharray="1 1.5" />
  <path d="M5 8L6.5 9.5L9 6.5" />
</svg>`,

  'reticle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M3 8V3H8M16 3H21V8M3 16V21H8M16 21H21V16" />
  <circle cx="12" cy="12" r="5" />
  <path d="M12 5V7M12 17V19M5 12H7M17 12H19" />
  <circle cx="12" cy="12" r="1" fill="currentColor" />
</svg>`,

  'vault': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M5 3H19L22 6V18L19 21H5L2 18V6L5 3Z" />
  <circle cx="12" cy="12" r="6" />
  <circle cx="12" cy="12" r="2" fill="currentColor" fill-opacity="0.2" />
  <path d="M12 6V10M12 14V18M6 12H10M14 12H18" />
</svg>`,

  'fingerprint': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M12 10A2 2 0 0 1 14 12V18" />
  <path d="M10 17V12A4 4 0 0 1 16 8.5" />
  <path d="M7.5 15.5V12A6.5 6.5 0 0 1 18.5 7.5" />
  <path d="M5 14V12A9 9 0 0 1 20 6.5" />
  <path d="M12 19V21.5M9 19V21.5M15 19V21.5" stroke-dasharray="1 1" />
</svg>`,

  'badge-check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M7 2H17L22 7V17L17 22H7L2 17V7L7 2Z" />
  <path d="M8 12L11 15L16 9" />
  <path d="M2 12H4M20 12H22M12 2V4M12 20V22" stroke-opacity="0.4" />
</svg>`,

  'hazard': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M10.5 3.5H13.5L21.5 17.5L20 20.5H4L2.5 17.5L10.5 3.5Z" />
  <path d="M12 8.5V14" />
  <circle cx="12" cy="17" r="0.85" fill="currentColor" />
</svg>`,

  // --- Category D: Interface & Navigation Controls ---
  'crosshair': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21A9 9 0 0 1 3 12A9 9 0 0 1 12 3" stroke-dasharray="6 3" />
  <path d="M12 1V7M12 17V23M1 12H7M17 12H23" />
  <path d="M12 10.5L13.5 12L12 13.5L10.5 12Z" fill="currentColor" />
</svg>`,

  'terminal': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M5 3H19L21 5V19L19 21H5L3 19V5L5 3Z" />
  <path d="M3 7.5H21" />
  <circle cx="6" cy="5.25" r="0.75" fill="currentColor" />
  <circle cx="8.5" cy="5.25" r="0.75" fill="currentColor" />
  <path d="M7 11.5L10 14L7 16.5" />
  <path d="M12 16.5H16" />
</svg>`,

  'brackets': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M3 8V3H8M16 3H21V8M3 16V21H8M16 21H21V16" />
  <path d="M11 12H13M12 11V13" />
  <circle cx="12" cy="12" r="3.5" stroke-dasharray="1 1.5" stroke-opacity="0.5" />
</svg>`,

  'split-flap': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M4 3H20L22 5V19L20 21H4L2 19V5L4 3Z" />
  <path d="M2 12H22" />
  <rect x="0.5" y="10.5" width="2" height="3" rx="0.5" fill="currentColor" />
  <rect x="21.5" y="10.5" width="2" height="3" rx="0.5" fill="currentColor" />
  <path d="M9 7H15M12 7V12M12 12V17M9 17H15" stroke-opacity="0.8" />
</svg>`,

  'chevron-chamfer': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M9 5L15 11V13L9 19L7 17L12 12L7 7L9 5Z" fill="currentColor" fill-opacity="0.1" />
</svg>`,

  'search-reticle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <circle cx="10" cy="10" r="7" />
  <path d="M10 6V8M10 12V14M6 10H8M12 10H14" stroke-opacity="0.5" />
  <circle cx="10" cy="10" r="1" fill="currentColor" />
  <path d="M15 15L21 21M18.5 21.5L21.5 18.5" />
</svg>`,

  'copy-blueprint': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M8 3H17L20 6V15" />
  <path d="M5 7H15L18 10V20L16 22H5L3 20V9L5 7Z" />
  <path d="M7 11H13M7 14.5H11M7 18H14" stroke-opacity="0.6" />
</svg>`,

  'sound-wave': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="blueprint-icon">
  <path d="M3 9H6L10 5V19L6 15H3V9Z" />
  <path d="M13 10A3 3 0 0 1 13 14" />
  <path d="M16 7A7 7 0 0 1 16 17" />
  <path d="M19 4A11 11 0 0 1 19 20" />
</svg>`
};

export const ICON_META = {
  // Category A: Compute & Telemetry
  'cluster': { title: 'Node Cluster', category: 'compute', tags: 'mesh network distributed compute workers' },
  'shard': { title: 'Vector Shard', category: 'compute', tags: 'embedding memory partition indexing' },
  'pipeline': { title: 'Queue Pipeline', category: 'compute', tags: 'stream processing workflow staging' },
  'qubit': { title: 'Quantum Qubit', category: 'compute', tags: 'superposition orbital state compute' },
  'latency': { title: 'Latency Jitter', category: 'compute', tags: 'ping milliseconds telemetry network' },
  'cpu': { title: 'Silicon CPU', category: 'compute', tags: 'processor core microchip hardware' },
  'neural': { title: 'Neural Graph', category: 'compute', tags: 'weights connections deep learning ai' },
  'database': { title: 'Columnar DB', category: 'compute', tags: 'disk storage ledger partitions' },

  // Category B: Industrial Hardware & Controls
  'rotary': { title: 'Rotary Knob', category: 'hardware', tags: 'dial detent potentiometer audio encoder' },
  'toggle': { title: 'Toggle Switch', category: 'hardware', tags: 'actuator switch lever mechanical' },
  'oscilloscope': { title: 'Oscilloscope', category: 'hardware', tags: 'crt waveform monitor frequency test' },
  'relay': { title: 'Contact Relay', category: 'hardware', tags: 'solenoid electromagnetic coil switch' },
  'slider': { title: 'Fader Slider', category: 'hardware', tags: 'potentiometer mixer control channel' },
  'meter': { title: 'Analog Meter', category: 'hardware', tags: 'vu dial gauge needle telemetry' },
  'fuse': { title: 'Cartridge Fuse', category: 'hardware', tags: 'overcurrent protection circuit power' },
  'crystal': { title: 'Quartz Crystal', category: 'hardware', tags: 'resonator clock oscillator frequency' },

  // Category C: Security, Guardrails & Proofs
  'shield-zk': { title: 'ZK Shield', category: 'security', tags: 'zero knowledge cryptograph defense' },
  'key-crypto': { title: 'Crypto Key', category: 'security', tags: 'asymmetric encryption auth token secret' },
  'audit': { title: 'Audit Block', category: 'security', tags: 'merkle proof ledger immutable verify' },
  'reticle': { title: 'Biometric Reticle', category: 'security', tags: 'optical target scanner face fingerprint' },
  'vault': { title: 'Airlock Vault', category: 'security', tags: 'safe door locking armored security' },
  'fingerprint': { title: 'Fingerprint Vector', category: 'security', tags: 'biometrics touch authentication' },
  'badge-check': { title: 'Verified Seal', category: 'security', tags: 'check certification signature guarantee' },
  'hazard': { title: 'Hazard Alert', category: 'security', tags: 'warning fault alert safeguard danger' },

  // Category D: Interface & Navigation Controls
  'crosshair': { title: 'HUD Crosshair', category: 'interface', tags: 'boresight targeting reticle coordinate' },
  'terminal': { title: 'CLI Terminal', category: 'interface', tags: 'shell command console prompt bash' },
  'brackets': { title: 'Crop Brackets', category: 'interface', tags: 'corners bounding box framing alignment' },
  'split-flap': { title: 'Split Flap', category: 'interface', tags: 'mechanical departure board schedule display' },
  'chevron-chamfer': { title: 'Chamfer Chevron', category: 'interface', tags: 'arrow directional next forward navigation' },
  'search-reticle': { title: 'Search Scanner', category: 'interface', tags: 'query lookup filter magnifying inspect' },
  'copy-blueprint': { title: 'Blueprint Copy', category: 'interface', tags: 'clipboard duplicate clone snippet' },
  'sound-wave': { title: 'Audio Transducer', category: 'interface', tags: 'speaker haptics sound sfx waves' }
};

/**
 * Returns raw SVG string for an icon slug with custom classes or size
 */
export function renderIcon(name, { size = 20, className = '' } = {}) {
  const raw = ICONS[name];
  if (!raw) return '';
  return raw
    .replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24" width="${size}" height="${size}"`)
    .replace('class="blueprint-icon"', `class="blueprint-icon ${className}"`);
}

/**
 * Returns a copy-pasteable React/JSX snippet for the icon
 */
export function getReactSnippet(name) {
  const meta = ICON_META[name] || { title: name };
  const pascalName = name
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('') + 'Icon';

  const raw = ICONS[name];
  if (!raw) return '';

  // Extract paths from raw svg
  const innerSvg = raw
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '')
    .trim();

  return `// ${meta.title} Icon — Blueprint Theme
export function ${pascalName}({ size = 24, className = '', ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      ${innerSvg.split('\n').map(l => '  ' + l).join('\n')}
    </svg>
  );
}`;
}
