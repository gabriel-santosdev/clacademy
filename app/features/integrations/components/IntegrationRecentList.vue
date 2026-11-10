<script setup lang="ts">
import type { ActivityLike } from '~/features/training/domain/activity'

/** Treinos recebidos do relógio. Os que chegaram sem esforço pedem a nota (1-10) para o professor. */
defineProps<{ logs: ActivityLike[]; rating: boolean }>()
const emit = defineEmits<{ rate: [id: number, rpe: number] }>()
const picked = ref<Record<number, number>>({})

function choose(id: number, rpe: number) {
  picked.value[id] = rpe
  emit('rate', id, rpe)
}
</script>

<template>
  <section class="stack" style="--gap: 12px">
    <header>
      <h2 class="h2">Recebidos do relógio</h2>
      <p class="small muted">O professor vê cada um com o aparelho, a frequência cardíaca e a sua nota de esforço.</p>
    </header>

    <div v-if="logs.length" class="recent divided">
      <TrainingActivityItem v-for="log in logs" :key="log.id" :log="log">
        <div v-if="!log.rpe" class="rpe">
          <span class="rpe__q">Quanto pesou?</span>
          <div class="rpe__scale" role="radiogroup" :aria-label="`Esforço de ${log.title ?? 'treino'}`">
            <button
              v-for="n in 10"
              :key="n"
              type="button"
              role="radio"
              :aria-checked="picked[log.id] === n"
              :disabled="rating"
              class="rpe__btn"
              :class="{ 'rpe__btn--on': picked[log.id] === n }"
              :style="{ '--z': n <= 3 ? '#9ad0f5' : n <= 6 ? '#ffe066' : n <= 8 ? '#ffb020' : 'var(--cl-heat)' }"
              @click="choose(log.id, n)"
            >
              {{ n }}
            </button>
          </div>
          <div class="rpe__legend"><span>Leve</span><span>Moderado</span><span>Forte</span><span>Máximo</span></div>
        </div>
      </TrainingActivityItem>
    </div>
    <AppEmptyState v-else icon="pi-stopwatch" title="Nada por aqui ainda" text="Assim que um treino do relógio chegar no Strava, ele aparece aqui." />
  </section>
</template>

<style scoped>
.recent { padding: 0 16px; border-radius: var(--radius-lg); border: 1px solid var(--app-border); background: var(--app-surface); }
.rpe { margin-top: 12px; padding: 12px; border-radius: 16px; background: var(--app-bg); animation: cl-rise 0.4s var(--ease-out) both; }
.rpe__q { display: block; margin-bottom: 8px; font-size: 0.82rem; font-weight: 800; }
.rpe__scale { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; }
.rpe__btn {
  position: relative; height: 38px; border: 0; border-radius: 10px; background: var(--app-surface); color: var(--app-text);
  font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; overflow: hidden; isolation: isolate;
  box-shadow: inset 0 -3px 0 var(--z); transition: transform 0.15s var(--ease-out), color 0.2s; -webkit-tap-highlight-color: transparent;
}
.rpe__btn::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--z); transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s var(--ease-out); }
.rpe__btn:active:not(:disabled) { transform: scale(0.9); }
.rpe__btn--on { color: #1a1a1a; }
.rpe__btn--on::before { transform: scaleY(1); }
.rpe__legend { display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.68rem; font-weight: 700; color: var(--app-muted); }
</style>
