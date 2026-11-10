<script setup lang="ts">
import type { ExerciseDetail, ExerciseLike } from '~/features/exercises/domain/exercise'

defineProps<{
  items: {
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
  }[]
}>()

const detail = ref<ExerciseDetail | null>(null)
const detailOpen = computed({ get: () => !!detail.value, set: (v) => !v && (detail.value = null) })
const hasHowTo = (it: { exercise?: unknown; videoUrl: string | null }) => !!it.exercise || !!it.videoUrl
</script>

<template>
  <ol class="items">
    <li v-for="(it, i) in items" :key="it.id ?? i" class="item">
      <button v-if="it.exercise" type="button" class="item__thumb" :aria-label="`Como fazer ${it.name}`" @click="detail = itemToDetail(it)">
        <ExerciseMedia :images="it.exercise.images" :video="it.videoUrl || it.exercise.videoUrl" :group="it.exercise.muscleGroup" :alt="it.name" size="sm" />
        <span class="item__n item__n--on-thumb mono">{{ i + 1 }}</span>
      </button>
      <span v-else class="item__n mono">{{ i + 1 }}</span>
      <div class="grow">
        <strong class="item__name">{{ it.name }}</strong>
        <div class="item__meta">
          <span v-if="it.sets || it.reps" class="item__sets">{{ it.sets ?? '' }}<template v-if="it.sets && it.reps">×</template>{{ it.reps ?? '' }}</span>
          <span v-if="it.load">carga <b>{{ it.load }}</b></span>
          <span v-if="it.restSeconds"><i class="pi pi-clock" /> {{ it.restSeconds }}s</span>
        </div>
        <p v-if="it.notes" class="tiny muted">{{ it.notes }}</p>
        <button v-if="hasHowTo(it)" type="button" class="item__how" @click="detail = itemToDetail(it)">
          <i :class="['pi', it.videoUrl || it.exercise?.videoUrl || it.exercise?.externalId ? 'pi-play-circle' : 'pi-info-circle']" />
          {{ it.videoUrl || it.exercise?.videoUrl || it.exercise?.externalId ? 'Ver vídeo da execução' : 'Como fazer' }}
        </button>
      </div>
    </li>
  </ol>
  <ExerciseDetailDialog v-model:visible="detailOpen" :exercise="detail" />
</template>

<style scoped>
.items { display: flex; flex-direction: column; }
.item { display: flex; gap: 12px; padding: 12px 0; border-top: 1px solid var(--app-border); }
.item:first-child { border-top: none; padding-top: 0; }
.item__thumb { position: relative; flex-shrink: 0; width: 96px; align-self: flex-start; padding: 0; border: 0; background: none; cursor: zoom-in; border-radius: 10px; }
.item__thumb:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
.item__n {
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
  border: 2px solid var(--app-border); font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; color: var(--app-text);
}
.item__n--on-thumb {
  position: absolute; top: -6px; left: -6px; width: 26px; height: 26px; font-size: 0.85rem;
  background: var(--cl-ink); border-color: var(--cl-ink); color: var(--cl-hi);
}
.item__name { font-weight: 800; }
.item__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; margin-top: 3px; font-size: 0.82rem; color: var(--app-muted); }
.item__meta b { color: var(--app-text); }
.item__meta .pi { font-size: 0.7rem; }
.item__sets { padding: 1px 8px; border-radius: 6px; background: var(--cl-ink); color: var(--cl-hi); font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; letter-spacing: 0.02em; }
.app-dark .item__sets { background: #2a2a2a; }
.item__how {
  display: inline-flex; align-items: center; gap: 5px; margin-top: 8px; padding: 3px 10px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--app-border); background: var(--app-tile); font: inherit; font-size: 0.75rem; font-weight: 700; color: var(--app-text);
}
.item__how:hover { border-color: var(--app-muted); }
.item__how .pi { font-size: 0.8rem; color: var(--accent-text); }
</style>
