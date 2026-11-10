<script setup lang="ts">
import type { ExerciseLike } from '../domain/exercise'

/** Cartão do banco de exercícios. Em modo seleção, mostra o check. */
defineProps<{ exercise: ExerciseLike; selectable?: boolean; selected?: boolean; compact?: boolean }>()
defineEmits<{ open: [] }>()
</script>

<template>
  <button
    type="button"
    class="xc"
    :class="{ 'xc--selected': selected, 'xc--compact': compact }"
    :aria-pressed="selectable ? !!selected : undefined"
    @click="$emit('open')"
  >
    <ExerciseMedia :images="exercise.images" :video="exercise.videoUrl" :group="exercise.muscleGroup" :alt="exercise.name" :size="compact ? 'sm' : 'md'" />
    <span v-if="selectable" class="xc__check" aria-hidden="true"><i class="pi pi-check" /></span>
    <span v-if="exercise.videoUrl || exercise.externalId" class="xc__video" title="Tem vídeo da execução"><i class="pi pi-play" /> vídeo</span>
    <span class="xc__body">
      <strong class="xc__name">{{ exercise.name }}</strong>
      <span class="xc__meta">{{ LABELS.muscleGroup[exercise.muscleGroup] }} · {{ LABELS.equipment[exercise.equipment] }}</span>
    </span>
  </button>
</template>

<style scoped>
.xc {
  position: relative; display: flex; flex-direction: column; gap: 10px; padding: 8px 8px 12px; text-align: left; cursor: pointer;
  border: 1.5px solid var(--app-border); border-radius: var(--radius); background: var(--app-tile); color: var(--app-text); font: inherit;
  transition: border-color 0.15s, transform 0.15s var(--ease-out), box-shadow 0.15s;
}
.xc:hover { border-color: var(--app-muted); transform: translateY(-2px); box-shadow: 0 12px 24px -18px rgba(0, 0, 0, 0.4); }
.xc:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
.xc--selected { border-color: var(--cl-ink); box-shadow: 0 0 0 1px var(--cl-ink) inset; }
.app-dark .xc--selected { border-color: var(--cl-hi); }
.xc__body { display: flex; flex-direction: column; gap: 2px; padding: 0 4px; min-width: 0; }
.xc__name { font-weight: 800; font-size: 0.92rem; line-height: 1.25; }
.xc--compact .xc__name { font-size: 0.85rem; }
.xc__meta { font-size: 0.75rem; color: var(--app-muted); }
.xc__check {
  position: absolute; top: 14px; right: 14px; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255, 255, 255, 0.9); border: 2px solid var(--cl-line); color: transparent; transition: all 0.15s;
}
.xc--selected .xc__check { background: var(--cl-ink); border-color: var(--cl-ink); color: #fff; }
.xc__check .pi { font-size: 0.75rem; font-weight: 800; }
.xc__video {
  position: absolute; top: 14px; left: 14px; display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px;
  background: var(--cl-hi); color: var(--cl-hi-ink); font-family: var(--font-display); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
}
.xc__video .pi { font-size: 0.55rem; }
</style>
