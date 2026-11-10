<script setup lang="ts">
/** Métrica em destaque (KPI), com número condensado como placar. `ink` = versão escura com número em volt. */
defineProps<{ label: string; value: string | number; hint?: string; icon?: string; ink?: boolean }>()
</script>

<template>
  <div class="stat" :class="{ 'stat--ink': ink }">
    <div class="stat__top">
      <span class="stat__label">{{ label }}</span>
      <span v-if="icon" class="stat__icon"><i :class="['pi', icon]" /></span>
    </div>
    <strong class="stat__value">{{ value }}</strong>
    <span v-if="hint" class="stat__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: flex; flex-direction: column; gap: 6px; padding: 16px 18px 18px; border-radius: var(--radius);
  background: var(--app-tile); border: 1px solid var(--app-border); color: var(--app-text);
  transition: transform 0.25s var(--ease-out), border-color 0.25s;
}
.stat:hover { transform: translateY(-2px); border-color: var(--app-muted); }
.stat__top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.stat__label { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--app-muted); }
.stat__icon { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-text); }
.stat__icon .pi { font-size: 0.8rem; }
.stat__value { font-family: var(--font-display); font-size: clamp(2.2rem, 5vw, 2.8rem); font-weight: 800; line-height: 0.95; font-variant-numeric: tabular-nums; letter-spacing: 0; }
.stat__hint { font-size: 0.78rem; color: var(--app-muted); }

.stat--ink { background: var(--cl-ink); border-color: var(--cl-ink); color: var(--cl-bone); }
.app-dark .stat--ink { background: #202020; border-color: #2e2e2e; }
.stat--ink .stat__label, .stat--ink .stat__hint { color: #a8a7a4; }
.stat--ink .stat__value { color: var(--cl-volt); }
.stat--ink .stat__icon { background: rgba(255, 255, 255, 0.08); color: var(--cl-volt); }
</style>
