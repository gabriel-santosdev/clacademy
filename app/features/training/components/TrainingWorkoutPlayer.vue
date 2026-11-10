<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import type { LoggedExercise } from '../domain/activity'
import type { ExerciseDetail, ExerciseLike } from '~/features/exercises/domain/exercise'

/**
 * Ficha de treino com execução: iniciar, pausar/retomar, marcar séries e
 * exercícios, descanso entre séries e finalizar (abre o registro).
 */
interface Item {
  id?: number
  name: string
  sets: number | null
  reps: string | null
  load: string | null
  restSeconds: number | null
  notes: string | null
  videoUrl: string | null
  exercise?: Pick<ExerciseLike, 'images' | 'instructions' | 'videoUrl' | 'muscleGroup' | 'equipment' | 'level'> &
    Partial<Pick<ExerciseLike, 'id' | 'externalId'>> | null
}

const props = defineProps<{ assignmentId: number; workoutId: number; items: Item[]; done?: boolean }>()
const emit = defineEmits<{
  /** abrir o registro do treino (com dados da execução, se houve) */
  log: [payload: { durationMin?: number; exercises?: LoggedExercise[]; sessionKey?: string }]
}>()

const confirm = useConfirm()
const key = computed(() => sessionKey(props.assignmentId, props.workoutId))
const session = useWorkoutSession(key, () => props.items)
const { state, started, paused, elapsed, rest, progress } = session

const restTotal = ref(0)
watch(rest, (v, before) => {
  if (v > before) restTotal.value = v
})

function finish() {
  const data = session.finish()
  if (data) emit('log', { ...data, sessionKey: key.value })
}

function askDiscard() {
  confirm.require({
    header: 'Descartar treino em andamento?',
    message: 'O tempo e os exercícios marcados serão perdidos. Nada é enviado ao professor.',
    icon: 'pi pi-trash',
    acceptProps: { label: 'Descartar', severity: 'danger' },
    rejectProps: { label: 'Continuar treinando', severity: 'secondary', text: true },
    accept: () => session.discard(),
  })
}

const detail = ref<ExerciseDetail | null>(null)
const detailOpen = computed({ get: () => !!detail.value, set: (v) => !v && (detail.value = null) })
const openDetail = (it: Item) => (detail.value = itemToDetail(it))
const hasHowTo = (it: Item) => !!it.exercise || !!it.videoUrl

const restClock = computed(() => formatClock(rest.value * 1000))
</script>

