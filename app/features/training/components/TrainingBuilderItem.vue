<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import type { ExerciseForm } from '../domain/workout'

/**
 * Um exercício no construtor de ficha: miniatura, nome, atalhos de séries×reps e
 * descanso. Carga, observação e vídeo específico ficam em "mais opções".
 */
const props = defineProps<{ item: ExerciseForm; index: number; total: number }>()
const emit = defineEmits<{
  preview: []
  remove: []
  duplicate: []
  move: [delta: -1 | 1]
  dragstart: [e: DragEvent]
}>()

const more = ref(!!(props.item.load || props.item.notes || props.item.videoUrl))
const menu = ref()
const menuItems = computed<MenuItem[]>(() => [
  { label: 'Duplicar', icon: 'pi pi-copy', command: () => emit('duplicate') },
  { label: 'Subir', icon: 'pi pi-arrow-up', disabled: props.index === 0, command: () => emit('move', -1) },
  { label: 'Descer', icon: 'pi pi-arrow-down', disabled: props.index === props.total - 1, command: () => emit('move', 1) },
  { separator: true },
  { label: 'Remover', icon: 'pi pi-trash', class: 'menu-danger', command: () => emit('remove') },
])

const timed = computed(() => props.item.exercise?.muscleGroup === 'cardio')
const presetOn = (p: { sets: number; reps: string }) => props.item.sets === p.sets && props.item.reps === p.reps
function usePreset(p: { sets: number; reps: string }) {
  props.item.sets = p.sets
  props.item.reps = p.reps
}
</script>

<template>
  <article class="bi">
    <div class="bi__top">
      <button
        type="button"
        class="bi__handle"
        draggable="true"
        :aria-label="`Arrastar ${item.name || 'exercício'} para reordenar`"
        title="Arraste para reordenar"
        @dragstart="emit('dragstart', $event)"
      >
        <i class="pi pi-bars" />
      </button>
      <span class="bi__n">{{ index + 1 }}</span>
      <button type="button" class="bi__thumb" :aria-label="`Ver como fazer ${item.name}`" @click="emit('preview')">
        <ExerciseMedia
          :images="item.exercise?.images"
          :video="item.videoUrl || item.exercise?.videoUrl"
          :group="item.exercise?.muscleGroup"
          :alt="item.name"
          size="sm"
        />
      </button>
      <div class="bi__title">
        <input v-model="item.name" class="bi__name" placeholder="Nome do exercício" :aria-label="`Nome do exercício ${index + 1}`" />
        <span class="bi__sub">
          <template v-if="item.exercise">{{ LABELS.muscleGroup[item.exercise.muscleGroup] }} · {{ LABELS.equipment[item.exercise.equipment] }}</template>
          <template v-else>Exercício livre</template>
        </span>
      </div>
      <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" aria-label="Mais ações" aria-haspopup="true" @click="menu.toggle($event)" />
      <Menu ref="menu" :model="menuItems" popup />
    </div>

    <div class="bi__rx">
      <div class="bi__field">
        <label :for="`s-${item.uid}`">Séries</label>
        <InputNumber v-model="item.sets" :input-id="`s-${item.uid}`" :min="1" :max="20" show-buttons button-layout="horizontal" :step="1" class="bi__sets" fluid>
          <template #incrementbuttonicon><i class="pi pi-plus" /></template>
          <template #decrementbuttonicon><i class="pi pi-minus" /></template>
        </InputNumber>
      </div>
      <div class="bi__field">
        <label :for="`r-${item.uid}`">{{ timed ? 'Tempo' : 'Repetições' }}</label>
        <InputText :id="`r-${item.uid}`" v-model="item.reps" :placeholder="timed ? '10 min' : '12'" fluid />
      </div>
      <div class="bi__field bi__field--rest">
        <span class="bi__label">Descanso</span>
        <div class="bi__chips" role="group" aria-label="Descanso">
          <button
            v-for="r in REST_PRESETS"
            :key="r"
            type="button"
            class="chip"
            :class="{ 'chip--on': item.restSeconds === r }"
            @click="item.restSeconds = item.restSeconds === r ? null : r"
          >
            {{ r }}s
          </button>
        </div>
      </div>
    </div>

    <div v-if="!timed" class="bi__presets" role="group" aria-label="Atalhos de séries e repetições">
      <button v-for="p in PRESCRIPTION_PRESETS" :key="p.label" type="button" class="preset" :class="{ 'preset--on': presetOn(p) }" @click="usePreset(p)">
        {{ p.label }}
      </button>
    </div>

    <button type="button" class="bi__more" :aria-expanded="more" @click="more = !more">
      <i :class="['pi', more ? 'pi-chevron-down' : 'pi-chevron-right']" /> Carga, observação e vídeo
      <span v-if="!more && (item.load || item.notes)" class="bi__more-dot" />
    </button>
    <div v-if="more" class="bi__extra">
      <div class="bi__field">
        <label :for="`l-${item.uid}`">Carga</label>
        <InputText :id="`l-${item.uid}`" v-model="item.load" placeholder="20 kg, moderada…" fluid />
      </div>
      <div class="bi__field bi__field--wide">
        <label :for="`o-${item.uid}`">Observação para o aluno</label>
        <InputText :id="`o-${item.uid}`" v-model="item.notes" placeholder="Ex.: cadência 3s na descida" fluid />
      </div>
      <div class="bi__field bi__field--full">
        <label :for="`v-${item.uid}`">Vídeo só para esta ficha (opcional)</label>
        <InputText
          :id="`v-${item.uid}`"
          v-model="item.videoUrl"
          type="url"
          :placeholder="item.exercise ? 'Em branco = usa o vídeo do banco de exercícios' : 'YouTube, Instagram ou .mp4'"
          fluid
        />
      </div>
    </div>
  </article>
