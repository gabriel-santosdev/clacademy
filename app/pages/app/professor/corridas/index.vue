<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Planilhas de corrida · CL Academy' })

const { data: plans, refresh } = await useRunPlanLibrary()
const assign = reactive({ open: false, runPlanId: 0 })
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Planilhas de corrida" subtitle="Assessoria CL Run: periodize e envie para os atletas">
      <Button as="router-link" to="/app/professor/corridas/novo" label="Nova planilha" icon="pi pi-plus" />
    </AppPageHeader>

    <Card v-if="!plans.length">
      <template #content>
        <AppEmptyState icon="pi-map" title="Nenhuma planilha" text="Crie uma planilha semanal com rodagens, intervalados e longões.">
          <Button as="router-link" to="/app/professor/corridas/novo" label="Criar planilha" icon="pi pi-plus" />
        </AppEmptyState>
      </template>
    </Card>

    <div class="grid-auto" style="--min: 280px">
      <Card v-for="p in plans" :key="p.id">
        <template #content>
          <div class="stack" style="--gap: 10px">
            <div class="row row--between">
              <Tag :value="`${p.weeks} semanas`" severity="info" />
              <span class="tiny muted">{{ p.sessions.length }} sessões · {{ totalKm(p.sessions) }} km</span>
            </div>
            <NuxtLink :to="`/app/professor/corridas/${p.id}`" class="h2">{{ p.title }}</NuxtLink>
            <p v-if="p.goal" class="small muted"><i class="pi pi-flag" /> {{ p.goal }}</p>
            <div class="row">
              <Button as="router-link" :to="`/app/professor/corridas/${p.id}`" label="Editar" icon="pi pi-pencil" size="small" severity="secondary" />
              <Button label="Atribuir" icon="pi pi-send" size="small" @click="Object.assign(assign, { open: true, runPlanId: p.id })" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <TrainingAssignDialog v-model:visible="assign.open" :run-plan-id="assign.runPlanId" @saved="refresh" />
  </div>
</template>