<template>
  <div class="player">
    <template v-if="!started">
      <TrainingWorkoutItems :items="items" />
      <div v-if="!done" class="player__start">
        <Button label="Iniciar treino" icon="pi pi-play" fluid @click="session.start()" />
        <Button label="Já fiz, só registrar" severity="secondary" text size="small" @click="emit('log', {})" />
      </div>
    </template>

    <template v-else-if="state">
      <div class="bar" :class="{ 'bar--paused': paused }">
        <div class="bar__clock">
          <span class="bar__label">{{ paused ? 'Pausado' : 'Treinando' }}</span>
          <strong class="bar__time" aria-live="off">{{ elapsed }}</strong>
        </div>
        <div class="bar__progress" :aria-label="`${progress.done} de ${progress.total} exercícios feitos`">
          <span class="bar__count"><b>{{ progress.done }}</b>/{{ progress.total }}</span>
          <span class="bar__track"><span :style="{ width: `${progress.pct}%` }" /></span>
        </div>
        <Button
          v-if="paused"
          icon="pi pi-play"
          rounded
          aria-label="Retomar treino"
          class="bar__btn"
          @click="session.resume()"
        />
        <Button v-else icon="pi pi-pause" rounded severity="secondary" aria-label="Pausar treino" class="bar__btn" @click="session.pause()" />
      </div>

      <div v-if="rest > 0" class="rest" role="status">
        <i class="pi pi-stopwatch" />
        <span class="grow">Descanso <b class="mono">{{ restClock }}</b></span>
        <span class="rest__track"><span :style="{ width: `${restTotal ? (rest / restTotal) * 100 : 0}%` }" /></span>
        <Button label="Pular" size="small" text @click="session.skipRest()" />
      </div>

      <ol class="ex-list">
        <li v-for="(it, i) in items" :key="it.id ?? i" class="ex" :class="{ 'ex--done': state.done[i] }">
          <button
            type="button"
            class="ex__check"
            role="checkbox"
            :aria-checked="state.done[i]"
            :aria-label="`Marcar ${it.name} como feito`"
            :disabled="paused"
            @click="session.toggle(i)"
          >
            <i class="pi pi-check" />
          </button>
          <div class="grow ex__body">
            <div class="ex__head">
              <button v-if="it.exercise" type="button" class="ex__thumb" :aria-label="`Como fazer ${it.name}`" @click="openDetail(it)">
                <ExerciseMedia :images="it.exercise.images" :video="it.videoUrl || it.exercise.videoUrl" :group="it.exercise.muscleGroup" :alt="it.name" size="sm" />
              </button>
              <strong class="ex__name">{{ it.name }}</strong>
            </div>
            <div class="ex__meta">
              <span v-if="it.sets || it.reps" class="ex__sets">{{ it.sets ?? '' }}<template v-if="it.sets && it.reps">×</template>{{ it.reps ?? '' }}</span>
              <span v-if="it.load">carga <b>{{ it.load }}</b></span>
              <span v-if="it.restSeconds"><i class="pi pi-clock" /> {{ it.restSeconds }}s</span>
            </div>
            <p v-if="it.notes" class="tiny muted">{{ it.notes }}</p>
            <div v-if="it.sets" class="ex__series">
              <button
                v-for="n in it.sets"
                :key="n"
                type="button"
                class="serie"
                :class="{ 'serie--on': n <= state.setsDone[i]!, 'serie--next': n === state.setsDone[i]! + 1 }"
                :aria-label="`Série ${n} de ${it.sets}`"
                :disabled="paused"
                @click="session.tapSet(i)"
              >
                {{ n }}
              </button>
              <span class="tiny muted ex__hint">toque ao terminar cada série</span>
            </div>
          </div>
          <Button
            v-if="hasHowTo(it)"
            :icon="it.videoUrl || it.exercise?.videoUrl || it.exercise?.externalId ? 'pi pi-play-circle' : 'pi pi-info-circle'"
            :label="it.videoUrl || it.exercise?.videoUrl || it.exercise?.externalId ? 'Vídeo' : 'Dica'"
            size="small"
            severity="secondary"
            outlined
            rounded
            :aria-label="`Ver como fazer ${it.name}`"
            class="ex__demo"
            @click="openDetail(it)"
          />
        </li>
      </ol>

      <div class="player__end">
        <Button label="Finalizar treino" icon="pi pi-flag-fill" fluid @click="finish" />
        <Button label="Descartar" icon="pi pi-times" severity="secondary" text size="small" @click="askDiscard" />
      </div>
    </template>

    <ExerciseDetailDialog v-model:visible="detailOpen" :exercise="detail" />
  </div>
</template>

<style scoped>
.player { display: flex; flex-direction: column; gap: 14px; }
.player__start, .player__end { display: flex; flex-direction: column; align-items: center; gap: 4px; }

