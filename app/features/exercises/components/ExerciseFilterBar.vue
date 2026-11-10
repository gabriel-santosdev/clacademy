<script setup lang="ts">
import type { MuscleGroup } from '#shared/utils/constants'
import type { ExerciseFilters } from '../domain/exercise'

/** Busca + chips de grupo muscular + equipamento. */
const filters = defineModel<ExerciseFilters>({ required: true })
defineProps<{ counts: Partial<Record<MuscleGroup, number>>; total: number }>()

function pick(g: MuscleGroup | null) {
  filters.value.group = filters.value.group === g ? null : g
}
</script>

<template>
  <div class="xf">
    <div class="xf__row">
      <IconField class="grow">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.q" placeholder="Buscar exercício (ex.: supino, glúteo, polia)" fluid />
      </IconField>
      <Select
        v-model="filters.equipment"
        :options="EQUIPMENT_OPTIONS"
        option-label="label"
        option-value="value"
        placeholder="Equipamento"
        show-clear
        class="xf__equip"
      />
    </div>
    <div class="xf__chips" role="group" aria-label="Grupo muscular">
      <button type="button" class="chip" :class="{ 'chip--on': !filters.group }" @click="pick(null)">Todos <b>{{ total }}</b></button>
      <template v-for="g in MUSCLE_GROUP_OPTIONS" :key="g.value">
        <button v-if="counts[g.value]" type="button" class="chip" :class="{ 'chip--on': filters.group === g.value }" @click="pick(g.value)">
          {{ g.label }} <b>{{ counts[g.value] }}</b>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.xf { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.xf__row { display: flex; gap: 8px; flex-wrap: wrap; }
.xf__row .grow { min-width: 220px; }
.xf__equip { min-width: 170px; }
/* chips em linha que rola na horizontal no celular */
.xf__chips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
.chip {
  flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--app-border); background: var(--app-tile); color: var(--app-text); font: inherit; font-size: 0.82rem; font-weight: 700;
}
.chip b { font-weight: 800; font-size: 0.72rem; color: var(--app-muted); }
.chip:hover { border-color: var(--app-muted); }
.chip--on { background: var(--cl-ink); border-color: var(--cl-ink); color: var(--cl-bone); }
.chip--on b { color: var(--cl-hi); }
.app-dark .chip--on { background: var(--cl-hi); border-color: var(--cl-hi); color: var(--cl-hi-ink); }
.app-dark .chip--on b { color: var(--cl-hi-ink); }
</style>
