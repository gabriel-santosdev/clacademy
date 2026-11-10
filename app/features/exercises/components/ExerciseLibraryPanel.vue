<script setup lang="ts">
import type { ExerciseLike } from '../domain/exercise'

/**
 * Banco de exercícios em painel (lado do construtor de fichas / gaveta no celular).
 * Um toque adiciona; quem já está na ficha fica marcado com a quantidade.
 */
const props = defineProps<{ inWorkout: Set<number | null> }>()
const emit = defineEmits<{ add: [exercise: ExerciseLike]; create: []; preview: [exercise: ExerciseLike] }>()

const library = useExerciseLibrary({ lazy: true })
const { filters, list, counts, data, pending } = library
onMounted(() => library.ensure())

/** feedback rápido de "adicionado" no próprio item */
const justAdded = ref<number | null>(null)
let t: ReturnType<typeof setTimeout> | undefined
function add(e: ExerciseLike) {
  emit('add', e)
  justAdded.value = e.id
  clearTimeout(t)
  t = setTimeout(() => (justAdded.value = null), 1200)
}
defineExpose({ refresh: () => library.refresh() })
</script>

<template>
  <div class="lp">
    <div class="lp__search">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.q" placeholder="Buscar exercício…" fluid />
      </IconField>
      <div class="lp__chips" role="group" aria-label="Grupo muscular">
        <button type="button" class="chip" :class="{ 'chip--on': !filters.group }" @click="filters.group = null">Todos</button>
        <template v-for="g in MUSCLE_GROUP_OPTIONS" :key="g.value">
          <button
            v-if="counts[g.value]"
            type="button"
            class="chip"
            :class="{ 'chip--on': filters.group === g.value }"
            @click="filters.group = filters.group === g.value ? null : g.value"
          >
            {{ g.label }}
          </button>
        </template>
      </div>
    </div>

    <ul class="lp__list" :class="{ 'lp__list--busy': pending && !data.length }">
      <li v-for="e in list" :key="e.id" class="lp__row" :class="{ 'lp__row--in': props.inWorkout.has(e.id), 'lp__row--added': justAdded === e.id }">
        <button type="button" class="lp__thumb" :aria-label="`Ver ${e.name}`" @click="emit('preview', e)">
          <ExerciseMedia :images="e.images" :video="e.videoUrl" :group="e.muscleGroup" :alt="e.name" size="sm" />
        </button>
        <button type="button" class="lp__info" @click="add(e)">
          <strong>{{ e.name }}</strong>
          <span>
            {{ LABELS.muscleGroup[e.muscleGroup] }} · {{ LABELS.equipment[e.equipment] }}
            <i v-if="e.videoUrl || e.externalId" class="pi pi-video lp__has-video" title="Tem vídeo" />
          </span>
        </button>
        <Button
          :icon="justAdded === e.id ? 'pi pi-check' : 'pi pi-plus'"
          rounded
          size="small"
          :severity="props.inWorkout.has(e.id) ? 'secondary' : undefined"
          :aria-label="`Adicionar ${e.name}`"
          @click="add(e)"
        />
      </li>
      <li v-if="!pending && !list.length" class="lp__empty">
        <p>Nenhum exercício encontrado.</p>
        <Button label="Cadastrar exercício" icon="pi pi-plus" size="small" severity="secondary" outlined @click="emit('create')" />
      </li>
    </ul>
    <button type="button" class="lp__create" @click="emit('create')"><i class="pi pi-plus" /> Não achou? Cadastre um exercício novo</button>
  </div>
</template>

<style scoped>
.lp { display: flex; flex-direction: column; gap: 10px; min-height: 0; height: 100%; }
.lp__search { display: flex; flex-direction: column; gap: 8px; }
.lp__chips { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.chip {
  flex-shrink: 0; padding: 5px 10px; border-radius: 999px; cursor: pointer; border: 1px solid var(--app-border); background: var(--app-tile);
  font: inherit; font-size: 0.76rem; font-weight: 700; color: var(--app-text);
}
.chip--on { background: var(--cl-ink); border-color: var(--cl-ink); color: var(--cl-hi); }
.app-dark .chip--on { background: var(--cl-hi); border-color: var(--cl-hi); color: var(--cl-hi-ink); }
.lp__list { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; margin: 0 -4px; padding: 0 4px; }
.lp__list--busy { opacity: 0.5; }
.lp__row { display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 12px; transition: background 0.15s; }
.lp__row:hover { background: var(--app-bg); }
.lp__row--in .lp__info strong::after { content: ' ✓'; color: var(--accent-text); }
.lp__row--added { background: var(--accent-soft) !important; }
.lp__thumb { width: 64px; flex-shrink: 0; padding: 0; border: 0; background: none; cursor: zoom-in; border-radius: 10px; }
.lp__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; padding: 0; border: 0; background: none; text-align: left; cursor: pointer; font: inherit; color: var(--app-text); }
.lp__info strong { font-size: 0.88rem; font-weight: 800; line-height: 1.25; }
.lp__info span { font-size: 0.74rem; color: var(--app-muted); }
.lp__has-video { font-size: 0.7rem; margin-left: 4px; color: var(--accent-text); }
.lp__empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 0; color: var(--app-muted); font-size: 0.88rem; }
.lp__create { align-self: center; padding: 6px; border: 0; background: none; cursor: pointer; font: inherit; font-size: 0.8rem; font-weight: 700; color: var(--app-muted); }
.lp__create:hover { color: var(--app-text); }
</style>
