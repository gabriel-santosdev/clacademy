<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Treinos · CL Academy' })

const { data: workouts, refresh, search, list } = await useWorkoutLibrary()
const assign = reactive({ open: false, workoutId: 0 })
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Treinos de academia" subtitle="Monte fichas e envie para os alunos">
      <Button as="router-link" to="/app/professor/treinos/novo" label="Novo treino" icon="pi pi-plus" />
    </AppPageHeader>

    <IconField v-if="workouts.length" style="max-width: 360px">
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" placeholder="Buscar treino…" fluid />
    </IconField>

    <Card v-if="!workouts.length">
      <template #content>
        <AppEmptyState icon="pi-bolt" title="Nenhum treino criado" text="Crie sua primeira ficha de treino.">
          <Button as="router-link" to="/app/professor/treinos/novo" label="Criar treino" icon="pi pi-plus" />
        </AppEmptyState>
      </template>
    </Card>

    <div class="grid-auto" style="--min: 280px">
      <Card v-for="w in list" :key="w.id">
        <template #content>
          <div class="stack" style="--gap: 10px">
            <div class="row row--between">
              <Tag v-if="w.tag" :value="w.tag" />
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