/* barra do cronômetro: gruda no topo enquanto rola a ficha */
.bar {
  position: sticky; top: calc(var(--topbar-h) + env(safe-area-inset-top) + 6px); z-index: 5;
  display: flex; align-items: center; gap: 14px; padding: 12px 12px 12px 16px; border-radius: var(--radius);
  background: var(--cl-ink); color: var(--cl-bone); box-shadow: 0 14px 30px -20px rgba(0, 0, 0, 0.6);
}
.app-dark .bar { background: #202020; border: 1px solid #2e2e2e; }
.bar__clock { display: flex; flex-direction: column; }
.bar__label { font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cl-hi); }
.bar--paused .bar__label { color: #ffb020; }
.bar__time { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; line-height: 0.95; font-variant-numeric: tabular-nums; }
.bar--paused .bar__time { opacity: 0.6; }
.bar__progress { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.bar__count { font-size: 0.8rem; color: #a6a6a6; text-align: right; }
.bar__count b { font-family: var(--font-display); font-size: 1.1rem; color: var(--cl-bone); }
.bar__track { height: 6px; border-radius: 999px; background: #3a3a3a; overflow: hidden; }
.bar__track span { display: block; height: 100%; background: var(--cl-hi); border-radius: inherit; transition: width 0.4s var(--ease-out); }
.bar__btn { flex-shrink: 0; }

.rest {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 8px 8px 8px 14px; border-radius: var(--radius);
  background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent-text) 30%, transparent); font-size: 0.9rem;
}
.rest b { font-size: 1.05rem; }
.rest__track { order: 9; flex-basis: 100%; height: 4px; border-radius: 999px; background: color-mix(in srgb, var(--accent-text) 18%, transparent); overflow: hidden; }
.rest__track span { display: block; height: 100%; background: var(--accent-text); transition: width 0.5s linear; }

.ex-list { display: flex; flex-direction: column; }
.ex { display: flex; gap: 12px; align-items: flex-start; padding: 12px 0; border-top: 1px solid var(--app-border); transition: opacity 0.3s; }
.ex:first-child { border-top: none; padding-top: 0; }
.ex--done .ex__body { opacity: 0.55; }
.ex--done .ex__name { text-decoration: line-through; text-decoration-thickness: 2px; }
.ex__check {
  width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer;
  border: 2px solid var(--app-border); background: transparent; color: transparent; transition: background 0.2s, border-color 0.2s, color 0.2s;
}
@media (hover: hover) { .ex__check:hover:not(:disabled) { border-color: var(--app-muted); } }
.ex__check:active:not(:disabled), .serie:active:not(:disabled) { transform: scale(0.9); }
.ex__check[aria-checked='true'] { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); animation: cl-pop 0.4s var(--ease-spring); }
.ex__check:disabled { cursor: not-allowed; opacity: 0.6; }
.ex__check .pi { font-size: 0.85rem; font-weight: 800; }
.ex__name { font-weight: 800; }
.ex__head { display: flex; align-items: center; gap: 10px; }
.ex__thumb { flex-shrink: 0; width: 72px; padding: 0; border: 0; background: none; cursor: zoom-in; border-radius: 10px; }
.ex--done .ex__thumb { filter: grayscale(1); }
.ex__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; margin-top: 3px; font-size: 0.82rem; color: var(--app-muted); }
.ex__meta b { color: var(--app-text); }
.ex__meta .pi { font-size: 0.7rem; }
.ex__sets { padding: 1px 8px; border-radius: 6px; background: var(--cl-ink); color: var(--cl-hi); font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; }
.app-dark .ex__sets { background: #2a2a2a; }
.ex__series { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 10px; }
.serie {
  min-width: 38px; height: 34px; padding: 0 10px; border-radius: 10px; cursor: pointer;
  border: 1.5px solid var(--app-border); background: var(--app-bg); color: var(--app-muted);
  font-family: var(--font-display); font-size: 1rem; font-weight: 800; transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.serie--next { border-color: var(--app-text); color: var(--app-text); }
.serie--on { background: var(--cl-ink); border-color: var(--cl-ink); color: var(--cl-hi); }
.app-dark .serie--on { background: var(--cl-hi); border-color: var(--cl-hi); color: var(--cl-hi-ink); }
.serie:disabled { cursor: not-allowed; opacity: 0.6; }
.ex__hint { margin-left: 4px; }
.ex__demo { flex-shrink: 0; margin-top: -4px; }
</style>
