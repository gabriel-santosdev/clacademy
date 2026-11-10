<script setup lang="ts">
import type { StoryData } from '~/features/training/domain/story'

definePageMeta({ layout: 'app' })
useHead({ title: 'Meus treinos · CL Academy' })

const { data, refresh, workouts, runs, locked, tab, weekView, visibleWeek } = await useMyTraining()
const { visible: logOpen, context: logContext, open: openLog } = useActivityLogger()
const { visible: shareOpen, story, open: openShare } = useStoryShare()

function onSaved(s: StoryData) {
  refresh()
  openShare(s)
}
</script>

<template>
  <div>
    <AppPageHeader title="Meus treinos" subtitle="Ficha do personal e planilha de corrida enviadas pelo seu professor" />

    <Card v-if="locked">
      <template #content>
        <AppEmptyState icon="pi-lock" title="Treinos bloqueados" text="Assine ou regularize seu plano para acessar seus treinos.">
          <Button as="router-link" to="/app/aluno/plano" label="Ver meu plano" />
        </AppEmptyState>
      </template>
    </Card>

    <Tabs v-else-if="data" v-model:value="tab">
      <TabList>
        <Tab value="academia"><i class="pi pi-bolt" /> Personal ({{ workouts.length }})</Tab>
        <Tab value="corrida"><i class="pi pi-map" /> Corrida ({{ runs.length }})</Tab>
      </TabList>
      <TabPanels class="panels">
        <TabPanel value="academia" class="stack">
          <Card v-if="!workouts.length">
            <template #content><AppEmptyState icon="pi-bolt" title="Nenhum treino ainda" text="Seu professor vai enviar seu treino em breve." /></template>
          </Card>
          <Card v-for="a in workouts" :key="a.id">
            <template #title>
              <span class="row" style="--gap: 8px">
                <Tag v-if="a.workout!.tag" :value="a.workout!.tag" />
                {{ a.workout!.title }}
              </span>
            </template>
            <template v-if="a.workout!.description" #subtitle>{{ a.workout!.description }}</template>
            <template #content>
              <div class="row tiny muted" style="margin-bottom: 12px">
                <span v-if="a.weekdays.length"><i class="pi pi-calendar" /> {{ a.weekdays.map((d) => WEEKDAYS_SHORT[d]).join(', ') }}</span>
                <span v-if="a.professor">· por {{ a.professor.name }}</span>
              </div>
              <Message v-if="a.notes" severity="secondary" size="small" icon="pi pi-pencil" style="margin-bottom: 12px">{{ a.notes }}</Message>
              <TrainingWorkoutPlayer
                :assignment-id="a.id"
                :workout-id="a.workout!.id"
                :items="a.workout!.items"
                @log="(extra) => openLog({ kind: 'treino', title: a.workout!.title, assignmentId: a.id, workoutId: a.workout!.id, ...extra })"
              />
            </template>
          </Card>
        </TabPanel>

        <TabPanel value="corrida" class="stack">
          <Card v-if="!runs.length">
            <template #content><AppEmptyState icon="pi-map" title="Nenhuma planilha ainda" text="Quando seu professor enviar sua planilha, ela aparece aqui." /></template>
          </Card>
          <Card v-for="a in runs" :key="a.id">
            <template #title>
              <div class="row row--between">
                <span>{{ a.runPlan!.title }}</span>
                <Tag :value="`Semana ${a.currentWeek} de ${a.runPlan!.weeks}`" severity="info" />
              </div>
            </template>
            <template v-if="a.runPlan!.goal" #subtitle>Objetivo: {{ a.runPlan!.goal }}</template>
            <template #content>
              <div class="weeks">
                <Button
                  v-for="w in a.runPlan!.weeks"
                  :key="w"
                  :label="`S${w}`"
                  size="small"
                  rounded
                  :severity="visibleWeek(a.id, a.currentWeek) === w ? undefined : 'secondary'"
                  :outlined="visibleWeek(a.id, a.currentWeek) !== w && a.currentWeek === w"
                  @click="weekView[a.id] = w"
                />
              </div>
              <div class="divided">
                <div v-for="s in a.runPlan!.sessions.filter((x) => x.week === visibleWeek(a.id, a.currentWeek))" :key="s.id" class="list-row">
                  <TrainingRunSession :session="s" show-day class="grow">
                    <Button
                      label="Registrar"
                      size="small"
                      severity="secondary"
                      @click="openLog({ kind: 'corrida', title: LABELS.runType[s.type], assignmentId: a.id, runSessionId: s.id, suggestedKm: s.distanceKm })"
                    />
                  </TrainingRunSession>
                </div>
              </div>
            </template>
          </Card>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <TrainingLogDialog v-model:visible="logOpen" :context="logContext" @saved="onSaved" />
    <TrainingShareDialog v-model:visible="shareOpen" :story="story" />
  </div>
</template>

<style scoped>
.panels { padding: 16px 0 0; background: transparent; }
.weeks { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 4px; }
.weeks :deep(.p-button) { flex-shrink: 0; }
:deep(.p-tab) { display: inline-flex; align-items: center; gap: 8px; }
</style>
