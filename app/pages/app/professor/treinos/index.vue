<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Treinos · CL Academy' })

const { data: workouts, refresh, search, level, goal, list } = await useWorkoutLibrary()
const assign = reactive({ open: false, workoutId: 0 })

/** Até 4 miniaturas (exercícios do banco). */
const thumbs = <T extends { exercise?: unknown }>(items: T[]) => items.filter((i) => i.exercise).slice(0, 4)
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Treinos de academia" subtitle="Fichas modelo por perfil, prontas para enviar aos alunos">
      <Button as="router-link" to="/app/professor/exercicios" label="Banco de exercícios" icon="pi pi-images" severity="secondary" text />
      <Button as="router-link" to="/app/professor/treinos/novo" label="Novo treino" icon="pi pi-plus" />
    </AppPageHeader>

    <div v-if="workouts.length" class="filters">
      <IconField class="filters__search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" placeholder="Buscar treino…" fluid />
      </IconField>
      <Select v-model="level" :options="LEVEL_OPTIONS" option-label="label" option-value="value" placeholder="Nível" show-clear />
      <Select v-model="goal" :options="GOAL_OPTIONS" option-label="label" option-value="value" placeholder="Objetivo" show-clear />
    </div>

    <Card v-if="!workouts.length">
      <template #content>
        <AppEmptyState icon="pi-bolt" title="Nenhum treino criado" text="Crie sua primeira ficha a partir do banco de exercícios.">
          <Button as="router-link" to="/app/professor/treinos/novo" label="Criar treino" icon="pi pi-plus" />
        </AppEmptyState>
      </template>
    </Card>
    <AppEmptyState v-else-if="!list.length" icon="pi-filter" title="Nenhuma ficha para esse perfil" text="Ajuste os filtros ou crie uma ficha para esse perfil." />

    <div class="grid-auto" style="--min: 280px">
      <Card v-for="w in list" :key="w.id" class="wk">
        <template #content>
          <div class="stack" style="--gap: 10px">
            <div v-if="thumbs(w.items).length" class="wk__thumbs">
              <ExerciseMedia
                v-for="it in thumbs(w.items)"
                :key="it.id"
                :images="it.exercise!.images"
                :video="it.exercise!.videoUrl"
                :group="it.exercise!.muscleGroup"
                :alt="it.name"
                size="sm"
              />
            </div>
            <div class="row" style="--gap: 6px">
              <Tag v-if="w.tag" :value="w.tag" />
              <Tag v-if="w.level" :value="LABELS.trainingLevel[w.level]" severity="secondary" />
              <Tag v-if="w.goal" :value="LABELS.trainingGoal[w.goal]" severity="secondary" />
              <span class="grow" />
              <span class="tiny muted">{{ w.items.length }} exercícios</span>
            </div>
            <NuxtLink :to="`/app/professor/treinos/${w.id}`" class="h2">{{ w.title }}</NuxtLink>
            <p v-if="w.description" class="small muted">{{ w.description }}</p>
            <p class="tiny muted truncate">{{ w.items.map((i) => i.name).join(' · ') }}</p>
            <div class="row">
              <Button as="router-link" :to="`/app/professor/treinos/${w.id}`" label="Editar" icon="pi pi-pencil" size="small" severity="secondary" />
              <Button label="Atribuir" icon="pi pi-send" size="small" @click="Object.assign(assign, { open: true, workoutId: w.id })" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <TrainingAssignDialog v-model:visible="assign.open" :workout-id="assign.workoutId" @saved="refresh" />
  </div>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.filters__search { flex: 1; min-width: 220px; max-width: 360px; }
.wk__thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin: -4px -4px 0; }
.wk__thumbs :deep(.xm) { aspect-ratio: 1; }
</style>