</template>

<style scoped>
.bi { display: flex; flex-direction: column; gap: 12px; padding: 14px; border: 1px solid var(--app-border); border-radius: var(--radius); background: var(--app-tile); }
.bi__top { display: flex; align-items: center; gap: 10px; min-width: 0; }
.bi__handle {
  display: grid; place-items: center; width: 26px; height: 40px; flex-shrink: 0; padding: 0; border: 0; border-radius: 8px;
  background: none; color: var(--app-muted); cursor: grab;
}
.bi__handle:active { cursor: grabbing; }
.bi__handle:hover { background: var(--app-bg); color: var(--app-text); }
@media (hover: none) { .bi__handle { display: none; } }
.bi__n {
  width: 26px; height: 26px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center;
  background: var(--cl-ink); color: var(--cl-hi); font-family: var(--font-display); font-weight: 800; font-size: 0.9rem;
}
.bi__thumb { width: 84px; flex-shrink: 0; padding: 0; border: 0; background: none; cursor: zoom-in; border-radius: 10px; }
.bi__thumb:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
.bi__title { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bi__name {
  width: 100%; padding: 4px 6px; margin-left: -6px; border: 1px solid transparent; border-radius: 8px; background: transparent;
  font: inherit; font-weight: 800; font-size: 1rem; color: var(--app-text);
}
.bi__name:hover { border-color: var(--app-border); }
.bi__name:focus { outline: none; border-color: var(--accent-text); background: var(--app-bg); }
.bi__sub { font-size: 0.78rem; color: var(--app-muted); }

.bi__rx { display: grid; grid-template-columns: 150px minmax(90px, 140px) 1fr; gap: 10px; align-items: end; }
.bi__field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.bi__field label, .bi__label { font-size: 0.75rem; font-weight: 700; color: var(--app-muted); }
.bi__sets :deep(input) { text-align: center; font-weight: 800; }
.bi__chips { display: flex; flex-wrap: wrap; gap: 4px; }
.chip, .preset {
  padding: 6px 10px; border-radius: 999px; cursor: pointer; border: 1px solid var(--app-border); background: var(--app-bg);
  font: inherit; font-size: 0.8rem; font-weight: 700; color: var(--app-text); transition: background 0.12s, border-color 0.12s;
}
.chip:hover, .preset:hover { border-color: var(--app-muted); }
.chip--on, .preset--on { background: var(--cl-ink); border-color: var(--cl-ink); color: var(--cl-hi); }
.app-dark .chip--on, .app-dark .preset--on { background: var(--cl-hi); border-color: var(--cl-hi); color: var(--cl-hi-ink); }
.bi__presets { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.preset { flex-shrink: 0; font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.02em; padding: 4px 10px; }

.bi__more { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 0; border: 0; background: none; cursor: pointer; font: inherit; font-size: 0.8rem; font-weight: 700; color: var(--app-muted); }
.bi__more:hover { color: var(--app-text); }
.bi__more .pi { font-size: 0.65rem; }
.bi__more-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-text); }
.bi__extra { display: grid; grid-template-columns: 150px 1fr; gap: 10px; }
.bi__field--full { grid-column: 1 / -1; }

@media (max-width: 640px) {
  .bi__thumb { width: 64px; }
  .bi__rx { grid-template-columns: 1fr 1fr; }
  .bi__field--rest { grid-column: 1 / -1; }
  .bi__extra { grid-template-columns: 1fr; }
}
:deep(.menu-danger .p-menu-item-label), :deep(.menu-danger .p-menu-item-icon) { color: var(--p-red-500); }
</style>
