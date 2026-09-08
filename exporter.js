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

    // Download File Button
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

    // Global Export Starter Kit Button in Header HUD
    const exportBundleBtn = document.getElementById('exportStarterBundleBtn');
    exportBundleBtn?.addEventListener('click', () => {
      if (this.sfx) this.sfx.telemetry();
      this.downloadStarterKit();
    });
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
      const ext = this.activeFramework === 'react' ? '.tsx' :
                  this.activeFramework === 'vue' ? '.vue' :
                  this.activeFramework === 'svelte' ? '.svelte' : '.html';
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
    const ext = this.activeFramework === 'react' ? '.tsx' :
                this.activeFramework === 'vue' ? '.vue' :
                this.activeFramework === 'svelte' ? '.svelte' : '.html';
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

  downloadStarterKit() {
    const tokensSnippet = `/* Kinetic Blueprint UI Design Tokens */
:root {
  --ink: #2b2b29;
  --ink2: #33332f;
  --near: #16150f;
  --cream: #e9e2d3;
  --cream2: #e2dac9;
  --orange: #f4551d;
  --orange-hover: #ea4f1a;
  --orange-rgb: 244 85 29;
  --theme-glow: rgba(244, 85, 29, 0.45);
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

    const tailwindSnippet = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}"],
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
        sans: ['"Inter Tight"', 'sans-serif']
      }
    }
  }
};
`;

    const manifest = `# KINETIC BLUEPRINT UI // STARTER KIT
=========================================
1. Add tokens.css to your global stylesheet.
2. Extend your tailwind.config.js with the provided palette.
3. Import your chosen framework components into your project.`;

    // Download manifest bundle
    const content = `/* === 1. TOKENS.CSS === */\n\n${tokensSnippet}\n\n/* === 2. TAILWIND.CONFIG.JS === */\n\n${tailwindSnippet}\n\n/* === 3. MANIFEST === */\n\n${manifest}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kinetic-blueprint-starter-kit.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Exporter Initializer
 */
export function initComponentExporter(options = {}) {
  return new ComponentExporterEngine(options);
}
