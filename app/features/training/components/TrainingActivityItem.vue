<script setup lang="ts">
import type { ActivityLike } from '../domain/activity'

const props = defineProps<{ log: ActivityLike; showAluno?: boolean }>()
const exercises = computed(() => exercisesSummary(props.log.exercises))

/** Cor da zona de esforço (mesma escala do mockup da landing). */
function rpeColor(rpe: number) {
  return rpe <= 3 ? '#9ad0f5' : rpe <= 6 ? 'var(--cl-volt)' : rpe <= 8 ? '#ffb020' : 'var(--cl-heat)'
}
</script>

<template>
  <div class="log">
    <span v-if="showAluno && log.aluno" class="log__avatar">{{ initials(log.aluno.name) }}</span>
    <span v-else class="log__icon" :class="`log__icon--${log.kind}`"><i :class="['pi', activityIcon(log.kind)]" /></span>
    <div class="grow">
      <div class="row" style="--gap: 8px">
        <NuxtLink v-if="showAluno && log.aluno" :to="`/app/professor/alunos/${log.aluno.id}`" class="strong">{{ log.aluno.name }}</NuxtLink>
        <span :class="showAluno ? 'muted small' : 'log__title'">{{ activityTitle(log) }}</span>
        <span v-if="log.source === 'strava'" class="log__strava"><i class="pi pi-sync" /> Strava</span>
      </div>
      <div class="log__meta">
        <span>{{ relativeTime(log.performedAt) }}</span>
        <span v-if="log.distanceKm" class="log__num">{{ log.distanceKm }} km</span>
        <span v-if="log.durationMin" class="log__num">{{ log.durationMin }} min</span>
        <span v-if="log.avgPaceSec" class="log__num">{{ formatPace(log.avgPaceSec) }}</span>
        <span v-if="exercises" class="log__num" :class="{ 'log__partial': exercises.done < exercises.total }">
          <i class="pi pi-check-square" /> {{ exercises.done }}/{{ exercises.total }} exercícios
        </span>
        <span v-if="log.rpe" class="log__rpe" :style="{ '--zone': rpeColor(log.rpe) }">Esforço {{ log.rpe }}/10 · {{ rpeLabel(log.rpe) }}</span>
      </div>
      <p v-if="exercises?.skipped.length" class="log__skipped">Não fez: {{ exercises.skipped.join(', ') }}</p>
      <p v-if="log.notes" class="log__notes">“{{ log.notes }}”</p>
      <div v-if="log.feedback" class="log__feedback">
        <span class="log__who"><i class="pi pi-comment" /> Seu professor</span>
        {{ log.feedback }}
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.log { display: flex; gap: 14px; align-items: flex-start; padding: 16px 0; }
.log__icon, .log__avatar {
  width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
  background: var(--accent-soft); color: var(--accent-text);
}
.log__icon--corrida { background: var(--cl-ink); color: var(--cl-volt); }
.app-dark .log__icon--corrida { background: #2a2a2a; }
.log__icon .pi { font-size: 0.95rem; }
.log__avatar { background: var(--cl-volt); color: var(--cl-volt-ink); font-family: var(--font-display); font-weight: 800; }
.log__title { font-weight: 800; font-size: 1rem; }
.log__strava { display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 800; color: #fc5200; }
.log__strava .pi { font-size: 0.7rem; }
.log__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; margin-top: 4px; font-size: 0.8rem; color: var(--app-muted); }
.log__num { font-weight: 700; color: var(--app-text); font-variant-numeric: tabular-nums; }
.log__rpe { padding: 2px 8px; border-radius: 6px; background: var(--zone); color: var(--cl-volt-ink); font-weight: 800; font-size: 0.72rem; }
.log__partial { color: #c27c00; }
.log__num .pi { font-size: 0.72rem; }
.log__skipped { margin-top: 6px; font-size: 0.82rem; color: var(--app-muted); }
.log__notes { margin-top: 8px; font-size: 0.88rem; color: var(--app-muted); font-style: italic; }
.log__feedback {
  margin-top: 10px; max-width: 560px; padding: 10px 14px; border-radius: 18px 18px 18px 6px;
  background: var(--cl-ink); color: var(--cl-bone); font-size: 0.9rem; line-height: 1.45;
}
.app-dark .log__feedback { background: #262626; }
.log__who { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; font-family: var(--font-display); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cl-volt); }
.log__who .pi { font-size: 0.7rem; }
</style>
