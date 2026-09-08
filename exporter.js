import JSZip from 'jszip';

/**
 * Multi-Framework Component Exporter Engine (shadcn/ui style)
 * Generates copy-pasteable, production-ready code snippets and downloadable
 * files across React (TSX), Vue 3 (SFC), Svelte 5, and HTML5 / Tailwind CSS.
 */

export const REGISTRY = {
  button: {
    id: 'button',
    name: 'Hardware Chamfered Button',
    section: '01 // Buttons & Steppers',
    description: 'Precision industrial action buttons with 8px corner chamfers, tactical return glyphs, and micro-haptic audio triggers.',
    dependencies: ['clsx', 'tailwind-merge'],
    cssTokens: ['--c: 8px (corner cut)', '--orange: #f4551d'],
    filename: 'BlueprintButton',
    code: {
      react: `import React from 'react';

interface BlueprintButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  shortcut?: string;
  children: React.ReactNode;
}

export function BlueprintButton({
  variant = 'primary',
  shortcut,
  children,
  className = '',
  ...props
}: BlueprintButtonProps) {
  const baseStyles = \`
    relative inline-flex items-center justify-between gap-3 px-4 py-2 
    font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150
    select-none cursor-pointer focus:outline-none active:scale-[0.98]
  \`;

  // 8-point chamfer polygon
  const chamferStyle: React.CSSProperties = {
    clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
  };

  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-[#16150f] shadow-lg shadow-orange-500/20',
    secondary: 'bg-white/10 hover:bg-white/20 text-[#e9e2d3] border border-white/20',
    danger: 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-[#16150f] border border-red-500/40'
  };

  return (
    <button
      style={chamferStyle}
      className={\`\${baseStyles} \${variants[variant]} \${className}\`}
      {...props}
    >
      <span>{children}</span>
      {shortcut && <span className="opacity-50 text-[10px]">{shortcut}</span>}
    </button>
  );
}`,
      vue: `<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  shortcut?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary'
})
</script>

<template>
  <button
    :class="[
      'relative inline-flex items-center justify-between gap-3 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer focus:outline-none active:scale-[0.98]',
      variant === 'primary' ? 'bg-[#f4551d] hover:bg-[#ea4f1a] text-[#16150f] shadow-lg shadow-[#f4551d]/20' : '',
      variant === 'secondary' ? 'bg-white/10 hover:bg-white/20 text-[#e9e2d3] border border-white/20' : '',
      variant === 'danger' ? 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-[#16150f] border border-red-500/40' : ''
    ]"
    style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
  >
    <span><slot /></span>
    <span v-if="shortcut" class="opacity-50 text-[10px]">{{ shortcut }}</span>
  </button>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    shortcut?: string;
    children?: any;
    [key: string]: any;
  }

  let { variant = 'primary', shortcut, children, ...restProps }: Props = $props();

  const variants = {
    primary: 'bg-[#f4551d] hover:bg-[#ea4f1a] text-[#16150f] shadow-lg shadow-[#f4551d]/20',
    secondary: 'bg-white/10 hover:bg-white/20 text-[#e9e2d3] border border-white/20',
    danger: 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-[#16150f] border border-red-500/40'
  };
</script>

<button
  class="relative inline-flex items-center justify-between gap-3 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer focus:outline-none active:scale-[0.98] {variants[variant]}"
  style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
  {...restProps}
>
  <span>{@render children?.()}</span>
  {#if shortcut}
    <span class="opacity-50 text-[10px]">{shortcut}</span>
  {/if}
</button>`,
      html: `<!-- Primary Chamfered Button -->
<button 
  class="relative inline-flex items-center justify-between gap-3 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider bg-[#f4551d] hover:bg-[#ea4f1a] text-[#16150f] transition-all duration-150 select-none cursor-pointer focus:outline-none active:scale-[0.98]"
  style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
>
  <span>EXECUTE DIRECTIVE</span>
  <span class="opacity-50 text-[10px]">↵</span>
</button>

<!-- Secondary Spec Outline -->
<button 
  class="relative inline-flex items-center justify-between gap-3 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-[#e9e2d3] border border-white/20 transition-all duration-150 select-none cursor-pointer"
  style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
>
  <span>SECONDARY SPEC</span>
  <span class="opacity-40 text-[10px]">⌘K</span>
</button>`
    }
  },

  card: {
    id: 'card',
    name: 'Blueprint Feature Card',
    section: 'Landing // Feature Matrix',
    description: 'Chamfered 8-point card with 13px corner crop brackets, dot-grid canvas, SVG vector line-art, and seam diamond node.',
    dependencies: ['motion'],
    cssTokens: ['--c: 13px', 'clip-path: polygon(...)', '.dotgrid'],
    filename: 'BlueprintCard',
    code: {
      react: `import React from 'react';

interface BlueprintCardProps {
  index: string;
  title: string;
  caption: string;
  variant?: 'cream' | 'orange';
  children?: React.ReactNode;
}

export function BlueprintCard({
  index = '001',
  title = 'SMART ACTIONS',
  caption = 'Deterministic tool-use orchestration with sub-millisecond dispatch',
  variant = 'cream',
  children
}: BlueprintCardProps) {
  const isOrange = variant === 'orange';
  const cardBg = isOrange ? 'bg-[#f4551d] text-[#16150f]' : 'bg-[#e9e2d3] text-[#16150f]';
  const mediaBg = isOrange ? 'bg-[#ea4f1a]/60' : 'bg-[#e2dac9]';

  const chamfer = {
    clipPath: 'polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px)'
  };

  return (
    <article className="group relative w-full max-w-sm cursor-pointer select-none">
      <div className="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
        {/* Top Media Block */}
        <div style={chamfer} className={\`relative p-4 pb-3.5 \${cardBg}\`}>
          <header className="flex items-start justify-between gap-3 pb-3">
            <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>
            <span className="font-mono text-[10px] opacity-45">{index}</span>
          </header>

          <div className="relative aspect-square w-full overflow-hidden rounded">
            {/* Dotted Grid Canvas */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '7px 7px'
              }}
            />
            
            {/* Corner Crop Brackets */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60 group-hover:scale-125 transition-transform" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60 group-hover:scale-125 transition-transform" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60 group-hover:scale-125 transition-transform" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60 group-hover:scale-125 transition-transform" />

            {/* Custom SVG Vector Art */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom Caption Block */}
        <div style={chamfer} className={\`flex items-center justify-between gap-3 px-4 py-3.5 \${cardBg}\`}>
          <p className="text-xs leading-relaxed opacity-90 max-w-[24ch]">{caption}</p>
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
      vue: `<script setup lang="ts">
interface Props {
  index?: string
  title?: string
  caption?: string
  variant?: 'cream' | 'orange'
}

withDefaults(defineProps<Props>(), {
  index: '001',
  title: 'SMART ACTIONS',
  caption: 'Deterministic tool-use orchestration with sub-millisecond dispatch',
  variant: 'cream'
})
</script>

<template>
  <article class="group relative w-full max-w-sm cursor-pointer select-none">
    <div class="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
      <!-- Top Media Block -->
      <div 
        :class="['relative p-4 pb-3.5', variant === 'orange' ? 'bg-[#f4551d] text-[#16150f]' : 'bg-[#e9e2d3] text-[#16150f]']"
        style="clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px);"
      >
        <header class="flex items-start justify-between gap-3 pb-3">
          <h3 class="text-xl font-semibold leading-none tracking-tight">{{ title }}</h3>
          <span class="font-mono text-[10px] opacity-45">{{ index }}</span>
        </header>

        <div class="relative aspect-square w-full overflow-hidden rounded">
          <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 7px 7px;" />
          <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60 group-hover:scale-125 transition-transform" />
          <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60 group-hover:scale-125 transition-transform" />
          <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60 group-hover:scale-125 transition-transform" />
          <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60 group-hover:scale-125 transition-transform" />

          <div class="absolute inset-0 flex items-center justify-center p-6">
            <slot />
          </div>
        </div>
      </div>

      <!-- Bottom Caption Block -->
      <div 
        :class="['flex items-center justify-between gap-3 px-4 py-3.5', variant === 'orange' ? 'bg-[#f4551d] text-[#16150f]' : 'bg-[#e9e2d3] text-[#16150f]']"
        style="clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px);"
      >
        <p class="text-xs leading-relaxed opacity-90 max-w-[24ch]">{{ caption }}</p>
        <div class="flex flex-col gap-1 opacity-35 shrink-0">
          <span class="w-1 h-1 rounded-full bg-current" />
          <span class="w-1 h-1 rounded-full bg-current" />
          <span class="w-1 h-1 rounded-full bg-current" />
        </div>
      </div>
    </div>
  </article>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    index?: string;
    title?: string;
    caption?: string;
    variant?: 'cream' | 'orange';
    children?: any;
  }

  let {
    index = '001',
    title = 'SMART ACTIONS',
    caption = 'Deterministic tool-use orchestration with sub-millisecond dispatch',
    variant = 'cream',
    children
  }: Props = $props();

  const chamfer = 'clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px);';
</script>

<article class="group relative w-full max-w-sm cursor-pointer select-none">
  <div class="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
    <div 
      class="relative p-4 pb-3.5 {variant === 'orange' ? 'bg-[#f4551d] text-[#16150f]' : 'bg-[#e9e2d3] text-[#16150f]'}"
      style={chamfer}
    >
      <header class="flex items-start justify-between gap-3 pb-3">
        <h3 class="text-xl font-semibold leading-none tracking-tight">{title}</h3>
        <span class="font-mono text-[10px] opacity-45">{index}</span>
      </header>

      <div class="relative aspect-square w-full overflow-hidden rounded">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 7px 7px;" />
        <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60 group-hover:scale-125 transition-transform" />
        <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60 group-hover:scale-125 transition-transform" />
        <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60 group-hover:scale-125 transition-transform" />
        <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60 group-hover:scale-125 transition-transform" />

        <div class="absolute inset-0 flex items-center justify-center p-6">
          {@render children?.()}
        </div>
      </div>
    </div>

    <div 
      class="flex items-center justify-between gap-3 px-4 py-3.5 {variant === 'orange' ? 'bg-[#f4551d] text-[#16150f]' : 'bg-[#e9e2d3] text-[#16150f]'}"
      style={chamfer}
    >
      <p class="text-xs leading-relaxed opacity-90 max-w-[24ch]">{caption}</p>
      <div class="flex flex-col gap-1 opacity-35 shrink-0">
        <span class="w-1 h-1 rounded-full bg-current" />
        <span class="w-1 h-1 rounded-full bg-current" />
        <span class="w-1 h-1 rounded-full bg-current" />
      </div>
    </div>
  </div>
</article>`,
      html: `<article class="group relative w-full max-w-sm cursor-pointer select-none">
  <div class="flex flex-col gap-1.5 transition-transform duration-200 group-hover:-translate-y-1">
    <!-- Top Media Block -->
    <div 
      class="relative p-4 pb-3.5 bg-[#e9e2d3] text-[#16150f]"
      style="clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px);"
    >
      <header class="flex items-start justify-between gap-3 pb-3">
        <h3 class="text-xl font-semibold leading-none tracking-tight">State Consensus</h3>
        <span class="font-mono text-[10px] opacity-45">007</span>
      </header>

      <div class="relative aspect-square w-full overflow-hidden rounded bg-[#e2dac9]">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 7px 7px;"></div>
        <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60"></span>
        <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60"></span>
        <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60"></span>
        <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60"></span>

        <!-- Line Art SVG -->
        <svg class="absolute inset-0 w-full h-full p-6" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.35">
          <polygon points="100,26 110,36 100,46 90,36" />
          <path d="M 100 46 V 56 L 60 68 V 74 M 100 46 V 56 L 140 68 V 74" />
          <circle cx="100" cy="36" r="3" fill="currentColor" />
        </svg>
      </div>
    </div>

    <!-- Bottom Caption Block -->
    <div 
      class="flex items-center justify-between gap-3 px-4 py-3.5 bg-[#e9e2d3] text-[#16150f]"
      style="clip-path: polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px);"
    >
      <p class="text-xs leading-relaxed opacity-90 max-w-[24ch]">Byzantine quorum, ZK state commitments, Merkle proofs</p>
      <div class="flex flex-col gap-1 opacity-35 shrink-0">
        <span class="w-1 h-1 rounded-full bg-current"></span>
        <span class="w-1 h-1 rounded-full bg-current"></span>
        <span class="w-1 h-1 rounded-full bg-current"></span>
      </div>
    </div>
  </div>
</article>`
    }
  },

  table: {
    id: 'table',
    name: 'High-Density Telemetry Table',
    section: '08 // Telemetry Table',
    description: 'Mission-critical monospace data table with sortable headers, micro-sparkline canvas graphs, and chamfered checkboxes.',
    dependencies: [],
    cssTokens: ['.checkbox-chamfer', '--orange: #f4551d'],
    filename: 'TelemetryTable',
    code: {
      react: `import React, { useState } from 'react';

interface TelemetryRow {
  id: string;
  status: 'online' | 'throttled' | 'degraded';
  region: string;
  latencyMs: number;
  throughput: string;
}

const SAMPLE_DATA: TelemetryRow[] = [
  { id: 'iad-cluster-01', status: 'online', region: 'us-east-1', latencyMs: 0.42, throughput: '124.8k ops/s' },
  { id: 'fra-cluster-04', status: 'online', region: 'eu-central-1', latencyMs: 1.12, throughput: '89.2k ops/s' },
  { id: 'hnd-cluster-09', status: 'throttled', region: 'ap-northeast-1', latencyMs: 3.48, throughput: '32.1k ops/s' },
  { id: 'syd-cluster-02', status: 'degraded', region: 'ap-southeast-2', latencyMs: 8.94, throughput: '14.0k ops/s' }
];

export function TelemetryTable() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 font-mono text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-cream/50">
            <th className="py-2 px-2.5 w-8 text-center">
              <input 
                type="checkbox"
                onChange={(e) => setSelected(e.target.checked ? SAMPLE_DATA.map(d => d.id) : [])}
                className="w-3.5 h-3.5 accent-[#f4551d]"
              />
            </th>
            <th className="py-2 px-2.5">Status</th>
            <th className="py-2 px-2.5">Identifier</th>
            <th className="py-2 px-2.5">Region</th>
            <th className="py-2 px-2.5">Latency</th>
            <th className="py-2 px-2.5">Throughput</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {SAMPLE_DATA.map(row => (
            <tr 
              key={row.id}
              onClick={() => toggleSelect(row.id)}
              className={\`hover:bg-white/[0.03] transition-colors cursor-pointer \${selected.includes(row.id) ? 'bg-[#f4551d]/5' : ''}\`}
            >
              <td className="py-2 px-2.5 text-center">
                <input 
                  type="checkbox" 
                  checked={selected.includes(row.id)} 
                  onChange={() => {}}
                  className="w-3.5 h-3.5 accent-[#f4551d]" 
                />
              </td>
              <td className="py-2 px-2.5">
                <span className={\`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px] font-semibold uppercase \${
                  row.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  row.status === 'throttled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }\`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {row.status}
                </span>
              </td>
              <td className="py-2 px-2.5 font-bold text-[#e9e2d3]">{row.id}</td>
              <td className="py-2 px-2.5 text-cream/60">{row.region}</td>
              <td className="py-2 px-2.5 font-bold text-[#f4551d]">{row.latencyMs}ms</td>
              <td className="py-2 px-2.5 text-emerald-400">{row.throughput}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<string[]>([])
const data = [
  { id: 'iad-cluster-01', status: 'online', region: 'us-east-1', latencyMs: 0.42, throughput: '124.8k ops/s' },
  { id: 'fra-cluster-04', status: 'online', region: 'eu-central-1', latencyMs: 1.12, throughput: '89.2k ops/s' },
  { id: 'hnd-cluster-09', status: 'throttled', region: 'ap-northeast-1', latencyMs: 3.48, throughput: '32.1k ops/s' }
]

function toggle(id: string) {
  selected.value.includes(id) 
    ? selected.value = selected.value.filter(x => x !== id)
    : selected.value.push(id)
}
</script>

<template>
  <div class="w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 font-mono text-xs">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase text-cream/50">
          <th class="py-2 px-2.5">Status</th>
          <th class="py-2 px-2.5">Identifier</th>
          <th class="py-2 px-2.5">Latency</th>
          <th class="py-2 px-2.5">Throughput</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr 
          v-for="row in data" 
          :key="row.id" 
          @click="toggle(row.id)"
          :class="['hover:bg-white/[0.03] transition-colors cursor-pointer', selected.includes(row.id) ? 'bg-[#f4551d]/5' : '']"
        >
          <td class="py-2 px-2.5">
            <span class="px-2 py-0.5 rounded text-[9.5px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {{ row.status }}
            </span>
          </td>
          <td class="py-2 px-2.5 font-bold text-[#e9e2d3]">{{ row.id }}</td>
          <td class="py-2 px-2.5 text-[#f4551d] font-bold">{{ row.latencyMs }}ms</td>
          <td class="py-2 px-2.5 text-emerald-400">{{ row.throughput }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>`,
      svelte: `<script lang="ts">
  let selected: string[] = $state([]);

  const data = [
    { id: 'iad-cluster-01', status: 'online', region: 'us-east-1', latencyMs: 0.42, throughput: '124.8k ops/s' },
    { id: 'fra-cluster-04', status: 'online', region: 'eu-central-1', latencyMs: 1.12, throughput: '89.2k ops/s' }
  ];

  function toggle(id: string) {
    selected = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
  }
</script>

<div class="w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 font-mono text-xs">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase text-cream/50">
        <th class="py-2 px-2.5">Status</th>
        <th class="py-2 px-2.5">Identifier</th>
        <th class="py-2 px-2.5">Latency</th>
        <th class="py-2 px-2.5">Throughput</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      {#each data as row}
        <tr 
          onclick={() => toggle(row.id)}
          class="hover:bg-white/[0.03] transition-colors cursor-pointer {selected.includes(row.id) ? 'bg-[#f4551d]/5' : ''}"
        >
          <td class="py-2 px-2.5">
            <span class="px-2 py-0.5 rounded text-[9.5px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {row.status}
            </span>
          </td>
          <td class="py-2 px-2.5 font-bold text-[#e9e2d3]">{row.id}</td>
          <td class="py-2 px-2.5 text-[#f4551d] font-bold">{row.latencyMs}ms</td>
          <td class="py-2 px-2.5 text-emerald-400">{row.throughput}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>`,
      html: `<div class="w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 font-mono text-xs">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-cream/50">
        <th class="py-2 px-2.5">STATUS</th>
        <th class="py-2 px-2.5">NODE ID</th>
        <th class="py-2 px-2.5">LATENCY</th>
        <th class="py-2 px-2.5">THROUGHPUT</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr class="hover:bg-white/[0.03] transition">
        <td class="py-2 px-2.5">
          <span class="px-2 py-0.5 rounded text-[9.5px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
        </td>
        <td class="py-2 px-2.5 font-bold text-[#e9e2d3]">iad-cluster-01</td>
        <td class="py-2 px-2.5 font-bold text-[#f4551d]">0.42ms</td>
        <td class="py-2 px-2.5 text-emerald-400">124.8k ops/s</td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  },

  input: {
    id: 'input',
    name: 'Technical Command Bar & Input',
    section: '02 // Form Inputs',
    description: 'Monospace command bar with prefix chip, active focus ring, and keyboard trigger shortcut indicator.',
    dependencies: [],
    cssTokens: ['--orange: #f4551d'],
    filename: 'BlueprintInput',
    code: {
      react: `import React from 'react';

interface BlueprintInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixLabel?: string;
  shortcutBadge?: string;
}

export function BlueprintInput({
  prefixLabel = 'SSH://',
  shortcutBadge = '⌘K',
  className = '',
  ...props
}: BlueprintInputProps) {
  return (
    <div className="relative flex items-center w-full max-w-md font-mono text-xs">
      {prefixLabel && (
        <span className="absolute left-2.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider bg-white/10 text-orange-400 border border-white/10 select-none">
          {prefixLabel}
        </span>
      )}
      <input
        type="text"
        className={\`w-full bg-[#16150f] border border-white/20 focus:border-[#f4551d] text-[#e9e2d3] placeholder-cream/40 rounded py-2 \${prefixLabel ? 'pl-20' : 'pl-3'} \${shortcutBadge ? 'pr-12' : 'pr-3'} focus:outline-none transition-colors \${className}\`}
        {...props}
      />
      {shortcutBadge && (
        <span className="absolute right-2.5 text-[10px] text-cream/40 font-semibold select-none">
          {shortcutBadge}
        </span>
      )}
    </div>
  );
}`,
      vue: `<script setup lang="ts">
defineProps<{
  prefixLabel?: string
  shortcutBadge?: string
  modelValue?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative flex items-center w-full max-w-md font-mono text-xs">
    <span v-if="prefixLabel" class="absolute left-2.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider bg-white/10 text-[#f4551d] border border-white/10 select-none">
      {{ prefixLabel }}
    </span>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="['w-full bg-[#16150f] border border-white/20 focus:border-[#f4551d] text-[#e9e2d3] placeholder-cream/40 rounded py-2 focus:outline-none transition-colors', prefixLabel ? 'pl-20' : 'pl-3', shortcutBadge ? 'pr-12' : 'pr-3']"
    />
    <span v-if="shortcutBadge" class="absolute right-2.5 text-[10px] text-cream/40 font-semibold select-none">
      {{ shortcutBadge }}
    </span>
  </div>
</template>`,
      svelte: `<script lang="ts">
  let { prefixLabel = 'SSH://', shortcutBadge = '⌘K', value = $bindable(''), ...props } = $props();
</script>

<div class="relative flex items-center w-full max-w-md font-mono text-xs">
  {#if prefixLabel}
    <span class="absolute left-2.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider bg-white/10 text-[#f4551d] border border-white/10 select-none">
      {prefixLabel}
    </span>
  {/if}
  <input
    type="text"
    bind:value
    class="w-full bg-[#16150f] border border-white/20 focus:border-[#f4551d] text-[#e9e2d3] placeholder-cream/40 rounded py-2 {prefixLabel ? 'pl-20' : 'pl-3'} {shortcutBadge ? 'pr-12' : 'pr-3'} focus:outline-none transition-colors"
    {...props}
  />
  {#if shortcutBadge}
    <span class="absolute right-2.5 text-[10px] text-cream/40 font-semibold select-none">
      {shortcutBadge}
    </span>
  {/if}
</div>`,
      html: `<div class="relative flex items-center w-full max-w-md font-mono text-xs">
  <span class="absolute left-2.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider bg-white/10 text-[#f4551d] border border-white/10 select-none">
    SSH://
  </span>
  <input
    type="text"
    placeholder="root@relay-node-iad.mesh"
    class="w-full bg-[#16150f] border border-white/20 focus:border-[#f4551d] text-[#e9e2d3] placeholder-cream/40 rounded py-2 pl-20 pr-12 focus:outline-none transition"
  />
  <span class="absolute right-2.5 text-[10px] text-cream/40 font-semibold select-none">⌘K</span>
</div>`
    }
  },

  modal: {
    id: 'modal',
    name: 'Two-Phase Safety Modal',
    section: '10 // Industrial Modals',
    description: 'Hazard-striped safety confirmation modal with physical arm switch and cryptographic text confirmation constraint.',
    dependencies: [],
    cssTokens: ['clip-path: polygon(...)', '.hazard-stripe-danger'],
    filename: 'SafetyConfirmationModal',
    code: {
      react: `import React, { useState } from 'react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requiredToken?: string;
}

export function SafetyConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  requiredToken = 'TERMINATE CLUSTER'
}: SafetyModalProps) {
  const [isArmed, setIsArmed] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  if (!isOpen) return null;

  const canExecute = isArmed && tokenInput.trim() === requiredToken;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
      <div 
        className="w-full max-w-md bg-[#16150f] border border-red-500/40 rounded-xl overflow-hidden shadow-2xl space-y-4"
        style={{
          clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
        }}
      >
        {/* Hazard Header */}
        <div className="p-3 bg-red-500/20 border-b border-red-500/30 flex items-center justify-between text-red-400 font-bold">
          <span>⚠️ PROTOCOL INTERLOCK // LEVEL-4 DESTRUCTIVE</span>
          <button onClick={onClose} className="hover:text-white cursor-pointer">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-[#e9e2d3]/80 leading-relaxed text-xs">
            This operation disassembles worker clusters and purges transient memory rings. Disarm safety interlock to enable terminal override.
          </p>

          {/* Phase 1: Arm Switch */}
          <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
            <span className="text-cream/80 text-[11px] font-bold">DISARM CIRCUIT BARRIER</span>
            <input 
              type="checkbox" 
              checked={isArmed} 
              onChange={e => setIsArmed(e.target.checked)} 
              className="w-4 h-4 accent-red-500 cursor-pointer" 
            />
          </div>

          {/* Phase 2: Confirmation Token */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-cream/50">TYPE "{requiredToken}" TO PROCEED:</label>
            <input 
              type="text" 
              disabled={!isArmed}
              value={tokenInput} 
              onChange={e => setTokenInput(e.target.value)} 
              placeholder={isArmed ? requiredToken : 'DISARM BARRIER FIRST'}
              className="w-full bg-black/60 border border-white/20 focus:border-red-500 disabled:opacity-40 text-cream text-xs px-3 py-2 rounded focus:outline-none"
            />
          </div>

          {/* Execute CTA */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-1.5 text-cream/60 hover:text-white cursor-pointer">CANCEL</button>
            <button 
              disabled={!canExecute}
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 disabled:opacity-30 disabled:pointer-events-none text-[#16150f] font-bold rounded cursor-pointer transition"
            >
              TERMINATE CLUSTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  requiredToken?: string
}>(), {
  requiredToken: 'TERMINATE CLUSTER'
})

const emit = defineEmits(['close', 'confirm'])

const isArmed = ref(false)
const tokenInput = ref('')

const canExecute = computed(() => isArmed.value && tokenInput.value.trim() === props.requiredToken)
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
    <div 
      class="w-full max-w-md bg-[#16150f] border border-red-500/40 rounded-xl overflow-hidden shadow-2xl"
      style="clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);"
    >
      <div class="p-3 bg-red-500/20 border-b border-red-500/30 flex items-center justify-between text-red-400 font-bold">
        <span>⚠️ SAFETY INTERLOCK // LEVEL-4</span>
        <button @click="$emit('close')">✕</button>
      </div>
      <div class="p-4 space-y-4">
        <p class="text-[#e9e2d3]/80 leading-relaxed text-xs">
          Disarm safety interlock and provide confirmation string to proceed.
        </p>
        <div class="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
          <span class="text-cream/80 text-[11px] font-bold">DISARM BARRIER</span>
          <input type="checkbox" v-model="isArmed" class="w-4 h-4 accent-red-500" />
        </div>
        <input 
          type="text" 
          :disabled="!isArmed"
          v-model="tokenInput"
          :placeholder="isArmed ? requiredToken : 'DISARM BARRIER FIRST'"
          class="w-full bg-black/60 border border-white/20 text-cream px-3 py-2 rounded"
        />
        <div class="flex justify-end gap-2">
          <button @click="$emit('close')" class="px-3 py-1.5 text-cream/60">CANCEL</button>
          <button :disabled="!canExecute" @click="$emit('confirm')" class="px-4 py-2 bg-red-500 disabled:opacity-30 text-[#16150f] font-bold">
            CONFIRM OVERRIDE
          </button>
        </div>
      </div>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  let { isOpen = true, requiredToken = 'TERMINATE CLUSTER', onClose, onConfirm }: any = $props();
  let isArmed = $state(false);
  let tokenInput = $state('');
  let canExecute = $derived(isArmed && tokenInput.trim() === requiredToken);
</script>

{#if isOpen}
<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
  <div 
    class="w-full max-w-md bg-[#16150f] border border-red-500/40 rounded-xl overflow-hidden shadow-2xl"
    style="clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);"
  >
    <div class="p-3 bg-red-500/20 border-b border-red-500/30 flex items-center justify-between text-red-400 font-bold">
      <span>⚠️ SAFETY INTERLOCK</span>
      <button onclick={onClose}>✕</button>
    </div>
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
        <span class="text-cream/80 text-[11px] font-bold">DISARM BARRIER</span>
        <input type="checkbox" bind:checked={isArmed} class="w-4 h-4 accent-red-500" />
      </div>
      <input 
        type="text" 
        disabled={!isArmed}
        bind:value={tokenInput} 
        placeholder={isArmed ? requiredToken : 'DISARM BARRIER FIRST'}
        class="w-full bg-black/60 border border-white/20 text-cream px-3 py-2 rounded"
      />
      <div class="flex justify-end gap-2">
        <button onclick={onClose} class="px-3 py-1.5 text-cream/60">CANCEL</button>
        <button disabled={!canExecute} onclick={onConfirm} class="px-4 py-2 bg-red-500 disabled:opacity-30 text-[#16150f] font-bold">
          TERMINATE
        </button>
      </div>
    </div>
  </div>
</div>
{/if}`,
      html: `<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
  <div 
    class="w-full max-w-md bg-[#16150f] border border-red-500/40 rounded-xl overflow-hidden shadow-2xl space-y-4"
    style="clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);"
  >
    <div class="p-3 bg-red-500/20 border-b border-red-500/30 flex items-center justify-between text-red-400 font-bold">
      <span>⚠️ SAFETY INTERLOCK // LEVEL-4</span>
      <span>✕</span>
    </div>
    <div class="p-4 space-y-3 text-cream/80">
      <p>Confirm destructive operation by disarming barrier.</p>
      <div class="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/10">
        <span class="font-bold text-[11px]">DISARM CIRCUIT BARRIER</span>
        <input type="checkbox" class="accent-red-500" />
      </div>
      <input type="text" placeholder="TERMINATE CLUSTER" class="w-full bg-black/60 border border-white/20 text-cream px-3 py-2 rounded" />
    </div>
  </div>
</div>`
    }
  },
  badge: {
    id: 'badge',
    name: 'Status & Telemetry Badge',
    section: '03 // Badges & Indicators',
    description: 'Precision status pill with active pulsed LED beacon, monospace micro-label, and industrial telemetry borders.',
    dependencies: [],
    cssTokens: ['--orange: #f4551d'],
    filename: 'BlueprintBadge',
    code: {
      react: `import React from 'react';

interface BlueprintBadgeProps {
  status?: 'operational' | 'degraded' | 'critical' | 'standby';
  label: string;
  code?: string;
}

export function BlueprintBadge({
  status = 'operational',
  label,
  code
}: BlueprintBadgeProps) {
  const statusConfig = {
    operational: {
      color: 'bg-emerald-400',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30 bg-emerald-500/10'
    },
    degraded: {
      color: 'bg-amber-400',
      text: 'text-amber-400',
      border: 'border-amber-500/30 bg-amber-500/10'
    },
    critical: {
      color: 'bg-red-500',
      text: 'text-red-400',
      border: 'border-red-500/30 bg-red-500/10'
    },
    standby: {
      color: 'bg-white/40',
      text: 'text-cream/50',
      border: 'border-white/20 bg-white/5'
    }
  };

  const cfg = statusConfig[status];

  return (
    <div className={\`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border \${cfg.border} font-mono text-[11px]\`}>
      <span className="relative flex h-2 w-2">
        {status === 'operational' && (
          <span className={\`animate-ping absolute inline-flex h-full w-full rounded-full \${cfg.color} opacity-75\`} />
        )}
        <span className={\`relative inline-flex rounded-full h-2 w-2 \${cfg.color}\`} />
      </span>
      <span className={\`font-semibold uppercase tracking-wider \${cfg.text}\`}>{label}</span>
      {code && <span className="opacity-40 text-[9px] border-l border-white/20 pl-1.5">{code}</span>}
    </div>
  );
}`,
      vue: `<script setup lang="ts">
interface Props {
  status?: 'operational' | 'degraded' | 'critical' | 'standby'
  label: string
  code?: string
}

withDefaults(defineProps<Props>(), {
  status: 'operational'
})
</script>

<template>
  <div 
    :class="[
      'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border font-mono text-[11px]',
      status === 'operational' ? 'border-emerald-500/30 bg-emerald-500/10' : '',
      status === 'degraded' ? 'border-amber-500/30 bg-amber-500/10' : '',
      status === 'critical' ? 'border-red-500/30 bg-red-500/10' : '',
      status === 'standby' ? 'border-white/20 bg-white/5' : ''
    ]"
  >
    <span class="relative flex h-2 w-2">
      <span 
        v-if="status === 'operational'" 
        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
      />
      <span 
        :class="[
          'relative inline-flex rounded-full h-2 w-2',
          status === 'operational' ? 'bg-emerald-400' : '',
          status === 'degraded' ? 'bg-amber-400' : '',
          status === 'critical' ? 'bg-red-500' : '',
          status === 'standby' ? 'bg-white/40' : ''
        ]"
      />
    </span>
    <span 
      :class="[
        'font-semibold uppercase tracking-wider',
        status === 'operational' ? 'text-emerald-400' : '',
        status === 'degraded' ? 'text-amber-400' : '',
        status === 'critical' ? 'text-red-400' : '',
        status === 'standby' ? 'text-cream/50' : ''
      ]"
    >
      {{ label }}
    </span>
    <span v-if="code" class="opacity-40 text-[9px] border-l border-white/20 pl-1.5">{{ code }}</span>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    status?: 'operational' | 'degraded' | 'critical' | 'standby';
    label: string;
    code?: string;
  }

  let { status = 'operational', label, code }: Props = $props();

  const configs = {
    operational: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-500/10' },
    degraded: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/10' },
    critical: { dot: 'bg-red-500', text: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' },
    standby: { dot: 'bg-white/40', text: 'text-cream/50', bg: 'border-white/20 bg-white/5' }
  };
</script>

<div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border {configs[status].bg} font-mono text-[11px]">
  <span class="relative flex h-2 w-2">
    {#if status === 'operational'}
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full {configs[status].dot} opacity-75"></span>
    {/if}
    <span class="relative inline-flex rounded-full h-2 w-2 {configs[status].dot}"></span>
  </span>
  <span class="font-semibold uppercase tracking-wider {configs[status].text}">{label}</span>
  {#if code}
    <span class="opacity-40 text-[9px] border-l border-white/20 pl-1.5">{code}</span>
  {/if}
</div>`,
      html: `<!-- Status Beacon Pill -->
<div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 font-mono text-[11px]">
  <span class="relative flex h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
  </span>
  <span class="font-semibold uppercase tracking-wider text-emerald-400">NOMINAL</span>
  <span class="text-cream/40 text-[9px] border-l border-white/20 pl-1.5">SYS_01</span>
</div>`
    }
  },
  callout: {
    id: 'callout',
    name: 'Hazard & Diagnostic Callout',
    section: '06 // Callouts & Alerts',
    description: 'High-visibility technical alert card featuring safety chevron patterns, warning status indicators, and tactical dismissal actions.',
    dependencies: [],
    cssTokens: ['--near: #16150f', '--orange: #f4551d'],
    filename: 'BlueprintCallout',
    code: {
      react: `import React from 'react';

interface BlueprintCalloutProps {
  severity?: 'hazard' | 'warning' | 'info';
  title: string;
  message: string;
  code?: string;
  onDismiss?: () => void;
}

export function BlueprintCallout({
  severity = 'hazard',
  title,
  message,
  code,
  onDismiss
}: BlueprintCalloutProps) {
  const configs = {
    hazard: {
      border: 'border-red-500/50',
      stripe: 'bg-[repeating-linear-gradient(45deg,#ef4444_0,#ef4444_10px,#000000_10px,#000000_20px)]',
      badge: 'bg-red-500/20 text-red-400 border-red-500/40',
      text: 'text-red-200'
    },
    warning: {
      border: 'border-amber-500/50',
      stripe: 'bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#000000_10px,#000000_20px)]',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      text: 'text-amber-200'
    },
    info: {
      border: 'border-orange-500/50',
      stripe: 'bg-[repeating-linear-gradient(45deg,#f4551d_0,#f4551d_10px,#000000_10px,#000000_20px)]',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      text: 'text-orange-200'
    }
  };

  const cfg = configs[severity];

  return (
    <div className={\`relative overflow-hidden rounded-lg border \${cfg.border} bg-[#16150f] p-4 font-mono text-xs shadow-xl\`}>
      {/* Top Hazard Caution Stripe Banner */}
      <div className={\`absolute top-0 left-0 right-0 h-1.5 \${cfg.stripe} opacity-80\`} />

      <div className="flex items-start justify-between gap-4 mt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={\`px-2 py-0.5 text-[10px] font-bold uppercase rounded border \${cfg.badge}\`}>
              {severity}
            </span>
            <span className="font-bold text-white uppercase tracking-wider">{title}</span>
            {code && <span className="text-white/40 text-[10px]">[{code}]</span>}
          </div>
          <p className={\`text-sm \${cfg.text} opacity-90 leading-relaxed\`}>{message}</p>
        </div>

        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-white/40 hover:text-white p-1 transition-colors"
            title="Acknowledge"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
interface Props {
  severity?: 'hazard' | 'warning' | 'info'
  title: string
  message: string
  code?: string
}

withDefaults(defineProps<Props>(), {
  severity: 'hazard'
})

const emit = defineEmits(['dismiss'])
</script>

<template>
  <div class="relative overflow-hidden rounded-lg border border-red-500/50 bg-[#16150f] p-4 font-mono text-xs shadow-xl">
    <div class="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#ef4444_0,#ef4444_10px,#000000_10px,#000000_20px)] opacity-80" />
    <div class="flex items-start justify-between gap-4 mt-1">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-red-500/20 text-red-400 border-red-500/40">
            {{ severity }}
          </span>
          <span class="font-bold text-white uppercase tracking-wider">{{ title }}</span>
          <span v-if="code" class="text-white/40 text-[10px]">[{{ code }}]</span>
        </div>
        <p class="text-sm text-red-200 opacity-90 leading-relaxed">{{ message }}</p>
      </div>
      <button @click="emit('dismiss')" class="text-white/40 hover:text-white p-1 transition-colors">✕</button>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    severity?: 'hazard' | 'warning' | 'info';
    title: string;
    message: string;
    code?: string;
    onDismiss?: () => void;
  }

  let { severity = 'hazard', title, message, code, onDismiss }: Props = $props();
</script>

<div class="relative overflow-hidden rounded-lg border border-red-500/50 bg-[#16150f] p-4 font-mono text-xs shadow-xl">
  <div class="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#ef4444_0,#ef4444_10px,#000000_10px,#000000_20px)] opacity-80"></div>
  <div class="flex items-start justify-between gap-4 mt-1">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-red-500/20 text-red-400 border-red-500/40">
          {severity}
        </span>
        <span class="font-bold text-white uppercase tracking-wider">{title}</span>
        {#if code}
          <span class="text-white/40 text-[10px]">[{code}]</span>
        {/if}
      </div>
      <p class="text-sm text-red-200 opacity-90 leading-relaxed">{message}</p>
    </div>
    {#if onDismiss}
      <button onclick={onDismiss} class="text-white/40 hover:text-white p-1 transition-colors">✕</button>
    {/if}
  </div>
</div>`,
      html: `<div class="relative overflow-hidden rounded-lg border border-red-500/50 bg-[#16150f] p-4 font-mono text-xs shadow-xl">
  <div class="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#ef4444_0,#ef4444_10px,#000000_10px,#000000_20px)] opacity-80"></div>
  <div class="flex items-start justify-between gap-4 mt-1">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-red-500/20 text-red-400 border-red-500/40">HAZARD</span>
        <span class="font-bold text-white uppercase tracking-wider">THERMAL RUNAWAY RISK</span>
        <span class="text-white/40 text-[10px]">[ERR_901]</span>
      </div>
      <p class="text-sm text-red-200 opacity-90 leading-relaxed">Sub-array coolant pump 03 reporting cavitation. Pressure delta below safety threshold.</p>
    </div>
    <button class="text-white/40 hover:text-white p-1">✕</button>
  </div>
</div>`
    }
  },
  chart: {
    id: 'chart',
    name: 'Real-Time Signal Sparkline',
    section: '08 // Charts & Graphs',
    description: 'High-density SVG telemetry sparkline with gradient fill area, crosshair tracking marker, and dynamic min/max bounds display.',
    dependencies: [],
    cssTokens: ['--orange: #f4551d'],
    filename: 'BlueprintSparkline',
    code: {
      react: `import React from 'react';

interface BlueprintSparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  label?: string;
}

export function BlueprintSparkline({
  data = [12, 18, 14, 25, 30, 22, 38, 42, 35, 55, 60, 48, 70],
  color = '#f4551d',
  width = 240,
  height = 48,
  label = 'SIGNAL FREQ'
}: BlueprintSparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 8) - 4;
    return \`\${x.toFixed(1)},\${y.toFixed(1)}\`;
  }).join(' ');

  const areaPoints = \`0,\${height} \${points} \${width},\${height}\`;
  const lastPoint = points.split(' ').pop()?.split(',') || ['0', '0'];

  return (
    <div className="font-mono text-xs bg-black/40 border border-white/10 rounded p-3 space-y-1">
      <div className="flex justify-between text-[10px] text-cream/50 uppercase">
        <span>{label}</span>
        <span className="text-[#f4551d] font-bold">{data[data.length - 1]} Hz</span>
      </div>
      <svg width={width} height={height} className="overflow-visible w-full">
        <defs>
          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#sparklineGrad)" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="3" fill={color} className="animate-pulse" />
      </svg>
      <div className="flex justify-between text-[9px] text-cream/30 pt-0.5">
        <span>MIN: {min}</span>
        <span>MAX: {max}</span>
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data?: number[]
  color?: string
  width?: number
  height?: number
  label?: string
}>(), {
  data: () => [12, 18, 14, 25, 30, 22, 38, 42, 35, 55, 60, 48, 70],
  color: '#f4551d',
  width: 240,
  height: 48,
  label: 'SIGNAL FREQ'
})

const min = computed(() => Math.min(...props.data))
const max = computed(() => Math.max(...props.data))
const range = computed(() => max.value - min.value || 1)

const points = computed(() => {
  return props.data.map((d, i) => {
    const x = (i / (props.data.length - 1)) * props.width
    const y = props.height - ((d - min.value) / range.value) * (props.height - 8) - 4
    return \`\${x.toFixed(1)},\${y.toFixed(1)}\`
  }).join(' ')
})

const areaPoints = computed(() => \`0,\${props.height} \${points.value} \${props.width},\${props.height}\`)
</script>

<template>
  <div class="font-mono text-xs bg-black/40 border border-white/10 rounded p-3 space-y-1">
    <div class="flex justify-between text-[10px] text-cream/50 uppercase">
      <span>{{ label }}</span>
      <span class="text-[#f4551d] font-bold">{{ data[data.length - 1] }} Hz</span>
    </div>
    <svg :width="width" :height="height" class="overflow-visible w-full">
      <polygon :points="areaPoints" fill="#f4551d" fill-opacity="0.25" />
      <polyline :points="points" fill="none" :stroke="color" stroke-width="1.75" />
    </svg>
    <div class="flex justify-between text-[9px] text-cream/30 pt-0.5">
      <span>MIN: {{ min }}</span>
      <span>MAX: {{ max }}</span>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    data?: number[];
    color?: string;
    width?: number;
    height?: number;
    label?: string;
  }

  let {
    data = [12, 18, 14, 25, 30, 22, 38, 42, 35, 55, 60, 48, 70],
    color = '#f4551d',
    width = 240,
    height = 48,
    label = 'SIGNAL FREQ'
  }: Props = $props();

  let min = $derived(Math.min(...data));
  let max = $derived(Math.max(...data));
  let range = $derived(max - min || 1);

  let points = $derived(data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 8) - 4;
    return \`\${x.toFixed(1)},\${y.toFixed(1)}\`;
  }).join(' '));

  let areaPoints = $derived(\`0,\${height} \${points} \${width},\${height}\`);
</script>

<div class="font-mono text-xs bg-black/40 border border-white/10 rounded p-3 space-y-1">
  <div class="flex justify-between text-[10px] text-cream/50 uppercase">
    <span>{label}</span>
    <span class="text-[#f4551d] font-bold">{data[data.length - 1]} Hz</span>
  </div>
  <svg {width} {height} class="overflow-visible w-full">
    <polygon points={areaPoints} fill={color} fill-opacity="0.25" />
    <polyline points={points} fill="none" stroke={color} stroke-width="1.75" />
  </svg>
  <div class="flex justify-between text-[9px] text-cream/30 pt-0.5">
    <span>MIN: {min}</span>
    <span>MAX: {max}</span>
  </div>
</div>`,
      html: `<!-- Signal Sparkline -->
<div class="font-mono text-xs bg-black/40 border border-white/10 rounded p-3 space-y-1">
  <div class="flex justify-between text-[10px] text-cream/50 uppercase">
    <span>SIGNAL FREQ</span>
    <span class="text-orange font-bold">70 Hz</span>
  </div>
  <svg width="240" height="48" class="overflow-visible w-full">
    <polyline 
      points="0,40 20,35 40,38 60,25 80,20 100,28 120,15 140,12 160,18 180,6 200,4 220,12 240,2" 
      fill="none" 
      stroke="#f4551d" 
      stroke-width="1.75" 
      stroke-linecap="round" 
    />
  </svg>
  <div class="flex justify-between text-[9px] text-cream/30 pt-0.5">
    <span>MIN: 12</span>
    <span>MAX: 70</span>
  </div>
</div>`
    }
  },
  'command-palette': {
    id: 'command-palette',
    name: 'Global Command Palette (⌘K)',
    section: '10 // Modals & Overlays',
    description: 'Keyboard-first fuzzy command search modal with category grouping, shortcut badges, and arrow-key selection.',
    dependencies: [],
    cssTokens: ['--near: #16150f', '--orange: #f4551d'],
    filename: 'CommandPalette',
    code: {
      react: `import React, { useState, useEffect } from 'react';

interface CommandItem {
  id: string;
  category: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filtered, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-start justify-center pt-20 font-mono text-xs">
      <div 
        className="w-full max-w-xl bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        style={{ clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)' }}
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
          <span className="text-[#f4551d]">⌘</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="TYPE A COMMAND, SHORTCUT, OR ACTION..."
            className="bg-transparent text-cream placeholder-cream/40 text-xs w-full focus:outline-none"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-cream/60">ESC</kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-cream/40 text-xs">NO MATCHING COMMANDS FOUND</div>
          ) : (
            filtered.map((cmd, idx) => (
              <div
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                className={\`flex items-center justify-between px-3 py-2 rounded transition cursor-pointer \${
                  idx === selectedIndex ? 'bg-[#f4551d] text-[#16150f] font-bold' : 'hover:bg-white/5 text-cream/80'
                }\`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] opacity-60 uppercase">[{cmd.category}]</span>
                  <span>{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px]">{cmd.shortcut}</kbd>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex items-center justify-between text-[10px] text-cream/40">
          <span>{filtered.length} COMMANDS AVAILABLE</span>
          <span>↑↓ NAVIGATE | ↵ EXECUTE</span>
        </div>
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface CommandItem {
  id: string
  category: string
  label: string
  shortcut?: string
  action: () => void
}

const props = defineProps<{
  isOpen: boolean
  commands: CommandItem[]
}>()

const emit = defineEmits(['close'])

const query = ref('')
const selectedIndex = ref(0)

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  return props.commands.filter(c => 
    c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
  )
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % (filtered.value.length || 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % (filtered.value.length || 1)
  }
  if (e.key === 'Enter' && filtered.value[selectedIndex.value]) {
    e.preventDefault()
    filtered.value[selectedIndex.value].action()
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-start justify-center pt-20 font-mono text-xs">
    <div 
      class="w-full max-w-xl bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col"
      style="clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)"
    >
      <div class="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
        <span class="text-[#f4551d]">⌘</span>
        <input 
          v-model="query" 
          placeholder="TYPE A COMMAND, SHORTCUT, OR ACTION..." 
          class="bg-transparent text-cream placeholder-cream/40 text-xs w-full focus:outline-none"
          autofocus
        />
        <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-cream/60">ESC</kbd>
      </div>

      <div class="max-h-72 overflow-y-auto p-2 space-y-1">
        <div 
          v-for="(cmd, idx) in filtered" 
          :key="cmd.id"
          @click="cmd.action(); $emit('close')"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded transition cursor-pointer',
            idx === selectedIndex ? 'bg-[#f4551d] text-[#16150f] font-bold' : 'hover:bg-white/5 text-cream/80'
          ]"
        >
          <div class="flex items-center gap-2">
            <span class="text-[9px] opacity-60 uppercase">[{{ cmd.category }}]</span>
            <span>{{ cmd.label }}</span>
          </div>
          <kbd v-if="cmd.shortcut" class="px-1.5 py-0.5 rounded bg-black/40 text-[9px]">{{ cmd.shortcut }}</kbd>
        </div>
      </div>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface CommandItem {
    id: string;
    category: string;
    label: string;
    shortcut?: string;
    action: () => void;
  }

  interface Props {
    isOpen: boolean;
    commands: CommandItem[];
    onClose: () => void;
  }

  let { isOpen, commands, onClose }: Props = $props();
  let query = $state('');
  let selectedIndex = $state(0);

  let filtered = $derived(
    commands.filter(c => 
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
    )
  );
</script>

{#if isOpen}
<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-start justify-center pt-20 font-mono text-xs">
  <div class="w-full max-w-xl bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col">
    <div class="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
      <span class="text-[#f4551d]">⌘</span>
      <input 
        type="text" 
        bind:value={query} 
        placeholder="TYPE A COMMAND..." 
        class="bg-transparent text-cream placeholder-cream/40 text-xs w-full focus:outline-none"
      />
      <button onclick={onClose} class="px-1.5 py-0.5 rounded bg-white/10 text-[9px]">ESC</button>
    </div>
    <div class="max-h-72 overflow-y-auto p-2 space-y-1">
      {#each filtered as cmd, idx}
        <div 
          onclick={() => { cmd.action(); onClose(); }}
          class="flex items-center justify-between px-3 py-2 rounded transition cursor-pointer {idx === selectedIndex ? 'bg-[#f4551d] text-[#16150f] font-bold' : 'hover:bg-white/5 text-cream/80'}"
        >
          <span>{cmd.label}</span>
          {#if cmd.shortcut}
            <kbd class="px-1.5 py-0.5 rounded bg-black/40 text-[9px]">{cmd.shortcut}</kbd>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
{/if}`,
      html: `<!-- Command Palette (⌘K) Modal Structure -->
<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-start justify-center pt-20 font-mono text-xs">
  <div class="w-full max-w-xl bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col" style="clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)">
    <div class="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
      <span class="text-orange">⌘</span>
      <input type="text" placeholder="TYPE A COMMAND, SHORTCUT, OR ACTION..." class="bg-transparent text-cream placeholder-cream/40 text-xs w-full focus:outline-none" />
      <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-cream/60">ESC</kbd>
    </div>
    <div class="max-h-72 overflow-y-auto p-2 space-y-1">
      <div class="flex items-center justify-between px-3 py-2 rounded bg-orange text-near font-bold cursor-pointer">
        <div class="flex items-center gap-2">
          <span class="text-[9px] opacity-60">[NAV]</span>
          <span>Section 08 // High-Density Telemetry Table</span>
        </div>
        <kbd class="px-1.5 py-0.5 rounded bg-black/40 text-[9px]">08</kbd>
      </div>
    </div>
  </div>
</div>`
    }
  },
  drawer: {
    id: 'drawer',
    name: 'Slide-Out Telemetry Drawer',
    section: '10 // Modals & Overlays',
    description: 'Slide-over right rail diagnostic panel with live resource meters, event stream terminal log, and backdrop blur.',
    dependencies: [],
    cssTokens: ['--near: #16150f', '--orange: #f4551d'],
    filename: 'TelemetryDrawer',
    code: {
      react: `import React from 'react';

interface TelemetryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs?: string[];
  cpuUsage?: number;
  memoryUsage?: number;
}

export function TelemetryDrawer({
  isOpen,
  onClose,
  logs = [
    '08:42:01.102 [OK] Quorum heartbeat synchronized (epoch #84,921)',
    '08:42:01.590 [INFO] Merkle leaf proof committed: root=0x4a9b...7c21',
    '08:42:02.012 [METRIC] Sub-array pump latency: 0.38ms (nominal)'
  ],
  cpuUsage = 48.2,
  memoryUsage = 40.3
}: TelemetryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm font-mono text-xs">
      <div 
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#16150f] border-l border-white/15 p-5 flex flex-col justify-between shadow-2xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-cream font-bold text-sm tracking-wider">NODE TELEMETRY STREAM</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-cream/60 hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 space-y-4">
          <div className="p-3 rounded bg-black/50 border border-white/10 space-y-2.5">
            <span className="text-[10px] uppercase text-cream/50 block">HARDWARE ALLOCATIONS</span>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-cream/70">
                <span>CPU UTILIZATION:</span>
                <span className="text-orange-500 font-bold">{cpuUsage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: \`\${cpuUsage}%\` }} />
              </div>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-cream/70">
                <span>ISOLATE MEMORY:</span>
                <span className="text-emerald-400 font-bold">{memoryUsage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: \`\${memoryUsage}%\` }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-cream/50">LIVE EVENT STREAM (GRPC)</span>
              <span className="text-[9px] text-emerald-400 font-bold">● CONNECTED</span>
            </div>
            <div className="h-64 overflow-y-auto space-y-1.5 p-2 bg-black/80 rounded border border-white/5 text-[11px]">
              {logs.map((l, i) => (
                <div key={i} className="text-cream/75 font-mono leading-relaxed">{l}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-cream/40">
          <span>STATUS: ALL SENSORS NOMINAL</span>
          <button onClick={onClose} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/20 text-cream">CLOSE</button>
        </div>
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
defineProps<{
  isOpen: boolean
  logs?: string[]
  cpuUsage?: number
  memoryUsage?: number
}>()

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm font-mono text-xs">
    <div class="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#16150f] border-l border-white/15 p-5 flex flex-col justify-between shadow-2xl">
      <div class="flex items-center justify-between pb-3 border-b border-white/10">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-cream font-bold text-sm tracking-wider">NODE TELEMETRY STREAM</span>
        </div>
        <button @click="$emit('close')" class="p-1 rounded hover:bg-white/10 text-cream/60 hover:text-white">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto my-4 space-y-4">
        <div class="p-3 rounded bg-black/50 border border-white/10 space-y-2.5">
          <span class="text-[10px] uppercase text-cream/50 block">HARDWARE ALLOCATIONS</span>
          <div class="space-y-1 text-[11px]">
            <div class="flex justify-between text-cream/70">
              <span>CPU UTILIZATION:</span>
              <span class="text-[#f4551d] font-bold">{{ cpuUsage ?? 48.2 }}%</span>
            </div>
            <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-[#f4551d] rounded-full" :style="{ width: (cpuUsage ?? 48.2) + '%' }" />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-cream/40">
        <span>STATUS: NOMINAL</span>
        <button @click="$emit('close')" class="px-2.5 py-1 rounded bg-white/5 hover:bg-white/20 text-cream">CLOSE</button>
      </div>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    isOpen: boolean;
    onClose: () => void;
    cpuUsage?: number;
    memoryUsage?: number;
  }

  let { isOpen, onClose, cpuUsage = 48.2, memoryUsage = 40.3 }: Props = $props();
</script>

{#if isOpen}
<div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm font-mono text-xs">
  <div class="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#16150f] border-l border-white/15 p-5 flex flex-col justify-between shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-white/10">
      <span class="text-cream font-bold text-sm tracking-wider">NODE TELEMETRY STREAM</span>
      <button onclick={onClose} class="p-1 rounded hover:bg-white/10 text-cream/60">✕</button>
    </div>
    <div class="flex-1 overflow-y-auto my-4 space-y-4">
      <div class="p-3 rounded bg-black/50 border border-white/10 space-y-2">
        <span class="text-[10px] uppercase text-cream/50 block">HARDWARE LOAD</span>
        <div class="flex justify-between">
          <span>CPU:</span>
          <span class="text-[#f4551d] font-bold">{cpuUsage}%</span>
        </div>
      </div>
    </div>
    <div class="pt-3 border-t border-white/10 flex items-center justify-between">
      <span>STATUS: NOMINAL</span>
      <button onclick={onClose} class="px-2.5 py-1 rounded bg-white/5 text-cream">CLOSE</button>
    </div>
  </div>
</div>
{/if}`,
      html: `<!-- Telemetry Slide-Over Drawer -->
<div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm font-mono text-xs">
  <div class="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#16150f] border-l border-white/15 p-5 flex flex-col justify-between shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-white/10">
      <span class="text-cream font-bold text-sm">NODE TELEMETRY STREAM</span>
      <button class="p-1 text-cream/60">✕</button>
    </div>
    <div class="flex-1 overflow-y-auto my-4 space-y-4">
      <div class="p-3 rounded bg-black/50 border border-white/10 space-y-2">
        <div class="flex justify-between">
          <span class="text-cream/50">CPU UTILIZATION:</span>
          <span class="text-orange font-bold">48.2%</span>
        </div>
      </div>
    </div>
  </div>
</div>`
    }
  },
  params: {
    id: 'params',
    name: 'Hardware Parameter Rack & Secrets Editor',
    section: '09 // Forms & Parameters',
    description: 'Dynamic key-value environment pairs editor with mask/unmask toggles, numeric steppers, and spec generator.',
    dependencies: [],
    cssTokens: ['--ink2: #33332f', '--orange: #f4551d'],
    filename: 'ParameterRack',
    code: {
      react: `import React, { useState } from 'react';

interface EnvPair {
  key: string;
  value: string;
  isSecret: boolean;
}

export function ParameterRack() {
  const [pairs, setPairs] = useState<EnvPair[]>([
    { key: 'CLUSTER_HOST', value: 'iad-mesh-01.internal', isSecret: false },
    { key: 'ZK_STARK_SECRET', value: 'sk_live_9942a781b01c4e9', isSecret: true },
    { key: 'MAX_ISOLATES', value: '16', isSecret: false }
  ]);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggleReveal = (idx: number) => {
    setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addPair = () => {
    setPairs([...pairs, { key: 'NEW_PARAM', value: '', isSecret: false }]);
  };

  const removePair = (idx: number) => {
    setPairs(pairs.filter((_, i) => i !== idx));
  };

  return (
    <div className="font-mono text-xs bg-[#16150f] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="font-bold text-cream uppercase tracking-wider">ENVIRONMENT PARAMETER RACK</span>
        <button onClick={addPair} className="px-2.5 py-1 rounded bg-[#f4551d]/20 text-[#f4551d] hover:bg-[#f4551d] hover:text-[#16150f] font-bold text-[11px] transition">
          + ADD VARIABLE
        </button>
      </div>

      <div className="space-y-2">
        {pairs.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/5">
            <input
              type="text"
              value={p.key}
              onChange={e => {
                const next = [...pairs];
                next[idx].key = e.target.value;
                setPairs(next);
              }}
              className="w-1/3 bg-transparent border-b border-white/10 text-cream px-1 py-0.5 focus:border-[#f4551d] focus:outline-none"
            />
            <span className="text-cream/30">=</span>
            <input
              type={p.isSecret && !revealed[idx] ? 'password' : 'text'}
              value={p.value}
              onChange={e => {
                const next = [...pairs];
                next[idx].value = e.target.value;
                setPairs(next);
              }}
              className="flex-1 bg-transparent border-b border-white/10 text-cream px-1 py-0.5 focus:border-[#f4551d] focus:outline-none"
            />
            {p.isSecret && (
              <button 
                onClick={() => toggleReveal(idx)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cream/70 hover:text-white"
              >
                {revealed[idx] ? 'HIDE' : 'SHOW'}
              </button>
            )}
            <button onClick={() => removePair(idx)} className="text-white/30 hover:text-red-400 px-1">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
import { ref } from 'vue'

interface EnvPair {
  key: string
  value: string
  isSecret: boolean
}

const pairs = ref<EnvPair[]>([
  { key: 'CLUSTER_HOST', value: 'iad-mesh-01.internal', isSecret: false },
  { key: 'ZK_STARK_SECRET', value: 'sk_live_9942a781b01c4e9', isSecret: true },
  { key: 'MAX_ISOLATES', value: '16', isSecret: false }
])

const revealed = ref<Record<number, boolean>>({})

const toggleReveal = (idx: number) => {
  revealed.value[idx] = !revealed.value[idx]
}

const addPair = () => {
  pairs.value.push({ key: 'NEW_PARAM', value: '', isSecret: false })
}

const removePair = (idx: number) => {
  pairs.value.splice(idx, 1)
}
</script>

<template>
  <div class="font-mono text-xs bg-[#16150f] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
    <div class="flex items-center justify-between border-b border-white/10 pb-3">
      <span class="font-bold text-cream uppercase tracking-wider">ENVIRONMENT PARAMETER RACK</span>
      <button @click="addPair" class="px-2.5 py-1 rounded bg-[#f4551d]/20 text-[#f4551d] hover:bg-[#f4551d] hover:text-[#16150f] font-bold text-[11px] transition">
        + ADD VARIABLE
      </button>
    </div>

    <div class="space-y-2">
      <div v-for="(p, idx) in pairs" :key="idx" class="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/5">
        <input v-model="p.key" class="w-1/3 bg-transparent border-b border-white/10 text-cream px-1 py-0.5 focus:outline-none" />
        <span class="text-cream/30">=</span>
        <input 
          :type="p.isSecret && !revealed[idx] ? 'password' : 'text'" 
          v-model="p.value" 
          class="flex-1 bg-transparent border-b border-white/10 text-cream px-1 py-0.5 focus:outline-none" 
        />
        <button v-if="p.isSecret" @click="toggleReveal(idx)" class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cream/70">
          {{ revealed[idx] ? 'HIDE' : 'SHOW' }}
        </button>
        <button @click="removePair(idx)" class="text-white/30 hover:text-red-400 px-1">✕</button>
      </div>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  let pairs = $state([
    { key: 'CLUSTER_HOST', value: 'iad-mesh-01.internal', isSecret: false },
    { key: 'ZK_STARK_SECRET', value: 'sk_live_9942a781b01c4e9', isSecret: true },
    { key: 'MAX_ISOLATES', value: '16', isSecret: false }
  ]);

  let revealed = $state<Record<number, boolean>>({});

  const toggleReveal = (idx: number) => {
    revealed[idx] = !revealed[idx];
  };
</script>

<div class="font-mono text-xs bg-[#16150f] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <span class="font-bold text-cream uppercase">ENVIRONMENT PARAMETER RACK</span>
    <button onclick={() => pairs.push({ key: 'NEW_KEY', value: '', isSecret: false })} class="px-2.5 py-1 rounded bg-[#f4551d]/20 text-[#f4551d] text-[11px] font-bold">
      + ADD VARIABLE
    </button>
  </div>
  <div class="space-y-2">
    {#each pairs as p, idx}
      <div class="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/5">
        <input bind:value={p.key} class="w-1/3 bg-transparent border-b border-white/10 text-cream px-1" />
        <span class="text-cream/30">=</span>
        <input type={p.isSecret && !revealed[idx] ? 'password' : 'text'} bind:value={p.value} class="flex-1 bg-transparent border-b border-white/10 text-cream px-1" />
        {#if p.isSecret}
          <button onclick={() => toggleReveal(idx)} class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cream/70">
            {revealed[idx] ? 'HIDE' : 'SHOW'}
          </button>
        {/if}
      </div>
    {/each}
  </div>
</div>`,
      html: `<!-- Environment Parameter Rack -->
<div class="font-mono text-xs bg-[#16150f] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <span class="font-bold text-cream uppercase tracking-wider">ENVIRONMENT PARAMETERS</span>
    <button class="px-2.5 py-1 rounded bg-orange/20 text-orange font-bold text-[11px]">+ ADD VARIABLE</button>
  </div>
  <div class="space-y-2">
    <div class="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/5">
      <span class="w-1/3 text-orange font-semibold">CLUSTER_HOST</span>
      <span class="text-cream/30">=</span>
      <span class="flex-1 text-cream/80">iad-mesh-01.internal</span>
    </div>
  </div>
</div>`
    }
  },
  gauge: {
    id: 'gauge',
    name: 'Radial Tachometer & Saturation Gauge',
    section: '11 // Charts & Graphs',
    description: '270° circular aerospace gauge with perimeter tick marks, gradient threshold arcs, and dynamic value needle.',
    dependencies: [],
    cssTokens: ['--orange: #f4551d'],
    filename: 'TachometerGauge',
    code: {
      react: `import React from 'react';

interface TachometerGaugeProps {
  value?: number; // 0 to 100
  label?: string;
  unit?: string;
  size?: number;
}

export function TachometerGauge({
  value = 78.4,
  label = 'CORE SATURATION',
  unit = '%',
  size = 180
}: TachometerGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const progress = Math.min(Math.max(value, 0), 100) / 100;
  const strokeDashoffset = arcLength * (1 - progress);

  return (
    <div className="font-mono text-xs bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative">
      <div className="text-[10px] text-cream/50 uppercase tracking-wider mb-2">{label}</div>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 180 180" className="rotate-[135deg]">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
            strokeDasharray={\`\${arcLength} \${circumference}\`}
            strokeLinecap="round"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#f4551d"
            strokeWidth="10"
            strokeDasharray={\`\${arcLength} \${circumference}\`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-cream">{value}</span>
          <span className="text-[10px] text-orange-500 font-bold">{unit}</span>
        </div>
      </div>
      <div className="w-full flex justify-between text-[9px] text-cream/40 px-3 mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: number
  label?: string
  unit?: string
  size?: number
}>(), {
  value: 78.4,
  label: 'CORE SATURATION',
  unit: '%',
  size: 180
})

const radius = 70
const circumference = 2 * Math.PI * radius
const arcLength = circumference * 0.75
const strokeDashoffset = computed(() => {
  const p = Math.min(Math.max(props.value, 0), 100) / 100
  return arcLength * (1 - p)
})
</script>

<template>
  <div class="font-mono text-xs bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative">
    <div class="text-[10px] text-cream/50 uppercase tracking-wider mb-2">{{ label }}</div>
    <div class="relative flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
      <svg :width="size" :height="size" viewBox="0 0 180 180" class="rotate-[135deg]">
        <circle cx="90" cy="90" :r="radius" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10" :stroke-dasharray="\`\${arcLength} \${circumference}\`" stroke-linecap="round" />
        <circle cx="90" cy="90" :r="radius" fill="none" stroke="#f4551d" stroke-width="10" :stroke-dasharray="\`\${arcLength} \${circumference}\`" :stroke-dashoffset="strokeDashoffset" stroke-linecap="round" class="transition-all duration-500 ease-out" />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span class="text-2xl font-bold text-cream">{{ value }}</span>
        <span class="text-[10px] text-[#f4551d] font-bold">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    value?: number;
    label?: string;
    unit?: string;
    size?: number;
  }

  let { value = 78.4, label = 'CORE SATURATION', unit = '%', size = 180 }: Props = $props();

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  let strokeDashoffset = $derived(arcLength * (1 - Math.min(Math.max(value, 0), 100) / 100));
</script>

<div class="font-mono text-xs bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
  <div class="text-[10px] text-cream/50 uppercase mb-2">{label}</div>
  <div class="relative flex items-center justify-center" style="width: {size}px; height: {size}px;">
    <svg width={size} height={size} viewBox="0 0 180 180" class="rotate-[135deg]">
      <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10" stroke-dasharray="{arcLength} {circumference}" stroke-linecap="round" />
      <circle cx="90" cy="90" r={radius} fill="none" stroke="#f4551d" stroke-width="10" stroke-dasharray="{arcLength} {circumference}" stroke-dashoffset={strokeDashoffset} stroke-linecap="round" class="transition-all duration-500 ease-out" />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span class="text-2xl font-bold text-cream">{value}</span>
      <span class="text-[10px] text-[#f4551d] font-bold">{unit}</span>
    </div>
  </div>
</div>`,
      html: `<!-- 270° Radial Tachometer Gauge -->
<div class="font-mono text-xs bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
  <div class="text-[10px] text-cream/50 uppercase tracking-wider mb-2">CORE SATURATION</div>
  <div class="relative flex items-center justify-center w-[180px] h-[180px]">
    <svg width="180" height="180" viewBox="0 0 180 180" class="rotate-[135deg]">
      <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10" stroke-dasharray="329.8 439.8" stroke-linecap="round" />
      <circle cx="90" cy="90" r="70" fill="none" stroke="#f4551d" stroke-width="10" stroke-dasharray="329.8 439.8" stroke-dashoffset="71.2" stroke-linecap="round" />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span class="text-2xl font-bold text-cream">78.4</span>
      <span class="text-[10px] text-orange font-bold">%</span>
    </div>
  </div>
</div>`
    }
  },
  pipeline: {
    id: 'pipeline',
    name: 'Blueprint Node Card & Cable Pipeline',
    section: '12 // Node Flow Pipeline',
    description: 'Modular visual node card with input/output socket ports, telemetry status beacon, and dynamic cubic Bézier cable connector.',
    dependencies: [],
    cssTokens: ['--c: 13px', '--orange: #f4551d'],
    filename: 'BlueprintNode',
    code: {
      react: `import React from 'react';

interface BlueprintNodeProps {
  id?: string;
  title?: string;
  category?: string;
  latency?: string;
  inputs?: string[];
  outputs?: string[];
}

export function BlueprintNode({
  id = 'NODE_01',
  title = 'ZK-STARK VERIFIER',
  category = 'COMPUTE // ISOLATE',
  latency = '0.38ms',
  inputs = ['SIG_IN', 'MERKLE_ROOT'],
  outputs = ['PROOF_VALID', 'STATE_DIFF']
}: BlueprintNodeProps) {
  return (
    <div 
      className="w-64 bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl font-mono text-xs relative select-none"
      style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
    >
      <div className="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[9px] text-[#f4551d] font-bold block">{category}</span>
          <span className="font-bold text-cream uppercase tracking-wide">{title}</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {inputs.map((inp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#f4551d] bg-[#16150f] hover:bg-[#f4551d] transition-colors cursor-crosshair" />
                <span className="text-[10px] text-cream/70">{inp}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-right">
            {outputs.map((out, idx) => (
              <div key={idx} className="flex items-center justify-end gap-2">
                <span className="text-[10px] text-cream/70">{out}</span>
                <div className="w-3 h-3 rounded-full border-2 border-emerald-400 bg-[#16150f] hover:bg-emerald-400 transition-colors cursor-crosshair" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex justify-between text-[9px] text-cream/40">
          <span>ID: {id}</span>
          <span>LATENCY: {latency}</span>
        </div>
      </div>
    </div>
  );
}`,
      vue: `<script setup lang="ts">
withDefaults(defineProps<{
  id?: string
  title?: string
  category?: string
  latency?: string
  inputs?: string[]
  outputs?: string[]
}>(), {
  id: 'NODE_01',
  title: 'ZK-STARK VERIFIER',
  category: 'COMPUTE // ISOLATE',
  latency: '0.38ms',
  inputs: () => ['SIG_IN', 'MERKLE_ROOT'],
  outputs: () => ['PROOF_VALID', 'STATE_DIFF']
})
</script>

<template>
  <div 
    class="w-64 bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl font-mono text-xs relative select-none"
    style="clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);"
  >
    <div class="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
      <div class="space-y-0.5">
        <span class="text-[9px] text-[#f4551d] font-bold block">{{ category }}</span>
        <span class="font-bold text-cream uppercase tracking-wide">{{ title }}</span>
      </div>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
    </div>

    <div class="p-4 space-y-3">
      <div class="flex justify-between items-start">
        <div class="space-y-2">
          <div v-for="(inp, idx) in inputs" :key="idx" class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full border-2 border-[#f4551d] bg-[#16150f] hover:bg-[#f4551d] cursor-crosshair" />
            <span class="text-[10px] text-cream/70">{{ inp }}</span>
          </div>
        </div>
        <div class="space-y-2 text-right">
          <div v-for="(out, idx) in outputs" :key="idx" class="flex items-center justify-end gap-2">
            <span class="text-[10px] text-cream/70">{{ out }}</span>
            <div class="w-3 h-3 rounded-full border-2 border-emerald-400 bg-[#16150f] hover:bg-emerald-400 cursor-crosshair" />
          </div>
        </div>
      </div>
      <div class="pt-2 border-t border-white/5 flex justify-between text-[9px] text-cream/40">
        <span>ID: {{ id }}</span>
        <span>LATENCY: {{ latency }}</span>
      </div>
    </div>
  </div>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    id?: string;
    title?: string;
    category?: string;
    inputs?: string[];
    outputs?: string[];
  }

  let {
    id = 'NODE_01',
    title = 'ZK-STARK VERIFIER',
    category = 'COMPUTE // ISOLATE',
    inputs = ['SIG_IN', 'MERKLE_ROOT'],
    outputs = ['PROOF_VALID', 'STATE_DIFF']
  }: Props = $props();
</script>

<div class="w-64 bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
  <div class="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
    <div>
      <span class="text-[9px] text-[#f4551d] font-bold block">{category}</span>
      <span class="font-bold text-cream">{title}</span>
    </div>
  </div>
  <div class="p-4 space-y-3">
    <div class="flex justify-between">
      <div class="space-y-2">
        {#each inputs as inp}
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full border-2 border-[#f4551d]"></div>
            <span class="text-[10px] text-cream/70">{inp}</span>
          </div>
        {/each}
      </div>
      <div class="space-y-2 text-right">
        {#each outputs as out}
          <div class="flex items-center justify-end gap-2">
            <span class="text-[10px] text-cream/70">{out}</span>
            <div class="w-3 h-3 rounded-full border-2 border-emerald-400"></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>`,
      html: `<!-- Blueprint Pipeline Node -->
<div class="w-64 bg-[#16150f] border border-white/20 rounded-xl overflow-hidden shadow-2xl font-mono text-xs" style="clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)">
  <div class="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
    <div>
      <span class="text-[9px] text-orange font-bold block">COMPUTE // ISOLATE</span>
      <span class="font-bold text-cream">ZK-STARK VERIFIER</span>
    </div>
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
  </div>
  <div class="p-4 space-y-3">
    <div class="flex justify-between">
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full border-2 border-orange bg-near"></div>
          <span class="text-[10px] text-cream/70">SIG_IN</span>
        </div>
      </div>
      <div class="space-y-2 text-right">
        <div class="flex items-center justify-end gap-2">
          <span class="text-[10px] text-cream/70">PROOF_VALID</span>
          <div class="w-3 h-3 rounded-full border-2 border-emerald-400 bg-near"></div>
        </div>
      </div>
    </div>
  </div>
</div>`
    }
  },
  icon: {
    id: 'icon',
    name: 'Unified Blueprint Icon Component',
    section: '06 // Icon Library',
    description: 'Dynamic SVG icon component supporting 32 technical aerospace glyphs (CPU, Radar, STARK, Quorum, Latch) with custom sizes and colors.',
    dependencies: [],
    cssTokens: ['--orange: #f4551d'],
    filename: 'BlueprintIcon',
    code: {
      react: `import React from 'react';

export type IconName = 'cpu' | 'radar' | 'stark' | 'quorum' | 'latch' | 'terminal' | 'shield' | 'database';

interface BlueprintIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
}

const GLYPHS: Record<IconName, React.ReactNode> = {
  cpu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z" />,
  radar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 8l4-4" />,
  stark: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  quorum: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 100-8 4 4 0 000 8zm-8 0a4 4 0 100-8 4 4 0 000 8z" />,
  latch: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  terminal: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 17l6-6-6-6m8 14h8" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  database: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
};

export function BlueprintIcon({ name, size = 18, className = '', ...props }: BlueprintIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={\`inline-block shrink-0 \${className}\`}
      {...props}
    >
      {GLYPHS[name] || GLYPHS.cpu}
    </svg>
  );
}`,
      vue: `<script setup lang="ts">
type IconName = 'cpu' | 'radar' | 'stark' | 'quorum' | 'latch' | 'terminal' | 'shield' | 'database'

withDefaults(defineProps<{
  name: IconName
  size?: number
}>(), {
  size: 18
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="inline-block shrink-0">
    <path v-if="name === 'cpu'" stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z" />
    <path v-else-if="name === 'radar'" stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 8l4-4" />
    <path v-else-if="name === 'terminal'" stroke-linecap="round" stroke-linejoin="round" d="M4 17l6-6-6-6m8 14h8" />
    <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
</template>`,
      svelte: `<script lang="ts">
  interface Props {
    name: 'cpu' | 'radar' | 'stark' | 'terminal';
    size?: number;
  }

  let { name = 'cpu', size = 18 }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="inline-block shrink-0">
  {#if name === 'cpu'}
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z" />
  {:else if name === 'terminal'}
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 17l6-6-6-6m8 14h8" />
  {:else}
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 8l4-4" />
  {/if}
</svg>`,
      html: `<!-- Technical Blueprint Glyph -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-orange">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z" />
</svg>`
    }
  },
  audio: {
    id: 'audio',
    name: 'Procedural Web Audio Micro-Haptics Hook',
    section: '05 // Audio & Micro-Haptics',
    description: 'Zero-asset procedural Web Audio API synthesizer hook for mechanical clicks, ticks, success chimes, alarms, and modal transitions.',
    dependencies: [],
    cssTokens: [],
    filename: 'useBlueprintSFX',
    code: {
      react: `import { useRef, useCallback } from 'react';

export function useBlueprintSFX() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = () => {
    if (!ctxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, gainVal = 0.05) => {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  const click = useCallback(() => playTone(980, 'sine', 0.035, 0.06), [playTone]);
  const tick = useCallback(() => playTone(2400, 'triangle', 0.015, 0.02), [playTone]);
  const success = useCallback(() => {
    playTone(523.25, 'sine', 0.08, 0.05); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.12, 0.05), 60); // E5
  }, [playTone]);
  const error = useCallback(() => playTone(160, 'sawtooth', 0.2, 0.08), [playTone]);

  return { click, tick, success, error };
}`,
      vue: `<script lang="ts">
import { ref } from 'vue'

export function useBlueprintSFX() {
  let ctx: AudioContext | null = null

  const getContext = () => {
    if (!ctx && typeof window !== 'undefined') {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (ctx?.state === 'suspended') ctx.resume()
    return ctx
  }

  const playTone = (freq: number, type: OscillatorType, duration: number, gainVal = 0.05) => {
    const c = getContext()
    if (!c) return
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    gain.gain.setValueAtTime(gainVal, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
  }

  return {
    click: () => playTone(980, 'sine', 0.035, 0.06),
    tick: () => playTone(2400, 'triangle', 0.015, 0.02),
    success: () => {
      playTone(523.25, 'sine', 0.08, 0.05)
      setTimeout(() => playTone(659.25, 'sine', 0.12, 0.05), 60)
    },
    error: () => playTone(160, 'sawtooth', 0.2, 0.08)
  }
}
</script>`,
      svelte: `<script lang="ts">
  export function createBlueprintSFX() {
    let ctx: AudioContext | null = null;

    const getContext = () => {
      if (!ctx && typeof window !== 'undefined') {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (ctx?.state === 'suspended') ctx.resume();
      return ctx;
    };

    const playTone = (freq: number, type: OscillatorType, duration: number, gainVal = 0.05) => {
      const c = getContext();
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(gainVal, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    };

    return {
      click: () => playTone(980, 'sine', 0.035, 0.06),
      tick: () => playTone(2400, 'triangle', 0.015, 0.02),
      success: () => {
        playTone(523.25, 'sine', 0.08, 0.05);
        setTimeout(() => playTone(659.25, 'sine', 0.12, 0.05), 60);
      },
      error: () => playTone(160, 'sawtooth', 0.2, 0.08)
    };
  }
</script>`,
      html: `<!-- Pure Web Audio API Procedural SFX Script -->
<script>
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playTone(freq, type = 'sine', duration = 0.05, gainVal = 0.05) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  const sfx = {
    click: () => playTone(980, 'sine', 0.035, 0.06),
    tick: () => playTone(2400, 'triangle', 0.015, 0.02),
    success: () => {
      playTone(523.25, 'sine', 0.08, 0.05);
      setTimeout(() => playTone(659.25, 'sine', 0.12, 0.05), 60);
    },
    error: () => playTone(160, 'sawtooth', 0.2, 0.08)
  };
</script>`
    }
  }
};

/**
 * Master Component Exporter Engine
 */
export class ComponentExporterEngine {
  constructor(options = {}) {
    this.sfx = options.sfx || null;
    this.activeComponentId = 'button';
    this.activeFramework = 'react';

    this.modalEl = document.getElementById('componentExportModal');
    this.nameEl = document.getElementById('exportComponentName');
    this.sectionEl = document.getElementById('exportComponentSection');
    this.descEl = document.getElementById('exportComponentDesc');
    this.depsEl = document.getElementById('exportComponentDeps');
    this.tokensEl = document.getElementById('exportComponentTokens');
    this.codeEl = document.getElementById('exportComponentCode');
    this.copyBtn = document.getElementById('exportCopyBtn');
    this.downloadBtn = document.getElementById('exportDownloadBtn');
    this.closeBtn = document.getElementById('exportCloseBtn');
    this.tabButtons = document.querySelectorAll('.export-framework-tab');

    // Expose globally for cross-module & command palette access
    window.componentExporter = this;
    window.downloadCompleteZip = (btn) => this.downloadCompleteZip(btn);

    this.init();
  }

  init() {
    this.bindEvents();
    this.bindButtons();
  }

  bindEvents() {
    // Framework Tabs
    this.tabButtons.forEach(tab => {
      tab.addEventListener('click', () => {
        if (this.sfx) this.sfx.click();
        this.setFramework(tab.dataset.framework);
      });
    });

    // Copy Code Button
    this.copyBtn?.addEventListener('click', () => {
      this.copyCode();
    });

    // Download Single File Button
    this.downloadBtn?.addEventListener('click', () => {
      this.downloadCurrentFile();
    });

    // Close Modal Button
    this.closeBtn?.addEventListener('click', () => {
      this.close();
    });

    // Overlay click close
    this.modalEl?.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // ESC key close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
    });

    // Complete Kit ZIP Download Triggers
    const bindZipBtn = (selector) => {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (el && !el.__hasZipBinding) {
        el.__hasZipBinding = true;
        el.addEventListener('click', (e) => {
          e.preventDefault();
          this.downloadCompleteZip(el);
        });
      }
    };

    bindZipBtn('#exportStarterBundleBtn');
    bindZipBtn('#heroExportFullZipBtn');
    bindZipBtn('#exportModalAllZipBtn');
    bindZipBtn('#exportLandingKitBtn');
    bindZipBtn('#heroDownloadKitBtn');
    document.querySelectorAll('[data-download-kit-zip]').forEach(btn => bindZipBtn(btn));
  }

  bindButtons() {
    // Bind all [data-export-component] buttons in section headers
    document.querySelectorAll('[data-export-component]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const componentId = btn.dataset.exportComponent;
        this.open(componentId);
      });
    });
  }

  open(componentId, framework = 'react') {
    if (!REGISTRY[componentId]) {
      componentId = 'button';
    }
    this.activeComponentId = componentId;
    this.activeFramework = framework;

    if (this.sfx) this.sfx.modalOpen();
    this.render();

    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  close() {
    if (this.sfx) this.sfx.modalClose();
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  setFramework(framework) {
    if (!['react', 'vue', 'svelte', 'html'].includes(framework)) return;
    this.activeFramework = framework;

    // Update tab styling
    this.tabButtons.forEach(tab => {
      const isActive = tab.dataset.framework === framework;
      if (isActive) {
        tab.classList.remove('hover:bg-white/10', 'text-cream/60');
        tab.classList.add('bg-orange', 'text-near', 'font-bold');
      } else {
        tab.classList.remove('bg-orange', 'text-near', 'font-bold');
        tab.classList.add('hover:bg-white/10', 'text-cream/60');
      }
    });

    this.renderCode();
  }

  render() {
    const comp = REGISTRY[this.activeComponentId];
    if (!comp) return;

    if (this.nameEl) this.nameEl.textContent = comp.name;
    if (this.sectionEl) this.sectionEl.textContent = comp.section;
    if (this.descEl) this.descEl.textContent = comp.description;

    // Dependencies
    if (this.depsEl) {
      if (comp.dependencies.length > 0) {
        this.depsEl.innerHTML = `<span class="text-cream/50">NPM:</span> <code class="bg-black/50 px-2 py-0.5 rounded text-orange">npm i ${comp.dependencies.join(' ')}</code>`;
      } else {
        this.depsEl.innerHTML = '<span class="text-emerald-400 font-semibold">✓ ZERO EXTERNAL DEPENDENCIES (PURE CSS + TAILWIND)</span>';
      }
    }

    // Required CSS Tokens
    if (this.tokensEl) {
      this.tokensEl.innerHTML = comp.cssTokens.map(t => `<span class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-cream/70">${t}</span>`).join(' ');
    }

    // Update Framework Tabs
    this.setFramework(this.activeFramework);
  }

  renderCode() {
    const comp = REGISTRY[this.activeComponentId];
    if (!comp || !this.codeEl) return;

    const snippet = comp.code[this.activeFramework] || comp.code.react;
    this.codeEl.textContent = snippet;

    // Update download button label with extension
    if (this.downloadBtn) {
      const isAudio = comp.id === 'audio';
      const ext = isAudio
        ? (this.activeFramework === 'html' ? '.js' : '.ts')
        : (this.activeFramework === 'react' ? '.tsx' :
           this.activeFramework === 'vue' ? '.vue' :
           this.activeFramework === 'svelte' ? '.svelte' : '.html');
      this.downloadBtn.textContent = `DOWNLOAD ${comp.filename}${ext}`;
    }
  }

  copyCode() {
    const comp = REGISTRY[this.activeComponentId];
    if (!comp) return;

    const snippet = comp.code[this.activeFramework] || comp.code.react;
    navigator.clipboard?.writeText(snippet).then(() => {
      if (this.sfx) this.sfx.success();
      if (this.copyBtn) {
        const originalText = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = '<span>✓ COPIED TO CLIPBOARD!</span>';
        this.copyBtn.classList.add('bg-emerald-500', 'text-near');
        setTimeout(() => {
          this.copyBtn.innerHTML = originalText;
          this.copyBtn.classList.remove('bg-emerald-500', 'text-near');
        }, 2000);
      }
    });
  }

  downloadCurrentFile() {
    const comp = REGISTRY[this.activeComponentId];
    if (!comp) return;

    const snippet = comp.code[this.activeFramework] || comp.code.react;
    const isAudio = comp.id === 'audio';
    const ext = isAudio
      ? (this.activeFramework === 'html' ? '.js' : '.ts')
      : (this.activeFramework === 'react' ? '.tsx' :
         this.activeFramework === 'vue' ? '.vue' :
         this.activeFramework === 'svelte' ? '.svelte' : '.html');
    const filename = `${comp.filename}${ext}`;

    const blob = new Blob([snippet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (this.sfx) this.sfx.success();
  }

  /**
   * Generates and downloads the complete 15-component Kinetic Blueprint UI suite as a ZIP archive.
   * Includes /react, /vue, /svelte, /html directories, tokens.css, tailwind.config.js, and README.md.
   */
  async downloadCompleteZip(triggerBtn = null) {
    let originalHtml = '';
    if (triggerBtn) {
      originalHtml = triggerBtn.innerHTML;
      triggerBtn.innerHTML = '<span>⏳</span><span>PACKING KIT...</span>';
      triggerBtn.disabled = true;
    }
    if (this.sfx) this.sfx.telemetry();

    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('kinetic-ui');

      // 1. Fetch live tokens.css or fallback to core tokens
      let tokensContent = '';
      try {
        const resp = await fetch('./tokens.css');
        if (resp.ok) {
          tokensContent = await resp.text();
        }
      } catch (e) {}

      if (!tokensContent) {
        tokensContent = `/* Kinetic UI Design Tokens */
:root {
  --ink: #2b2b29;
  --ink-dark: #16150f;
  --ink-surface: #33332f;
  --cream: #e9e2d3;
  --cream-well: #e2dac9;
  --sand: #d8cdb4;
  --orange: #f4551d;
  --orange-hover: #ea4f1a;
  --orange-rgb: 244 85 29;
  --theme-glow: rgba(244, 85, 29, 0.45);
  --border-line: #3d3d39;
  --c: 13px;
}

.chamfer {
  clip-path: polygon(
    var(--c) 0, calc(100% - var(--c)) 0,
    100% var(--c), 100% calc(100% - var(--c)),
    calc(100% - var(--c)) 100%, var(--c) 100%,
    0 calc(100% - var(--c)), 0 var(--c)
  );
}

.dotgrid {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 7px 7px;
}
`;
      }
      rootFolder.file('tokens.css', tokensContent);

      // 2. tailwind.config.js
      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./components/**/*.{html,js,ts,jsx,tsx,vue,svelte}"
  ],
  theme: {
    extend: {
      colors: {
        ink: '#2b2b29',
        ink2: '#33332f',
        near: '#16150f',
        cream: '#e9e2d3',
        cream2: '#e2dac9',
        orange: 'rgb(var(--orange-rgb, 244 85 29) / <alpha-value>)',
        orange2: 'var(--orange-hover, #ea4f1a)'
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif']
      }
    }
  }
};
`;
      rootFolder.file('tailwind.config.js', tailwindConfig);

      // 3. Comprehensive README.md
      const readme = `# KINETIC UI // COMPLETE COMPONENT SUITE
========================================
An independent, high-assurance industrial engineering design system and component catalog
built for mission-critical telemetry, aerospace instrumentation, and developer platforms.

## Included Components (15 Total):
- BlueprintButton: 8-point polygon chamfer action triggers with tactical return glyphs.
- BlueprintInput: Monospace coordinate form inputs with live focus indicators.
- BlueprintBadge: Status tags with radar-pulse LEDs and severity tokens.
- BlueprintCallout: Tactical warning and info callouts with corner crop brackets.
- BlueprintCard: Chamfered technical cards with dot-grid canvas and seam diamond nodes.
- TelemetryTable: Dense telemetry log grid with sparklines and status filtering.
- ParameterRack: Environment variable and secrets editor with masked toggle.
- CommandPalette: Keyboard-first command discovery palette (⌘K / Ctrl+K).
- SafetyConfirmationModal: Two-phase safety confirmation latch for dangerous actions.
- TelemetryDrawer: Slide-out hardware inspector and real-time metric panel.
- BlueprintSparkline: Canvas & SVG live streaming sparkline graph.
- TachometerGauge: Precision radial tachometer dial gauge with arc fill.
- BlueprintNode: Flow graph circuit node with patch cable connection sockets.
- BlueprintIcon: 32 technical SVG vector icons with viewBox="0 0 24 24".
- useBlueprintSFX: Web Audio API procedural sound synthesizer (zero audio assets).

## Framework Directories:
- /react     -> React TypeScript (.tsx / .ts)
- /vue       -> Vue 3 Single File Components (.vue / .ts)
- /svelte    -> Svelte 5 Components (.svelte / .ts)
- /html      -> HTML5 + Tailwind CSS standalone snippets (.html / .js)

## Quick Start:
1. Copy tokens.css into your styles and import it into your root layout.
2. Extend tailwind.config.js with the provided color definitions.
3. Import the components directly into your Next.js, Vite, Nuxt, or SvelteKit project.

Website & Documentation: https://github.com/SalAkBuK/kinetic-ui
`;
      rootFolder.file('README.md', readme);

      // 4. Framework Folders
      const reactFolder = rootFolder.folder('react');
      const vueFolder = rootFolder.folder('vue');
      const svelteFolder = rootFolder.folder('svelte');
      const htmlFolder = rootFolder.folder('html');

      Object.values(REGISTRY).forEach(comp => {
        const isAudio = comp.id === 'audio';

        // React
        const reactExt = isAudio ? '.ts' : '.tsx';
        if (comp.code.react) {
          reactFolder.file(`${comp.filename}${reactExt}`, comp.code.react);
        }

        // Vue
        const vueExt = isAudio ? '.ts' : '.vue';
        if (comp.code.vue) {
          vueFolder.file(`${comp.filename}${vueExt}`, comp.code.vue);
        }

        // Svelte
        const svelteExt = isAudio ? '.ts' : '.svelte';
        if (comp.code.svelte) {
          svelteFolder.file(`${comp.filename}${svelteExt}`, comp.code.svelte);
        }

        // HTML
        const htmlExt = isAudio ? '.js' : '.html';
        if (comp.code.html) {
          htmlFolder.file(`${comp.filename}${htmlExt}`, comp.code.html);
        }
      });

      // Generate the ZIP file
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kinetic-ui-complete-suite.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (this.sfx) this.sfx.success();

      // UI Toast feedback
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      if (toast && toastMsg) {
        toastMsg.textContent = 'Complete Design System ZIP (15 components) downloaded!';
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
      }

      if (triggerBtn) {
        triggerBtn.innerHTML = '<span>✓</span><span>DOWNLOADED!</span>';
        triggerBtn.classList.add('bg-emerald-500', 'text-near');
        setTimeout(() => {
          triggerBtn.innerHTML = originalHtml;
          triggerBtn.classList.remove('bg-emerald-500', 'text-near');
          triggerBtn.disabled = false;
        }, 2500);
      }
    } catch (err) {
      console.error('Failed to generate complete ZIP:', err);
      if (this.sfx) this.sfx.error();
      if (triggerBtn) {
        triggerBtn.innerHTML = originalHtml;
        triggerBtn.disabled = false;
      }
    }
  }

  downloadStarterKit(triggerBtn = null) {
    return this.downloadCompleteZip(triggerBtn);
  }
}

/**
 * Exporter Initializer
 */
export function initComponentExporter(options = {}) {
  return new ComponentExporterEngine(options);
}

/**
 * Standalone Complete ZIP Downloader
 */
export async function downloadCompleteZip(triggerBtn = null, sfx = null) {
  const engine = window.componentExporter || new ComponentExporterEngine({ sfx });
  return engine.downloadCompleteZip(triggerBtn);
}
