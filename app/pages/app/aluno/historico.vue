<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Histórico · CL Academy' })

const { refresh, filter, filtered, totals, weekly } = await useActivityHistory()
const { visible: shareOpen, story, open: openShare } = useStoryShare()
const { user } = useUserSession()
const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Treinos', value: 'treino' },
  { label: 'Corridas', value: 'corrida' },
]
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <AppPageHeader title="Histórico" subtitle="Tudo o que você já registrou">
      <Button label="Atualizar" icon="pi pi-refresh" size="small" text @click="refresh()" />
    </AppPageHeader>

    <div class="grid-auto" style="--min: 140px; --gap: 12px">
      <AppStatCard label="Registros" :value="totals.count" icon="pi-list" />
      <AppStatCard ink label="Km corridos" :value="totals.km" icon="pi-map" />
      <AppStatCard label="Pace médio" :value="formatPace(totals.pace)" icon="pi-stopwatch" />
    </div>

    <Card>
      <template #title>Últimas 8 semanas</template>
      <template #subtitle>Treinos por semana</template>
      <template #content>
        <AppBarChart :labels="weekly.map((w) => w.label)" :values="weekly.map((w) => w.count)" label="Treinos" />
      </template>
    </Card>

    <Card>
      <template #content>
        <SelectButton v-model="filter" :options="filters" option-label="label" option-value="value" :allow-empty="false" />
        <AppEmptyState v-if="!filtered.length" icon="pi-history" title="Sem registros" text="Conclua um treino para começar seu histórico." />
        <div v-else class="divided">
          <TrainingActivityItem v-for="l in filtered" :key="l.id" :log="l">
            <Button label="Compartilhar" icon="pi pi-share-alt" size="small" text class="share-btn" @click="openShare(storyFromLog(l, firstName(user?.name)))" />
          </TrainingActivityItem>
        </div>
      </template>
    </Card>

    <TrainingShareDialog v-model:visible="shareOpen" :story="story" />
  </div>
</template>

<style scoped>
.share-btn { margin: 6px 0 0 -10px; }
</style>
