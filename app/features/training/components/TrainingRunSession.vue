<script setup lang="ts">
import type { RunType } from '#shared/utils/constants'

defineProps<{
  session: {
    type: RunType
    distanceKm: number | null
    durationMin: number | null
    targetPaceSec: number | null
    description: string | null
    weekday?: number
  }
  showDay?: boolean
}>()
</script>

<template>
  <div class="run">
    <span class="run__icon"><i class="pi pi-map" /></span>
    <div class="grow">
      <div class="row" style="--gap: 6px">
        <span v-if="showDay && session.weekday !== undefined" class="tiny strong muted">{{ WEEKDAYS_SHORT[session.weekday] }}</span>
        <strong class="run__type">{{ LABELS.runType[session.type] }}</strong>
        <span v-if="session.distanceKm" class="run__chip">{{ session.distanceKm }} km</span>
        <span v-if="session.durationMin" class="run__chip">{{ session.durationMin }} min</span>
        <span v-if="session.targetPaceSec" class="run__chip run__chip--pace">pace {{ formatPace(session.targetPaceSec) }}</span>
      </div>
      <p v-if="session.description" class="small muted run__desc">{{ session.description }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.run { display: flex; gap: 12px; align-items: flex-start; }
.run__icon {
  width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; flex-shrink: 0;
  background: var(--cl-ink); color: var(--cl-volt);
}
.app-dark .run__icon { background: #2a2a2a; }
.run__type { font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; text-transform: uppercase; line-height: 1; }
.run__chip { padding: 3px 9px; border-radius: 999px; border: 1px solid var(--app-border); font-size: 0.75rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.run__chip--pace { background: var(--cl-volt); border-color: var(--cl-volt); color: var(--cl-volt-ink); }
.run__desc { margin-top: 6px; }
</style>
